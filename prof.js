const SESSION_KEY = "loggedInUser";

window.onload = function () {
    loadProfile();
};

async function loadProfile() {
    let email = localStorage.getItem(SESSION_KEY) ||
                localStorage.getItem("userEmail")  ||
                localStorage.getItem("email")      || null;

    if (!email) {
        try { //This function loads the logged-in user's profile information. 
        // Retrieves user profile data & Displays account information dynamically. 

            const sessionRes = await fetch("get_session_email.php");
            const sessionData = await sessionRes.json();
            if (sessionData.email) {
                email = sessionData.email;
                localStorage.setItem(SESSION_KEY, email);
            }
        } catch (e) {
            console.warn("Could not get session email:", e);
        }
    }

    if (!email) {
        document.getElementById("display-name").innerText = "Not logged in";
        document.getElementById("profileEmail").innerText = "Please log in again.";
        return; //
    }

    try {
        const res  = await fetch("get_profile.php?email=" + encodeURIComponent(email));
        const text = await res.text();
        console.log("Profile response:", text);

        let user;
        try {
            user = JSON.parse(text);
        } catch (e) {
            console.error("Non-JSON from get_profile.php:", text);
            return;
        }

        if (user.error) {
            console.warn("Profile error:", user.error);
            return;
        }

        document.getElementById("display-name").innerText = user.userName  || "—";
        document.getElementById("profileEmail").innerText = user.userEmail || "—";
        document.getElementById("edit-name").value        = user.userName  || "";
        document.getElementById("edit-email").value       = user.userEmail || "";

        if (document.getElementById("nav-user-name")) {
            document.getElementById("nav-user-name").innerText = user.userName;
        }

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

async function saveProfile() {
    const oldEmail = localStorage.getItem(SESSION_KEY);
    const newName  = document.getElementById("edit-name").value.trim();
    const newEmail = document.getElementById("edit-email").value.trim();

    if (!newName || !newEmail) {
        alert("Name and email cannot be empty.");
        return;
    }

    const data = new URLSearchParams();
    data.append("oldEmail", oldEmail);
    data.append("name",     newName);
    data.append("email",    newEmail);
//This function updates the user's account information. 
// Updates user records in database & Demonstrates UPDATE operation. 

    const res    = await fetch("update_profile.php", { method: "POST", body: data });
    const result = await res.text();

    if (result.trim() === "updated") {
        alert("Profile updated successfully!");
        localStorage.setItem(SESSION_KEY, newEmail);
        closeModal();
        loadProfile();
    } else {
        alert("Update failed: " + result);
    }
}

async function updatePassword() {
    const email       = localStorage.getItem(SESSION_KEY);
    const currentPass = document.getElementById("curr-pass").value;
    const newPass     = document.getElementById("new-pass").value;
    const confirmPass = document.getElementById("confirm-pass").value;

    if (!currentPass || !newPass || !confirmPass) {
        alert("Please fill in all password fields.");
        return;
    }
    if (newPass !== confirmPass) {
        alert("New passwords do not match!");
        return;
    }

    const data = new URLSearchParams();
    data.append("email",           email);
    data.append("currentPassword", currentPass);
    data.append("newPassword",     newPass);

    const res    = await fetch("update_password.php", { method: "POST", body: data });
    const result = await res.text();

    if (result.trim() === "success") {
        alert("Password updated successfully!");
        document.getElementById("curr-pass").value    = "";
        document.getElementById("new-pass").value     = "";
        document.getElementById("confirm-pass").value = "";
    } else {
        alert(result);
    }
}

function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
    }
}