window.onload = function() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    
    if (loggedInUserEmail) {
        const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
        
    }

    loadBookings();
};

// Filter rows based on status
function filterBookings(status) {
    const rows = document.querySelectorAll('#bookings-body tr');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    rows.forEach(row => {
        if (status === 'all' || row.getAttribute('data-status') === status) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function showDetails(button) {
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modal-details-body');
    const modalActions = document.getElementById('modal-actions');

    const row = button.closest('tr');
    const statusAttr = row.getAttribute('data-status'); //

    // Table Data Extraction
    const accommodation = row.cells[0].querySelector('span').innerText;
    const dates = row.cells[1].innerText;
    const guests = row.cells[2].innerText;
    const amount = row.cells[3].innerText;
    const statusText = row.cells[4].innerText;

    modalBody.innerHTML = `
        <p><strong>🏨Accommodation:</strong> ${accommodation}</p>
        <p><strong>📅Check-in/out:</strong> ${dates}</p>
        <p><strong>👥Guests:</strong> ${guests}</p>
        <p><strong>💰Total Amount:</strong> ${amount}</p>
        <p><strong>📌Status:</strong> ${statusText}</p>
    `;

    modalActions.innerHTML = ''; // Clear previous buttons

    // ONLY SHOW EDIT/CANCEL IF STATUS IS PENDING
    if (statusAttr === 'pending') {
        modalActions.innerHTML = `
            <button onclick="editBooking()" class="edit-btn">Edit Details</button>
            <button onclick="cancelBooking(this)" class="cancel-btn">Cancel Booking</button>
        `;
        modal.dataset.currentRowIndex = row.rowIndex; //
    } else {
        modalActions.innerHTML = `<p style="font-size: 12px; color: #888;"><i>This booking is ${statusAttr} and cannot be modified.</i></p>`;
    }

    modal.style.display = 'block';
}

function editBooking() {
    const modal = document.getElementById('detailsModal');
    const rowIndex = modal.dataset.currentRowIndex;
    const table = document.querySelector('.bookings-table');
    const row = table.rows[rowIndex];

    // Pre-fill inputs with existing row data
    document.getElementById('edit-input-dates').value = row.cells[1].innerText;
    document.getElementById('edit-input-guests').value = row.cells[2].innerText;

    // Toggle Visibility
    document.getElementById('summary-view').style.display = 'none';
    document.getElementById('edit-view').style.display = 'block';
}

async function saveEdit() {

    const modal = document.getElementById('detailsModal');
    const rowIndex = modal.dataset.currentRowIndex;
    const table = document.querySelector('.bookings-table');
    const row = table.rows[rowIndex];

    const newDates = document.getElementById('edit-input-dates').value;
    const newGuests = document.getElementById('edit-input-guests').value;

    const bookingId = row.dataset.id;

    const res = await fetch("update_booking.php", {
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        body: `booking_id=${bookingId}&dates=${newDates}&guests=${newGuests}`
    });

    alert("Booking updated!");
    closeModal();
    loadBookings();
}

// function cancelBooking() {
//     if (confirm("Are you sure you want to cancel this pending booking?")) {
//         const modal = document.getElementById('detailsModal');
//         const rowIndex = modal.dataset.currentRowIndex;
//         const table = document.querySelector('.bookings-table');
//         const row = table.rows[rowIndex];
        
//         // 1. Get the identifying info (e.g., accommodation name)
//         const accommodationName = row.cells[0].querySelector('span').innerText;

//         // 2. Update Bookings Storage
//         let myBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
//         myBookings = myBookings.map(book => {
//             if (book.accommodation === accommodationName && book.status === 'pending') {
//                 return { ...book, status: 'cancelled' };
//             }
//             return book;
//         });
//         localStorage.setItem('userBookings', JSON.stringify(myBookings));

//         // 3. Update"Refunded"
//         let myPayments = JSON.parse(localStorage.getItem('userPayments')) || [];
//         myPayments = myPayments.map(pmt => {
//             // Match the payment to the booking being cancelled
//             if (pmt.bookingName === accommodationName) {
//                 return { ...pmt, status: 'Refunded' };
//             }
//             return pmt;
//         });
//         localStorage.setItem('userPayments', JSON.stringify(myPayments));
        
//         // 4. Update
//         row.setAttribute('data-status', 'cancelled');
//         row.cells[4].innerHTML = '<span class="status-badge cancelled">Cancelled</span>';
        
//         alert("Booking cancelled and payment marked as Refunded.");
//         closeModal();
//     }
// }

function cancelEdit() {
    const summaryView = document.getElementById('summary-view');
    const editView = document.getElementById('edit-view');

    if (summaryView && editView) {
        summaryView.style.display = 'block';
        editView.style.display = 'none';
    } else {
        console.error("Could not find the view containers!");
    }
}


async function loadBookings() {
    // const res = await fetch("get_bookings.php");
    // const myBookings = await res.json();

    // const bookingsBody = document.getElementById('bookings-body');
    // bookingsBody.innerHTML = "";

    // myBookings.forEach(book => {

    //     const row = document.createElement('tr');

    //    const row = document.createElement('tr');

    //     row.dataset.id = book.id;

    //     row.setAttribute('data-status', book.status);

    //     row.innerHTML = `
    //         <td>
    //             <div class="acc-cell">
    //                 <img src="/image/default.jpg">
    //                 <span>${book.accommodation_name}</span>
    //             </div>
    //         </td>
    //         <td>${book.check_in} - ${book.check_out}</td>
    //         <td>${book.guests}</td>
    //         <td>₱${book.amount}</td>
    //         <td><span class="status-badge ${book.status.toLowerCase()}">${book.status}</span></td>
    //         <td><button class="action-btn" onclick="showDetails(this)">View Details</button></td>
    //     `;

    //     bookingsBody.appendChild(row);
    // });

    const loggedInUserEmail =
    localStorage.getItem("loggedInUser");

const res = await fetch("get_bookings.php", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        email: loggedInUserEmail
    })

});
}


function closeModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Could not find the modal to close!");
    }
}