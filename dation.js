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


// =============================================
// ACCOMMODATIONS PAGE LOGIC
// =============================================
window.onload = function () {
    const loggedInUserEmail =
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("userEmail")    ||
        localStorage.getItem("email")        || "";

    if (loggedInUserEmail) {
        const emailField = document.getElementById('guest-email');
        if (emailField) {
            emailField.value    = loggedInUserEmail;
            emailField.readOnly = true;
        }
    }
};

// para sa search bar
function filterPlaces() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.getElementsByClassName('accomm-card');
    for (let i = 0; i < cards.length; i++) {
        const title    = cards[i].querySelector('h3').innerText.toLowerCase();
        const location = cards[i].querySelector('.loc').innerText.toLowerCase();
        cards[i].style.display = (title.includes(input) || location.includes(input)) ? "" : "none";
    }
}

// DETAILS VIEW FOR ACCOMMO.
function openDetails(name, price, image, location, description) {
    document.getElementById('accomm-list-view').style.display      = 'none';
    document.getElementById('property-details-view').style.display = 'block';

    document.getElementById('detail-title').innerText             = name;
    document.getElementById('detail-price').innerHTML             = `${price} <small>/ night</small>`;
    document.getElementById('detail-main-img').src                = image;
    document.querySelector('.sub-info').innerHTML                  = `⭐ 4.8 | <i class='bx bx-location-plus'></i> ${location}`;
    document.querySelector('.long-desc').innerText                 = description;

    const hiddenInput = document.getElementById('hidden-booking-name');
    if (hiddenInput) hiddenInput.value = name;

    const loggedInUserEmail =
        localStorage.getItem("loggedInUser") ||
        localStorage.getItem("userEmail")    ||
        localStorage.getItem("email")        || "";
    const emailField = document.getElementById('guest-email');
    if (emailField && loggedInUserEmail) {
        emailField.value    = loggedInUserEmail;
        emailField.readOnly = true;
    }

    window.scrollTo(0, 0);
}

// Close details view
function closeDetails() {
    document.getElementById('accomm-list-view').style.display      = 'block';
    document.getElementById('property-details-view').style.display = 'none';
}

// Confirm booking
function confirmBooking() {
    const guestNameInput = document.getElementById('guest-name');
    const guestName      = guestNameInput ? guestNameInput.value.trim() : "";

    if (!guestName) {
        alert("Please enter your Name to book.");
        return;
    }

    const accommodation = document.getElementById('detail-title')?.innerText || "Unknown Property";
    const priceText     = document.getElementById('detail-price')?.innerText || "0";
    const pricePerNight = parseFloat(priceText.replace(/[₱,]/g, '')) || 0;

    const dateInputs = document.querySelectorAll('#property-details-view input[type="date"]');
    const checkin    = dateInputs[0]?.value;
    const checkout   = dateInputs[1]?.value;

    if (!checkin || !checkout) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    const start       = new Date(checkin);
    const end         = new Date(checkout);
    const diffDays    = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    const nights      = diffDays > 0 ? diffDays : 1;
    const totalAmount = nights * pricePerNight;

    document.getElementById('hidden-amount').value       = totalAmount;
    document.getElementById('hidden-booking-name').value = accommodation;

    document.querySelector('.booking-card').submit();
}