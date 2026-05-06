
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
        window.location.href = "index.html"; 
        return;
    }
    loadProfileData(email);
    
};

async function loadProfileData() {

    const res = await fetch("get_profile.php");
    const user = await res.json();

    document.getElementById('display-name').innerText = user.userName;
    document.getElementById('profileEmail').innerText = user.userEmail;
    document.getElementById('display-phone').innerText = user.phone || "";
    document.getElementById('display-dob').innerText = user.dob || "";
    document.getElementById('display-address').innerText = user.address || "";

    document.getElementById('edit-name').value = user.userName;
    document.getElementById('edit-phone').value = user.phone || "";
    document.getElementById('edit-dob').value = user.dob || "";
    document.getElementById('edit-address').value = user.address || "";
}

async function saveProfile() {

    const data = new URLSearchParams();
    data.append("name", document.getElementById('edit-name').value);
    data.append("phone", document.getElementById('edit-phone').value);
    data.append("dob", document.getElementById('edit-dob').value);
    data.append("address", document.getElementById('edit-address').value);

    await fetch("update_profile.php", {
        method: "POST",
        body: data
    });

    alert("Profile Updated!");
    closeModal();
    loadProfileData();
}

async function updatePassword() {

    const curr = document.getElementById('curr-pass').value;
    const newPass = document.getElementById('new-pass').value;
    const confirm = document.getElementById('confirm-pass').value;

    if (newPass !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const data = new URLSearchParams();
    data.append("current", curr);
    data.append("new", newPass);

    const res = await fetch("change_password.php", {
        method: "POST",
        body: data
    });

    const result = await res.text();

    if (result === "success") {
        alert("Password updated!");
    } else {
        alert("Current password incorrect!");
    }
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
        window.location.href = "index.html"; 
    }
}
