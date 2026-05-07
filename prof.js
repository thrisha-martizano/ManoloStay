const SESSION_KEY = "loggedInUser";

window.onload = function () {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) {
        window.location.href = "index.html";
        return;
    }
    loadProfile();
};

// LOAD PROFILE
async function loadProfile() {
    const email = localStorage.getItem(SESSION_KEY);

    const res = await fetch("get_profile.php?email=" + email);
    const user = await res.json();

    document.getElementById("display-name").innerText = user.userName;
    document.getElementById("profileEmail").innerText = user.userEmail;

    document.getElementById("edit-name").value = user.userName;
    document.getElementById("edit-email").value = user.userEmail;
}

// OPEN MODAL
function openModal() {
    document.getElementById("edit-modal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// SAVE PROFILE
async function saveProfile() {

    const oldEmail = localStorage.getItem(SESSION_KEY);

    const data = new URLSearchParams();
    data.append("oldEmail", oldEmail);
    data.append("name", document.getElementById("edit-name").value);
    data.append("email", document.getElementById("edit-email").value);

    const res = await fetch("update_profile.php", {
        method: "POST",
        body: data
    });

    const result = await res.text();

    if (result === "updated") {
        alert("Profile updated!");

        // update session if email changed
        localStorage.setItem(SESSION_KEY, document.getElementById("edit-email").value);

        closeModal();
        loadProfile();
    } else {
        alert("Update failed!");
    }
}