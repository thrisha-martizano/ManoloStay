//SA RESPONSIVE MENU
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

sidebarToggleBtn.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
sidebarOverlay.addEventListener('click', closeSidebar);
sidebar.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeSidebar();
    });
});
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeSidebar();
});

window.onload = function () {
    loadBookings();
};

//THIS IS FOR THE PICS TO SHOW IN THE BOOKING TAB
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

// Filter rows by status tab
function filterBookings(status) {
    const rows    = document.querySelectorAll('#bookings-body tr');
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        const show = status === 'all' || rowStatus === status.toLowerCase();
        row.style.display = show ? 'table-row' : 'none';
    });
}

function showDetails(button) {
    const modal        = document.getElementById('detailsModal');
    const modalBody    = document.getElementById('modal-details-body');
    const modalActions = document.getElementById('modal-actions');
    const row          = button.closest('tr');
    const statusAttr   = row.getAttribute('data-status');

    const accommodation = row.cells[0].querySelector('span').innerText;
    const dates         = row.cells[1].innerText;
    const guests        = row.cells[2].innerText;
    const amount        = row.cells[3].innerText;
    const statusText    = row.cells[4].innerText.trim();
    const bookingId     = row.dataset.id;

    modalBody.innerHTML = `
        <p><strong>🏨 Accommodation:</strong> ${accommodation}</p>
        <p><strong>📅 Check-in / Check-out:</strong> ${dates}</p>
        <p><strong>👥 Guests:</strong> ${guests}</p>
        <p><strong>💰 Total Amount:</strong> ${amount}</p>
        <p><strong>📌 Status:</strong> ${statusText}</p>
    `;

    modalActions.innerHTML = '';
    if (statusAttr === 'pending') {
        modalActions.innerHTML = `
            <button onclick="editBooking()" class="edit-btn">Edit Details</button>
            <button onclick="cancelBooking('${bookingId}')" class="cancel-btn">Cancel Booking</button>
        `;
        modal.dataset.currentRowIndex = row.rowIndex;
        modal.dataset.bookingId       = bookingId;
    } else {
        modalActions.innerHTML = `
            <p style="font-size:12px;color:#888;">
                <i>This booking is <strong>${statusText}</strong> and cannot be modified.</i>
            </p>`;
    }

    modal.style.display = 'block';
}

// PARA SA CANCEL BOOKING — updates booking to Cancelled + payment to Refunded
async function cancelBooking(bookingId) {
    const confirmed = confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

//NAAY PHP

    try {
        const response = await fetch('cancel_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_id: bookingId })
        });

        const text = await response.text();
        console.log("Cancel response:", text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            alert("Server error during cancellation. Check console.");
            return;
        }

        if (result.success) {
            alert("Booking cancelled. Payment has been marked as Refunded.");
            closeModal();
            loadBookings();
        } else {
            alert("Error: " + (result.error || "Could not cancel booking."));
        }
    } catch (err) {
        console.error("Cancel error:", err);
        alert("Could not cancel the booking.");
    }
}

function editBooking() {
    const modal    = document.getElementById('detailsModal');
    const rowIndex = modal.dataset.currentRowIndex;
    const table    = document.querySelector('.bookings-table');
    const row      = table.rows[rowIndex];

    document.getElementById('edit-input-dates').value  = row.cells[1].innerText;
    document.getElementById('edit-input-guests').value = row.cells[2].innerText;

    document.getElementById('summary-view').style.display = 'none';
    document.getElementById('edit-view').style.display    = 'block';
}

async function saveEdit() {
    const modal     = document.getElementById('detailsModal');
    const rowIndex  = modal.dataset.currentRowIndex;
    const table     = document.querySelector('.bookings-table');
    const row       = table.rows[rowIndex];
    const bookingId = row.dataset.id;

    const newDates  = document.getElementById('edit-input-dates').value;
    const newGuests = document.getElementById('edit-input-guests').value;

    //NAAY PHP
    await fetch("update_booking.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `booking_id=${bookingId}&dates=${encodeURIComponent(newDates)}&guests=${newGuests}`
    });

    alert("Booking updated!");
    closeModal();
    loadBookings();
}

function cancelEdit() {
    document.getElementById('summary-view').style.display = 'block';
    document.getElementById('edit-view').style.display    = 'none';
}

function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('summary-view').style.display = 'block';
        document.getElementById('edit-view').style.display    = 'none';
    }
}

async function loadBookings() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    const bookingsBody      = document.getElementById('bookings-body');

    //NAAY PHP
    try {
        const res = await fetch("get_bookings.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loggedInUserEmail })
        });

        const myBookings = await res.json();
        console.log("Bookings from DB:", myBookings);

        bookingsBody.innerHTML = "";

        if (!myBookings || myBookings.length === 0) {
            bookingsBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:20px;color:#aaa;">
                        No bookings found.
                    </td>
                </tr>`;
            return;
        }

        myBookings.forEach(book => {
            const row         = document.createElement('tr');
            row.dataset.id    = book.booking_id;
            const statusLower = (book.status || "pending").toLowerCase();
            row.setAttribute('data-status', statusLower);
            const amount  = parseFloat(book.amount) || 0;
            const imgSrc  = getAccomImage(book.accommodation_name);

            row.innerHTML = `
                <td>
                    <div class="acc-cell">
                        <img src="${imgSrc}" alt="${book.accommodation_name}"
                             style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
                        <span>${book.accommodation_name}</span>
                    </div>
                </td>
                <td>${book.check_in} - ${book.check_out}</td>
                <td>${book.guests}</td>
                <td>₱${amount.toLocaleString()}</td>
                <td><span class="status-badge ${statusLower}">${book.status}</span></td>
                <td><button class="action-btn" onclick="showDetails(this)">View Details</button></td>
            `;
            bookingsBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading bookings:", error);
        bookingsBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:20px;color:red;">
                    Error loading bookings. Check console (F12).
                </td>
            </tr>`;
    }
}