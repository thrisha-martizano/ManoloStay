const SESSION_KEY = "loggedInUser";

window.onload = function () {
    const email = localStorage.getItem(SESSION_KEY);
    
    // IF WALAY EMAIL, SEND BALIK SA LANDING PAGE
    if (!email) {
        window.location.href = "prof.html"; 
        return;
    }
    
    loadProfile();
};

// LOAD PROFILE
async function loadProfile() {
    const email = localStorage.getItem(SESSION_KEY);

    try {
        const res = await fetch("get_profile.php?email=" + email);
        const user = await res.json();

        // Update the display text
        document.getElementById("display-name").innerText = user.userName;
        document.getElementById("profileEmail").innerText = user.userEmail;
        
        // Also update the header/nav name if it exists
        if(document.getElementById("nav-user-name")) {
            document.getElementById("nav-user-name").innerText = user.userName;
        }

        // Fill the modal inputs
        document.getElementById("edit-name").value = user.userName;
        document.getElementById("edit-email").value = user.userEmail;
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

function editProfile() {
    document.getElementById("edit-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// SAVE PROFILE CHANGES
async function saveProfile() {
    const oldEmail = localStorage.getItem(SESSION_KEY);
    const newName = document.getElementById("edit-name").value;
    const newEmail = document.getElementById("edit-email").value;

    const data = new URLSearchParams();
    data.append("oldEmail", oldEmail);
    data.append("name", newName);
    data.append("email", newEmail);

    const res = await fetch("update_profile.php", {
        method: "POST",
        body: data
    });

    const result = await res.text();

    if (result.trim() === "updated") {
        alert("Profile updated successfully!");
        localStorage.setItem(SESSION_KEY, newEmail);
        closeModal();
        loadProfile();
    } else {
        alert("Update failed! " + result);
    }
}

// UPDATE PASSWORD
async function updatePassword() {

    const email = localStorage.getItem(SESSION_KEY);

    const currentPass = document.getElementById("curr-pass").value;
    const newPass = document.getElementById("new-pass").value;
    const confirmPass = document.getElementById("confirm-pass").value;

    // CHECK EMPTY
    if (!currentPass || !newPass || !confirmPass) {
        alert("Please fill in all password fields.");
        return;
    }

    // CHECK MATCH
    if (newPass !== confirmPass) {
        alert("New passwords do not match!");
        return;
    }

    const data = new URLSearchParams();
    data.append("email", email);
    data.append("currentPassword", currentPass);
    data.append("newPassword", newPass);

    const res = await fetch("update_password.php", {
        method: "POST",
        body: data
    });

    const result = await res.text();

    if (result === "success") {
        alert("Password updated successfully!");

        document.getElementById("curr-pass").value = "";
        document.getElementById("new-pass").value = "";
        document.getElementById("confirm-pass").value = "";

    } else {
        alert(result);
    }
}

// LOGOUT LOGIC
function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    }
}