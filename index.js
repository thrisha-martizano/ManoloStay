// Change navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'white';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Simple click event for the Explore button
document.querySelector('.explore-btn').addEventListener('click', () => {
    alert("Redirecting to accommodations...");
});

// --- Section Navigation ---
function showSection(sectionId) {
    const hero   = document.querySelector('.hero');
    const login  = document.getElementById('login-section');
    const signup = document.getElementById('signup-section');
    const nav    = document.querySelector('.navbar');

    // Hide everything first
    hero.style.display   = 'none';
    login.style.display  = 'none';
    signup.style.display = 'none';

    // Show the requested section
    if (sectionId === 'hero') {
        hero.style.display = 'flex';
        nav.style.display  = 'flex';
    } else if (sectionId === 'login') {
        login.style.display = 'flex';
        nav.style.display   = 'none';
    } else if (sectionId === 'signup') {
        signup.style.display = 'flex';
        nav.style.display    = 'none';
    }
}

// --- Auth Handling ---
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;

    // ✅ THIS LINE WAS COMMENTED OUT — now uncommented so all pages can read the email
    localStorage.setItem("loggedInUser", email);

    alert("Login successful! Redirecting to your dashboard...");
    window.location.href = "dash.html";
}

// --- UI Enhancements ---
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'white';
        nav.style.boxShadow  = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow  = 'none';
    }
});