window.onload = function () {
    fetchDashboardData();
};

async function fetchDashboardData() {
    try {
        const loggedInUserEmail = localStorage.getItem("loggedInUser");

        const response = await fetch("dash.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loggedInUserEmail })
        });

        const data = await response.json();
        console.log("Dashboard data from DB:", data);

        if (!data.bookings || !data.payments) {
            console.warn("No data returned from dash.php");
            return;
        }

        updateDashboardStats(data.bookings, data.payments);
    } catch (error) {
        console.error("Dashboard load error:", error);
    }
}

function updateDashboardStats(bookings, payments) {
    const totalBookings = bookings.length;

    // TOTAL SPENT — sum all paid payments
    // payments table uses 'paid' status (lowercase from dationbok.php)
    const totalSpent = payments
        .filter(p => (p.status || "").toLowerCase() === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    // UPCOMING — Pending or Confirmed (matches your enum values)
    const upcoming = bookings.filter(b => {
        const s = (b.status || "").toLowerCase();
        return s === 'pending' || s === 'confirmed';
    }).length;

    // NOTE: Your DB enum is 'Pending','Confirmed','Cancelled' — no 'Completed'
    // Completed stays = bookings that are NOT pending/confirmed/cancelled
    const completed = bookings.filter(b =>
        (b.status || "").toLowerCase() === 'completed'
    ).length;

    document.getElementById('total-bookings-count').innerText = totalBookings;
    document.getElementById('total-spent-amount').innerText = `₱${totalSpent.toLocaleString()}`;
    document.getElementById('upcoming-bookings-count').innerText = upcoming;
    document.getElementById('completed-stays-count').innerText = completed;

    loadRecent(bookings);
    updateCharts(bookings, payments);
}

function updateCharts(bookings, payments) {
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun',
                         'Jul','Aug','Sep','Oct','Nov','Dec'];

    // --- BOOKINGS PER MONTH ---
    const monthCounts = new Array(12).fill(0);
    bookings.forEach(b => {
        // DB column name: check_in (date type)
        if (b.check_in) {
            const monthIndex = new Date(b.check_in).getMonth();
            if (!isNaN(monthIndex)) monthCounts[monthIndex]++;
        }
    });

    // --- MONTHLY SPENDING ---
    const monthlySpending = new Array(12).fill(0);
    payments.forEach(p => {
        if ((p.status || "").toLowerCase() === 'paid' && p.payment_date) {
            const monthIndex = new Date(p.payment_date).getMonth();
            if (!isNaN(monthIndex)) {
                monthlySpending[monthIndex] += parseFloat(p.amount || 0);
            }
        }
    });

    // Destroy old charts before redrawing
    if (window._barChart)      window._barChart.destroy();
    if (window._lineChart)     window._lineChart.destroy();
    if (window._doughnutChart) window._doughnutChart.destroy();

    // BAR CHART — Bookings Per Month
    window._barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Bookings',
                data: monthCounts,
                backgroundColor: '#231b5a'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });

    // LINE CHART — Monthly Spending
    window._lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Monthly Spending (₱)',
                data: monthlySpending,
                borderColor: '#0b0445',
                backgroundColor: 'rgba(220, 202, 247, 0.95)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    // DOUGHNUT CHART — Bookings by Accommodation
    // DB column: accommodation_name (in bookings table)
    const accMap = {};
    bookings.forEach(b => {
        const name = b.accommodation_name || "Unknown";
        accMap[name] = (accMap[name] || 0) + 1;
    });

    const accLabels = Object.keys(accMap);
    const accData   = Object.values(accMap);

    const doughnutCanvas = document.getElementById('doughnutChart');
    if (accLabels.length === 0) {
        doughnutCanvas.parentElement.querySelector('h3').insertAdjacentHTML(
            'afterend', '<p style="text-align:center;color:#aaa;font-size:13px;margin-top:10px;">No bookings yet</p>'
        );
    } else {
        window._doughnutChart = new Chart(doughnutCanvas, {
            type: 'doughnut',
            data: {
                labels: accLabels,
                datasets: [{
                    data: accData,
                    backgroundColor: ['#cab425','#ba3bb6','#3bb607','#c23745','#1c1ca0','#e67e22','#2980b9']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function loadRecent(bookings) {
    const recentList = document.getElementById('recent-bookings-list');
    recentList.innerHTML = '<h3>Recent Accommodation Bookings</h3>';

    if (bookings.length === 0) {
        recentList.innerHTML += '<p style="color:#aaa;padding:10px;">No recent bookings.</p>';
    } else {
        // Already ordered DESC from PHP — take first 3
        bookings.slice(0, 3).forEach(book => {
            const status = (book.status || "pending").toLowerCase();
            const div = document.createElement('div');
            div.className = 'booking-item';
            div.innerHTML = `
                <img src="image/default.jpg" alt="">
                <div class="details">
                    <h4>${book.accommodation_name || "—"}</h4>
                    <p>${book.check_in || "—"} → ${book.check_out || "—"}</p>
                </div>
                <span class="status ${status}">${book.status}</span>
            `;
            recentList.appendChild(div);
        });
    }

    recentList.innerHTML += `<a href="books.html" class="view-all">View all bookings →</a>`;
}