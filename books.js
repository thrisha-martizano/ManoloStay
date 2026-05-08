window.onload = function () {
    loadBookings();
};

// Filter rows by status tab
function filterBookings(status) {
    const rows = document.querySelectorAll('#bookings-body tr');
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    rows.forEach(row => {
        if (status === 'all' || row.getAttribute('data-status') === status.toLowerCase()) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function showDetails(button) {
    const modal      = document.getElementById('detailsModal');
    const modalBody  = document.getElementById('modal-details-body');
    const modalActions = document.getElementById('modal-actions');
    const row        = button.closest('tr');
    const statusAttr = row.getAttribute('data-status');

    const accommodation = row.cells[0].querySelector('span').innerText;
    const dates    = row.cells[1].innerText;
    const guests   = row.cells[2].innerText;
    const amount   = row.cells[3].innerText;
    const statusText = row.cells[4].innerText.trim();

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
            <button onclick="cancelBooking()" class="cancel-btn">Cancel Booking</button>
        `;
        modal.dataset.currentRowIndex = row.rowIndex;
    } else {
        modalActions.innerHTML = `<p style="font-size:12px;color:#888;"><i>This booking is ${statusAttr} and cannot be modified.</i></p>`;
    }

    modal.style.display = 'block';
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

// ✅ FULLY FIXED: sends email via POST, renders real DB rows
async function loadBookings() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    const bookingsBody = document.getElementById('bookings-body');

    try {
        const res = await fetch("get_bookings.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loggedInUserEmail })
        });

        const myBookings = await res.json();
        console.log("Bookings from DB:", myBookings);

        // Clear both hardcoded demo rows AND any previous dynamic rows
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
            const row = document.createElement('tr');
            row.dataset.id = book.booking_id;  // DB column: booking_id

            // DB enum: 'Pending','Confirmed','Cancelled'
            const statusLower = (book.status || "pending").toLowerCase();
            row.setAttribute('data-status', statusLower);

            const amount = parseFloat(book.amount) || 0;

            row.innerHTML = `
                <td>
                    <div class="acc-cell">
                        <img src="image/default.jpg" alt="">
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
                    Error loading bookings. Check console.
                </td>
            </tr>`;
    }
}