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
    const hero = document.querySelector('.hero');
    const login = document.getElementById('login-section');
    const signup = document.getElementById('signup-section');
    const nav = document.querySelector('.navbar');

    // Hide everything first
    hero.style.display = 'none';
    login.style.display = 'none';
    signup.style.display = 'none';

    // Show the requested section
    if (sectionId === 'hero') {
        hero.style.display = 'flex';
        nav.style.display = 'flex'; // Ensure navbar is visible on home
    } else if (sectionId === 'login') {
        login.style.display = 'flex';
        nav.style.display = 'none'; // Hide navbar to focus on the login form
    } else if (sectionId === 'signup') {
        signup.style.display = 'flex';
        nav.style.display = 'none'; // Hide navbar to focus on the signup form
    }
}

// --- Auth Handling ---

/**
 * Handles the Login form submission.
 */
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    
    // In a real app, you would validate credentials against a database here.
    // For now, we save the email to track who is "logged in".
    localStorage.setItem("loggedInUser", email);
    
    alert("Login successful! Redirecting to your dashboard...");
    window.location.href = "dash.html";
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const userData = {
        name: name,
        email: email,
        password: password,
        phone: 'not set',
        dob: 'not set',
        address: 'not set'
    };

    // Save the whole object using email as the key
    localStorage.setItem(email, JSON.stringify(userData));
    localStorage.setItem("loggedInUser", email);
    
    alert("Account created!");
    window.location.href = "dash.html";
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const storedData = localStorage.getItem(email);
    
    if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.password === password) {
            localStorage.setItem("loggedInUser", email);
            window.location.href = "dash.html";
        } else {
            alert("Wrong password!");
        }
    } else {
        alert("User not found!");
    }
}

// --- UI Enhancements ---

// Optional: Change navbar background color when scrolling
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = 'white';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
    }
});