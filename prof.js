
function editProfile() {
    alert("Edit Profile mode activated!");
}

function updatePassword() {
    const newPass = document.getElementById('new-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;

    if (!newPass || !confirmPass) {
        alert("Please fill in the password fields.");
        return;
    }

    if (newPass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    alert("Password updated successfully!");
    // Clear fields
    document.getElementById('curr-pass').value = "";
    document.getElementById('new-pass').value = "";
    document.getElementById('confirm-pass').value = "";
}

// function handleLogout() {
//     if (confirm("Are you sure you want to logout?")) {
//         localStorage.clear(); // This "forgets" the credentials
//         window.location.href = "dex.html";
//     }
// }


const SESSION_KEY = "loggedInUser";

window.onload = function() {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) {
        window.location.href = "dex.html"; 
        return;
    }
    loadProfileData(email);
    
};

function loadProfileData(email) {
    const userData = JSON.parse(localStorage.getItem(email));

    if (userData) {
        // Display fields
        if(document.getElementById('display-name')) document.getElementById('display-name').innerText = userData.name;
        if(document.getElementById('profileEmail')) document.getElementById('profileEmail').innerText = userData.email;
        if(document.getElementById('display-phone')) document.getElementById('display-phone').innerText = userData.phone;
        if(document.getElementById('display-dob')) document.getElementById('display-dob').innerText = userData.dob;
        if(document.getElementById('display-address')) document.getElementById('display-address').innerText = userData.address;

        // Modal fields
        if(document.getElementById('edit-name')) document.getElementById('edit-name').value = userData.name;
        if(document.getElementById('edit-phone')) document.getElementById('edit-phone').value = userData.phone;
        if(document.getElementById('edit-dob')) document.getElementById('edit-dob').value = userData.dob;
        if(document.getElementById('edit-address')) document.getElementById('edit-address').value = userData.address;
    }
}

function saveProfile() {
    const email = localStorage.getItem(SESSION_KEY);
    const userData = JSON.parse(localStorage.getItem(email));

    userData.name = document.getElementById('edit-name').value;
    userData.phone = document.getElementById('edit-phone').value;
    userData.dob = document.getElementById('edit-dob').value;
    userData.address = document.getElementById('edit-address').value;

    localStorage.setItem(email, JSON.stringify(userData));
    loadProfileData(email);
    closeModal();
    alert("Profile Updated!");
}

function updatePassword() {
    const currPass = document.getElementById('curr-pass').value;
    const newPass = document.getElementById('new-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;
    
    const email = localStorage.getItem(SESSION_KEY);
    const userData = JSON.parse(localStorage.getItem(email));

    if (currPass !== userData.password) {
        alert("Current password incorrect!");
        return;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match!");
        return;
    }

    userData.password = newPass;
    localStorage.setItem(email, JSON.stringify(userData));
    alert("Password updated!");
}

function editProfile() { document.getElementById('edit-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('edit-modal').style.display = 'none'; }

// function logout() {
//     // This removes the specific user's data from the browser's memory
//     localStorage.removeItem('loggedInUser');
//     localStorage.removeItem('userBookings');
//     localStorage.removeItem('userPayments');
    
//     // Redirect to login page
//     window.location.href = "dex.html";
// }

function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        // Optional: localStorage.clear(); // Uncomment if you want to wipe data on logout
        window.location.href = "dex.html"; 
    }
}
