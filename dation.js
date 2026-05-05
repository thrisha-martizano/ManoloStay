window.onload = function() {
    const loggedInUserEmail = localStorage.getItem("loggedInUser");
    
    if (loggedInUserEmail) {
        const userData = JSON.parse(localStorage.getItem(loggedInUserEmail));
        // Profile data to the top right corner
        if(document.getElementById('nav-user-name')) {
            document.getElementById('nav-user-name').innerText = userData.name || " ";
        }
    }
};

// Function to handle the SEARCH BAR
function filterPlaces() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.getElementsByClassName('accomm-card');

    for (let i = 0; i < cards.length; i++) {
        const title = cards[i].querySelector('h3').innerText.toLowerCase();
        const location = cards[i].querySelector('.loc').innerText.toLowerCase();

        if (title.includes(input) || location.includes(input)) {
            cards[i].style.display = ""; 
        } else {
            cards[i].style.display = "none";
        }
    }
}

// Function to open the details view SA ACCOMMODATION
function openDetails(name, price, image, location, description) {
    // 1. Switch the views
    document.getElementById('accomm-list-view').style.display = 'none';
    document.getElementById('property-details-view').style.display = 'block';

    // 2. Update visible UI elements
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-price').innerHTML = `${price} <small>/ night</small>`;
    document.getElementById('detail-main-img').src = image;
    
    // 3. Update location and description
    document.querySelector('.sub-info').innerHTML = `⭐ 4.8 | <i class='bx bx-location-plus'></i> ${location}`;
    document.querySelector('.long-desc').innerText = description;

    // --- CRITICAL ADDITION FOR DATABASE ---
    // This updates the hidden input so the PHP script gets the correct name
    const hiddenInput = document.getElementById('hidden-booking-name');
    if (hiddenInput) {
        hiddenInput.value = name; 
    }
    // --------------------------------------

    window.scrollTo(0, 0);
}

function closeDetails() {
    document.getElementById('accomm-list-view').style.display = 'block';
    document.getElementById('property-details-view').style.display = 'none';
}

// THE CONFIRM BOOKING FUNCTION
function confirmBooking() {
    const guestNameInput = document.getElementById('guest-name');
    const guestName = guestNameInput ? guestNameInput.value : "";
    
    if (!guestName || guestName.trim() === "") {
        alert("Please enter your Full Name to book.");
        return;
    }

const accommodation = document.getElementById('detail-title')?.innerText || "Unknown Property";
    const priceText = document.getElementById('detail-price')?.innerText || "0";
    
    // Extract numeric price (removes ₱ and commas)
    const pricePerNight = parseFloat(priceText.replace(/[₱,]/g, '')) || 0;
    const mainImg = document.getElementById('detail-main-img')?.src || "";

    const dateInputs = document.querySelectorAll('#property-details-view input[type="date"]');
    const checkin = dateInputs[0]?.value;
    const checkout = dateInputs[1]?.value;

    // --- CALCULATION PART SA PERNIGHT 
    let totalAmount = pricePerNight; //  1 night if dates are missing
    if (checkin && checkout) {
        const start = new Date(checkin);
        const end = new Date(checkout);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // Ensure at least 1 night is charged even if same-day
        const nights = diffDays > 0 ? diffDays : 1;
        totalAmount = nights * pricePerNight;
    }
    const formattedTotal = `₱${totalAmount.toLocaleString()}`;
    // ---  END ---

    const guestSelect = document.querySelector('#property-details-view select');
    const guests = guestSelect ? guestSelect.value : "1 Guest";

    const sharedID = Date.now();
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const newBooking = {
        id: sharedID,
        accommodation: accommodation,
        dates: `${checkin} - ${checkout}`,
        guests: guests,
        amount: formattedTotal, // Use calculated total
        status: 'pending',
        image: mainImg
    };

    const newPayment = {
        id: sharedID,
        bookingName: accommodation,
        date: today,
        amount: formattedTotal, // Use calculated total
        method: 'GCash',
        status: 'paid'
    };

    try {
        // PANG Save Booking
        let myBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        myBookings.push(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(myBookings));

        // PANG Save Payment
        let myPayments = JSON.parse(localStorage.getItem('userPayments')) || [];
        myPayments.push(newPayment);
        localStorage.setItem('userPayments', JSON.stringify(myPayments));

        alert("Booking Successful! Payment recorded via GCash.");
        closeDetails();
    } catch (error) {
        console.error("Error:", error);
    }
}
