window.onload = function () {
    loadPaymentTable();
};

function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

async function loadPaymentTable() {
    const paymentsBody = document.getElementById('payments-body');

    // ✅ Try multiple common localStorage key names for the logged-in email
    const loggedInUserEmail =
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("userEmail") ||
        localStorage.getItem("email") ||
        null;

    console.log("Email from localStorage:", loggedInUserEmail);

    // Clear the hardcoded demo rows immediately
    paymentsBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:20px;color:#aaa;">
                Loading payments...
            </td>
        </tr>`;

    try {
        const response = await fetch('filephp/payments.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loggedInUserEmail })
        });

        const text = await response.text(); // Read as text first to catch PHP errors
        console.log("Raw response from payments.php:", text);

        let myPayments;
        try {
            myPayments = JSON.parse(text);
        } catch (e) {
            console.error("PHP returned non-JSON:", text);
            paymentsBody.innerHTML = `<tr><td colspan="5" style="color:red;padding:20px;text-align:center;">NO PAYMENTS MADE</td></tr>`;
            return;
        }

        paymentsBody.innerHTML = '';

        if (!myPayments || myPayments.length === 0) {
            paymentsBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;padding:20px;color:#aaa;">
                        No payment records found.
                    </td>
                </tr>`;
            updatePaymentStats([]);
            return;
        }

        myPayments.forEach(pmt => {
            const row = document.createElement('tr');
            const statusClass = (pmt.status || "").toLowerCase();
            const method = (pmt.method || "").toUpperCase();
            const amount = parseFloat(pmt.amount) || 0;

            row.innerHTML = `
                <td>${pmt.bookingName || "—"}</td>
                <td>${formatDate(pmt.payment_date)}</td>
                <td>₱${amount.toLocaleString()}</td>
                <td>${method}</td>
                <td><span class="status-pill ${statusClass}">${pmt.status}</span></td>
            `;
            paymentsBody.appendChild(row);
        });

        updatePaymentStats(myPayments);

    } catch (error) {
        console.error("Fetch error:", error);
        paymentsBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:20px;color:red;">
                    Could not load payments. Check console for details.
                </td>
            </tr>`;
    }
}

function updatePaymentStats(payments) {
    let totalPaid     = 0;
    let pendingAmount = 0;
    let pendingCount  = 0;
    let lastDate      = null;

    payments.forEach(pmt => {
        const amount = parseFloat(pmt.amount) || 0;
        const status = (pmt.status || "").toLowerCase();

        if (status === 'paid') {
            totalPaid += amount;
            if (pmt.payment_date) {
                const d = new Date(pmt.payment_date);
                if (!lastDate || d > lastDate) lastDate = d;
            }
        } else if (status === 'pending') {
            pendingAmount += amount;
            pendingCount++;
        }
    });

    document.getElementById('stat-total-paid').innerText    = `₱${totalPaid.toLocaleString()}`;
    document.getElementById('stat-pending-amount').innerText = `₱${pendingAmount.toLocaleString()}`;
    document.getElementById('stat-pending-count').innerText  = `${pendingCount} payment${pendingCount !== 1 ? 's' : ''}`;
    document.getElementById('stat-last-date').innerText = lastDate
        ? lastDate.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })
        : '---';
}