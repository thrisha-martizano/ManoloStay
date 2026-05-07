window.onload = function () {

    fetchDashboardData();

};

async function fetchDashboardData() {

    try {

        const response = await fetch("dash.php");

        const data = await response.json();

        console.log(data);

        updateDashboardStats(data.bookings, data.payments);

    } catch (error) {

        console.error("Dashboard load error:", error);

    }
}

function updateDashboardStats(bookings, payments) {

    const totalBookings = bookings.length;

    // TOTAL SPENT
    const totalSpent = payments
        .filter(p => p.status.toLowerCase() === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    // UPCOMING
    const upcoming = bookings.filter(b =>
        b.status.toLowerCase() === 'pending' ||
        b.status.toLowerCase() === 'confirmed'
    ).length;

    // COMPLETED
    const completed = bookings.filter(b =>
        b.status.toLowerCase() === 'completed'
    ).length;

    document.getElementById('total-bookings-count').innerText = totalBookings;

    document.getElementById('total-spent-amount').innerText =
        `₱${totalSpent.toLocaleString()}`;

    document.getElementById('upcoming-bookings-count').innerText = upcoming;

    document.getElementById('completed-stays-count').innerText = completed;

    loadRecent(bookings);

    updateCharts(bookings, payments);
}

function updateCharts(bookings, payments) {

    const monthCounts = new Array(12).fill(0);

    bookings.forEach(b => {

        const monthIndex = new Date(b.check_in).getMonth();

        if (!isNaN(monthIndex)) {
            monthCounts[monthIndex]++;
        }

    });

    const monthlySpending = new Array(12).fill(0);

    payments.forEach(p => {

        if (p.status.toLowerCase() === 'paid') {

            const monthIndex = new Date(p.payment_date).getMonth();

            if (!isNaN(monthIndex)) {

                monthlySpending[monthIndex] += parseFloat(p.amount || 0);

            }
        }
    });

    new Chart(document.getElementById('barChart'), {

        type: 'bar',

        data: {

            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            datasets: [{

                label: 'Bookings',

                data: monthCounts,

                backgroundColor: '#231b5a'

            }]
        }
    });

    new Chart(document.getElementById('lineChart'), {

        type: 'line',

        data: {

            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            datasets: [{

                label: 'Monthly Spending',

                data: monthlySpending,

                borderColor: '#0b0445',

                backgroundColor: 'rgba(220, 202, 247, 0.95)',

                fill: true,

                tension: 0.4

            }]
        }
    });

    const accMap = {};

    bookings.forEach(b => {

        const name = b.accommodation_name;

        accMap[name] = (accMap[name] || 0) + 1;

    });

    new Chart(document.getElementById('doughnutChart'), {

        type: 'doughnut',

        data: {

            labels: Object.keys(accMap),

            datasets: [{

                data: Object.values(accMap),

                backgroundColor: [
                    '#cab425',
                    '#ba3bb6',
                    '#3bb607',
                    '#c23745',
                    '#1c1ca0'
                ]
            }]
        }
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
            <img src="image/default.jpg">

            <div class="details">

                <h4>${book.accommodation_name}</h4>

                <p>${book.check_in} - ${book.check_out}</p>

            </div>

            <span class="status ${book.status}">
                ${book.status}
            </span>
        `;

        recentList.appendChild(div);

    });

    recentList.innerHTML += `
        <a href="books.html" class="view-all">
            View all bookings →
        </a>
    `;
}
