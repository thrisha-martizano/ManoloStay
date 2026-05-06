window.onload = function() {
    // User Name Sync
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    if (loggedInUserEmail) {
        const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
        if(document.getElementById('nav-user-name')) {
            document.getElementById('nav-user-name').innerText = userData.name || "User";
        }
    }
    
    // LoadPayments
    loadPaymentTable();
};

// Replace your old loadPaymentTable with this:
async function loadPaymentTable() {
    const paymentsBody = document.getElementById('payments-body');

    const loggedInUserEmail = localStorage.getItem("loggedInUser");

    try {
        const response = await fetch('filephp/get_payments.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: loggedInUserEmail })
        });

        const myPayments = await response.json();

        paymentsBody.innerHTML = '';

        myPayments.forEach(pmt => {
            const row = document.createElement('tr');
            const statusClass = pmt.status.toLowerCase();

            row.innerHTML = `
                <td>${pmt.bookingName}</td>
                <td>${formatDate(pmt.payment_date)}</td>
                <td>₱${parseFloat(pmt.amount).toLocaleString()}</td>
                <td>${pmt.method}</td>
                <td><span class="status-pill ${statusClass}">${pmt.status}</span></td>
            `;

            paymentsBody.appendChild(row);
        });

        updatePaymentStats();

    } catch (error) {
        console.error("Error loading payments:", error);
    }
}

function updatePaymentStats() {
    const rows = document.querySelectorAll('#payments-body tr');
    let totalPaid = 0;
    let pendingAmount = 0;
    let pendingCount = 0;
    let dates = [];

    rows.forEach(row => {
        const amountText = row.cells[2].innerText.replace(/[₱,]/g, '');
        const amount = parseFloat(amountText) || 0;
        const statusElement = row.querySelector('.status-pill');
        if (!statusElement) return; 

        const status = statusElement.innerText.toLowerCase();
        const dateText = row.cells[1].innerText;

        if (status === 'paid') {
            totalPaid += amount;
        } else if (status === 'pending') {
            pendingAmount += amount;
            pendingCount++;
        }
        // Note: MAWALA SA TOTAL PAID IF REFUNDED 'Total Paid'
        
        if (dateText !== "---") dates.push(new Date(dateText));
    });

    document.getElementById('stat-total-paid').innerText = `₱${totalPaid.toLocaleString()}`;
    document.getElementById('stat-pending-amount').innerText = `₱${pendingAmount.toLocaleString()}`;
    document.getElementById('stat-pending-count').innerText = `${pendingCount} payments`;
    if (dates.length > 0) {
        const latestDate = new Date(Math.max(...dates));
        document.getElementById('stat-last-date').innerText = latestDate.toLocaleDateString('en-US', { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    }
}

// // payment.js
// window.onload = function() {
//     console.log("Payment page loaded with database records.");
//     // You can add code here for search filters or opening modals
// };

// // If you want to add a search bar later to filter the table:
// function filterPayments() {
//     let input = document.getElementById("paymentSearch");
//     let filter = input.value.toUpperCase();
//     let tr = document.querySelectorAll("#payments-body tr");

//     tr.forEach(row => {
//         let text = row.textContent || row.innerText;
//         row.style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
//     });
// }