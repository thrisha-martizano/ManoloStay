// =============================================
// HAMBURGER MENU — RESPONSIVE NAV
// =============================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu   = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
});

// Close menu when a nav link is tapped
mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
    });
});

// Close menu when tapping outside
document.addEventListener('click', function(e) {
    if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
    }
});


// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background  = 'white';
        navbar.style.boxShadow   = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background  = 'transparent';
        navbar.style.boxShadow   = 'none';
    }
});

// =============================================
// EXPLORE BUTTON
// =============================================
document.querySelector('.explore-btn').addEventListener('click', () => {
    alert("Redirecting to accommodations...");
});

// =============================================
// SECTION NAVIGATION (Login / Signup / Hero)
// =============================================
function showSection(sectionId) {
    const hero   = document.querySelector('.hero');
    const login  = document.getElementById('login-section');
    const signup = document.getElementById('signup-section');
    const nav    = document.querySelector('.navbar');
    const mobNav = document.getElementById('mobile-menu');

    // Hide everything first
    hero.style.display   = 'none';
    login.style.display  = 'none';
    signup.style.display = 'none';

    // Close mobile menu if open
    mobNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');

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

// =============================================
// LOGIN HANDLER
// =============================================
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    localStorage.setItem("loggedInUser", email);
    alert("Login successful! Redirecting to your dashboard...");
    window.location.href = "dash.html";
}