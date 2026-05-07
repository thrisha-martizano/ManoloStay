window.onload = function () {

    fetchDashboardData();

};

async function fetchDashboardData() {

    const loggedInUserEmail =
        localStorage.getItem("loggedInUser");

    try {

        const response = await fetch("dash.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: loggedInUserEmail
            })

        });

        const data = await response.json();

        updateDashboardStats(
            data.bookings,
            data.payments
        );

    } catch (error) {

        console.error("Dashboard load error:", error);

    }
}

function updateDashboardStats(bookings, payments) {

    const totalBookings = bookings.length;

    const totalSpent = payments
        .filter(p => p.status.toLowerCase() === 'paid')
        .reduce((sum, p) =>
            sum + parseFloat(p.amount || 0), 0);

    const upcoming = bookings.filter(b =>
        b.status.toLowerCase() === 'pending' ||
        b.status.toLowerCase() === 'confirmed'
    ).length;

    const completed = bookings.filter(b =>
        b.status.toLowerCase() === 'completed'
    ).length;

    document.getElementById('total-bookings-count').innerText =
        totalBookings;

    document.getElementById('total-spent-amount').innerText =
        `₱${totalSpent.toLocaleString()}`;

    document.getElementById('upcoming-bookings-count').innerText =
        upcoming;

    document.getElementById('completed-stays-count').innerText =
        completed;

    loadRecent(bookings);
}