// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const roleSelection = document.getElementById('roleSelection');
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const partnerSection = document.getElementById('partnerSection');
const userForm = document.getElementById('userForm');
const loginFormElement = document.getElementById('loginFormElement');

document.addEventListener('DOMContentLoaded', function() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const registrationForm = document.getElementById('registrationForm');
    const roleSelection = document.getElementById('roleSelection');
    const partnerSection = document.getElementById('partnerSection');
    const personalSection = document.getElementById('personalSection');
    const healthSection = document.getElementById('healthSection');
    const savePartnerInfoButton = document.getElementById('savePartnerInfo');
    const createAccountButton = document.getElementById('createAccountButton');
    const partnerNameGroup = document.getElementById('partnerNameGroup');

    let isCarePartner = false;

    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.dataset.role;
            if (role === 'partner') {
                isCarePartner = true;
                //Care partner flow
                partnerSection.style.display = 'block';
                personalSection.style.display = 'none';
                healthSection.style.display = 'none';
                registrationForm.style.display = 'block';
                roleSelection.style.display = 'none';
                partnerNameGroup.style.display = 'block';
            } else {
                //Primary user flow
                isCarePartner = false;
                partnerSection.style.display = 'none';
                personalSection.style.display = 'block';
                healthSection.style.display = 'block';
                registrationForm.style.display = 'block';
                roleSelection.style.display = 'none';
                partnerNameGroup.style.display = 'none';
            }
        });
    });

    savePartnerInfoButton.addEventListener('click', function() {
        partnerSection.style.display = 'none';
        personalSection.style.display = 'block';
        healthSection.style.display = 'block';
    });

    userForm.addEventListener('submit', function(event) {
        if (isCarePartner) {
            //Handle care partner submission
            event.preventDefault(); //Prevent standard form submission
            //Collect and process data from all three sections
            const relationship = document.getElementById('relationship').value;
            const primaryUserEmail = document.getElementById('primaryUserEmail').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const weight = document.getElementById('weight').value;
            const height = document.getElementById('height').value;
            const bloodGroup = document.getElementById('bloodGroup').value;

            //You can now send this data to your backend
            console.log('Care Partner Data:', {
                relationship,
                primaryUserEmail,
                fullName,
                email,
                password,
                dateOfBirth,
                weight,
                height,
                bloodGroup
            });
        }
    });

    const relationshipButtons = document.querySelectorAll('.relationship-btn');
    const relationshipInput = document.getElementById('relationship');

    relationshipButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            relationshipButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            // Update hidden input value
            relationshipInput.value = this.dataset.relationship;
        });
    });

    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.dataset.role;
            if (role === 'partner') {
                partnerNameGroup.style.display = 'block';
            } else {
                partnerNameGroup.style.display = 'none';
            }
        });
    });
});

// Role Selection
document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        roleSelection.style.display = 'none';
        registrationForm.style.display = 'flex';
        
        if (role === 'partner') {
            partnerSection.style.display = 'block';
            document.getElementById('primaryUserEmail').required = true;
            document.getElementById('relationship').required = true;
        } else {
            partnerSection.style.display = 'none';
            document.getElementById('primaryUserEmail').required = false;
            document.getElementById('relationship').required = false;
        }
    });
});

// Back Buttons
document.getElementById('backToRole').addEventListener('click', () => {
    registrationForm.style.display = 'none';
    roleSelection.style.display = 'flex';
});

document.getElementById('backToRegister').addEventListener('click', () => {
    loginForm.style.display = 'none';
    registrationForm.style.display = 'flex';
});

// Show Login Form
document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    registrationForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

// Toggle Password Visibility
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }
        lucide.createIcons();
    });
});

// Form Validation and Submission
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        conditions: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value)
    };

    if (partnerSection.style.display === 'block') {
        formData.relationship = document.getElementById('relationship').value;
        formData.primaryUserEmail = document.getElementById('primaryUserEmail').value;
    }

    // Store user data
    localStorage.setItem('cyclecare_user_data', JSON.stringify(formData));
    
    // Redirect to dashboard
    window.location.href = '../tracker/index.html';
});

loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get stored user data
    const userData = JSON.parse(localStorage.getItem('cyclecare_user_data') || '{}');
    
    if (userData.email === email && userData.password === password) {
        window.location.href = '../tracker/index.html';
    } else {
        alert('Invalid email or password');
    }
});

// Forgot Password
document.getElementById('forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    if (email) {
        alert(`Password reset link would be sent to ${email}`);
    } else {
        alert('Please enter your email address');
    }
});

// Form Validation
function validateDateOfBirth() {
    const dobInput = document.getElementById('dateOfBirth');
    const dob = new Date(dobInput.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    if (age < 13) {
        dobInput.setCustomValidity('You must be at least 13 years old');
    } else if (age > 70) {
        dobInput.setCustomValidity('Please enter a valid date of birth');
    } else {
        dobInput.setCustomValidity('');
    }
}

document.getElementById('dateOfBirth').addEventListener('change', validateDateOfBirth);

// Password Strength Validation
document.getElementById('password').addEventListener('input', (e) => {
    const password = e.target.value;
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        e.target.setCustomValidity('Password must be at least 8 characters long');
    } else if (!hasUpperCase || !hasLowerCase) {
        e.target.setCustomValidity('Password must contain both uppercase and lowercase letters');
    } else if (!hasNumbers) {
        e.target.setCustomValidity('Password must contain at least one number');
    } else if (!hasSpecialChar) {
        e.target.setCustomValidity('Password must contain at least one special character');
    } else {
        e.target.setCustomValidity('');
    }
});