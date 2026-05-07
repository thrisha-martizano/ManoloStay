window.onload = function() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (loggedInUserEmail) {
        const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
        // if(document.getElementById('nav-user-name')) {
        //     document.getElementById('nav-user-name').innerText = userData.name || "User";
        // }
    }

    // Load and Calculate everything
    updateDashboardStats();
    fetchDashboardData();
};

function updateDashboardStats(bookings, payments) {
    async function fetchDashboardData() {
    try {
        const response = await fetch("dashboard_data.php");
        const data = await response.json();

        updateDashboardStats(data.bookings, data.payments);
    } catch (error) {
        console.error("Dashboard load error:", error);
    }
}

    const totalBookings = bookings.length;

    // SPENT
    const totalSpent = payments
        .filter(p => p.status.toLowerCase() === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // UPCOMING
    const upcoming = bookings.filter(b =>
        b.status === 'pending' || b.status === 'confirmed'
    ).length;

    // COMPLETED
    const completed = bookings.filter(b =>
        b.status === 'completed'
    ).length;

    document.getElementById('total-bookings-count').innerText = totalBookings;
    document.getElementById('total-spent-amount').innerText = `₱${totalSpent.toLocaleString()}`;
    document.getElementById('upcoming-bookings-count').innerText = upcoming;
    document.getElementById('completed-stays-count').innerText = completed;

    loadRecent(bookings);
    updateCharts(bookings, payments);
}

function updateCharts(bookings, payments) {
    // 1. PARA SA counts of bookings by month (for Bar Chart)
    const monthCounts = new Array(6).fill(0); // Jan to Jun
    bookings.forEach(b => {
        const datePart = b.dates.split(' - ')[0];
        const monthIndex = new Date(b.checkin_date).getMonth();
        if (monthIndex >= 0 && monthIndex < 6) monthCounts[monthIndex]++;
    });

    // 2. PARA SA calculate spending by month (for Line Chart)
    const monthlySpending = new Array(6).fill(0); // Jan to Jun
    payments.forEach(p => {
        // We only count 'paid' status toward monthly spending
        if (p.status.toLowerCase() === 'paid') {
            const monthIndex = new Date(p.payment_date).getMonth();
            if (monthIndex >= 0 && monthIndex < 6) {
                const amount = parseFloat(p.amount.replace(/[₱,]/g, ''));
                monthlySpending[monthIndex] += amount;
            }
        }
    });

    // --- BAR CHART: Bookings Per Month ---
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Bookings',
                data: monthCounts,
                backgroundColor: '#4495b6',
                borderRadius: 5
            }]
        }
    });

    // --- LINE CHART: Monthly Spending ---
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Spent',
                data: monthlySpending,
                borderColor: '#0b0445',
                backgroundColor: 'rgba(24, 0, 59, 0.41)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // --- DOUGHNUT CHART: Bookings by Accommodation ---
    const accMap = {};
    bookings.forEach(b => {
        accMap[b.accommodation] = (accMap[b.accommodation] || 0) + 1;
    });

    new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(accMap).length ? Object.keys(accMap) : ['No Data'],
            datasets: [{
                data: Object.values(accMap).length ? Object.values(accMap) : [1],
                backgroundColor: ['#cab425', '#ba3bb6', '#3bb607', '#c23745', '#1c1ca0']
            }]
        },
        options: { cutout: '60%' }
    });
}

function loadRecent(bookings) {
    const recentList = document.getElementById('recent-bookings-list');

    recentList.innerHTML = '<h3>Recent Accommodation Bookings</h3>';

    const recentData = bookings.slice(-3).reverse();

    recentData.forEach(book => {
        const div = document.createElement('div');
        div.className = 'booking-item';

        div.innerHTML = `
            <img src="${book.image || 'image/default.jpg'}">
            <div class="details">
                <h4>${book.accommodation_name}</h4>
                <p>${book.checkin_date} - ${book.checkout_date}</p>
            </div>
            <span class="status ${book.status}">${book.status}</span>
        `;

        recentList.appendChild(div);
    });

    recentList.innerHTML += `<a href="books.html" class="view-all">View all bookings →</a>`;
}