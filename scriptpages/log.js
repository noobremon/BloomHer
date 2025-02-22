// Initialize Lucide icons
lucide.createIcons();

// Store user data
let userData = {
    type: null,
    role: null
};

// Show specific step and hide others
function showStep(stepId) {
    document.querySelectorAll('.auth-step').forEach(step => {
        step.classList.add('hidden');
    });
    document.getElementById(stepId).classList.remove('hidden');
}

// Handle gender selection
function selectGender(gender) {
    userData.type = gender;
    if (gender === 'male') {
        showStep('maleRoleStep');
    } else {
        document.getElementById('userType').value = 'female';
        showStep('signupStep');
    }
}

// Handle role selection for male users
function selectRole(role) {
    userData.role = role;
    document.getElementById('userType').value = 'male';
    document.getElementById('userRole').value = role;
    showStep('signupStep');
}

// Go back based on current step
function goBack() {
    if (userData.type === 'male') {
        showStep('maleRoleStep');
    } else {
        showStep('welcomeStep');
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: password,
        userType: document.getElementById('userType').value,
        userRole: document.getElementById('userRole').value
    };
    
    // Here you would typically send the data to your backend
    console.log('Signup data:', formData);
    
    // For demo purposes, redirect to index
    window.location.href = 'index.html';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    // Here you would typically send the data to your backend
    console.log('Login data:', formData);
    
    // For demo purposes, redirect to index
    window.location.href = 'index.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show welcome step by default
    showStep('welcomeStep');
    
    // Initialize Lucide icons
    lucide.createIcons();
});