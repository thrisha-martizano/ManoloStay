// =============================================
// SIDEBAR TOGGLE — RESPONSIVE MOBILE MENU
// =============================================
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebar          = document.getElementById('sidebar');
const sidebarOverlay   = document.getElementById('sidebar-overlay');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    sidebarToggleBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    sidebarToggleBtn.classList.remove('open');
    document.body.style.overflow = '';
}

sidebarToggleBtn.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when a nav link is tapped on mobile
sidebar.querySelectorAll('.sidebar-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) closeSidebar();
    });
});

// Auto-close when rotating to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) closeSidebar();
});


// =============================================
// DASHBOARD DATA
// =============================================
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

    const totalSpent = payments
        .filter(p => (p.status || "").toLowerCase() === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const upcoming = bookings.filter(b => {
        const s = (b.status || "").toLowerCase();
        return s === 'pending' || s === 'confirmed';
    }).length;

    const completed = bookings.filter(b =>
        (b.status || "").toLowerCase() === 'completed'
    ).length;

    document.getElementById('total-bookings-count').innerText = totalBookings;
    document.getElementById('total-spent-amount').innerText   = `₱${totalSpent.toLocaleString()}`;
    document.getElementById('upcoming-bookings-count').innerText = upcoming;
    document.getElementById('completed-stays-count').innerText   = completed;

    loadRecent(bookings);
    updateCharts(bookings, payments);
}

function updateCharts(bookings, payments) {
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun',
                         'Jul','Aug','Sep','Oct','Nov','Dec'];

    const monthCounts = new Array(12).fill(0);
    bookings.forEach(b => {
        if (b.check_in) {
            const monthIndex = new Date(b.check_in).getMonth();
            if (!isNaN(monthIndex)) monthCounts[monthIndex]++;
        }
    });

    const monthlySpending = new Array(12).fill(0);
    payments.forEach(p => {
        if ((p.status || "").toLowerCase() === 'paid' && p.payment_date) {
            const monthIndex = new Date(p.payment_date).getMonth();
            if (!isNaN(monthIndex)) {
                monthlySpending[monthIndex] += parseFloat(p.amount || 0);
            }
        }
    });

    if (window._barChart)      window._barChart.destroy();
    if (window._lineChart)     window._lineChart.destroy();
    if (window._doughnutChart) window._doughnutChart.destroy();

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

function getAccomImage(name) {
    const map = {
        'Dream Residence'      : 'image/dreamres.png',
        'Sky Travellers Inn'   : 'image/sky.png',
        "Sky's Travellers Inn" : 'image/sky.png',
        'Concetta Inn'         : 'image/contdres.png',
        'Sorelle'              : 'image/sorelle.png',
        'Balai Dicklum'        : 'image/bali.png',
        'KJSGrandeInnOpens'    : 'image/kjs.png',
    };
    if (map[name]) return map[name];
    for (const key in map) {
        if (name && name.toLowerCase().includes(key.toLowerCase())) return map[key];
    }
    return 'image/dreamres.png';
}

function loadRecent(bookings) {
    const recentList = document.getElementById('recent-bookings-list');
    recentList.innerHTML = '<h3>Recent Accommodation Bookings</h3>';

    if (bookings.length === 0) {
        recentList.innerHTML += '<p style="color:#aaa;padding:10px;">No recent bookings.</p>';
    } else {
        bookings.slice(0, 3).forEach(book => {
            const status = (book.status || "pending").toLowerCase();
            const imgSrc = getAccomImage(book.accommodation_name);
            const div = document.createElement('div');
            div.className = 'booking-item';
            div.innerHTML = `
                <img src="${imgSrc}" alt="${book.accommodation_name}"
                     style="width:55px;height:55px;object-fit:cover;border-radius:8px;">
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