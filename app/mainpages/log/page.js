'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function LogPage() {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();

    // cleanupFns collects one remove function per addEventListener call
    // made below, since log.js re-declares several same-named `const`s in
    // separate scopes (top-level vs. inside its single `DOMContentLoaded`
    // listener) - tracking cleanups in an array avoids those naming
    // collisions while still letting us undo everything on unmount.
    const cleanupFns = [];

    // ---- Top-level script body of log.js (everything outside its single
    // `document.addEventListener('DOMContentLoaded', ...)` block). Since the
    // original <script> tag sits at the end of <body>, all of this runs
    // synchronously before `DOMContentLoaded` ever fires, so it belongs at
    // the top of this effect - matching real execution order. ----
    try {
      const roleSelectionTop = document.getElementById('roleSelection');
      const registrationFormTop = document.getElementById('registrationForm');
      const loginFormTop = document.getElementById('loginForm');
      const partnerSectionTop = document.getElementById('partnerSection');
      const userFormTop = document.getElementById('userForm');
      const loginFormElementTop = document.getElementById('loginFormElement');

      // Role Selection
      const roleBtns = document.querySelectorAll('.role-btn');
      const handleRoleBtnClickTop = function () {
        const role = this.dataset.role;
        roleSelectionTop.style.display = 'none';
        registrationFormTop.style.display = 'flex';

        if (role === 'partner') {
          partnerSectionTop.style.display = 'block';
          document.getElementById('primaryUserEmail').required = true;
          document.getElementById('relationship').required = true;
        } else {
          partnerSectionTop.style.display = 'none';
          document.getElementById('primaryUserEmail').required = false;
          document.getElementById('relationship').required = false;
        }
      };
      roleBtns.forEach((btn) => {
        btn.addEventListener('click', handleRoleBtnClickTop);
        cleanupFns.push(() => btn.removeEventListener('click', handleRoleBtnClickTop));
      });

      // Back Buttons
      const backToRoleBtn = document.getElementById('backToRole');
      const handleBackToRole = () => {
        registrationFormTop.style.display = 'none';
        roleSelectionTop.style.display = 'flex';
      };
      backToRoleBtn.addEventListener('click', handleBackToRole);
      cleanupFns.push(() => backToRoleBtn.removeEventListener('click', handleBackToRole));

      const backToRegisterBtn = document.getElementById('backToRegister');
      const handleBackToRegister = () => {
        loginFormTop.style.display = 'none';
        registrationFormTop.style.display = 'flex';
      };
      backToRegisterBtn.addEventListener('click', handleBackToRegister);
      cleanupFns.push(() => backToRegisterBtn.removeEventListener('click', handleBackToRegister));

      // Show Login Form
      const showLoginBtn = document.getElementById('showLogin');
      const handleShowLogin = (e) => {
        e.preventDefault();
        registrationFormTop.style.display = 'none';
        loginFormTop.style.display = 'flex';
      };
      showLoginBtn.addEventListener('click', handleShowLogin);
      cleanupFns.push(() => showLoginBtn.removeEventListener('click', handleShowLogin));

      // Toggle Password Visibility
      const togglePasswordBtns = document.querySelectorAll('.toggle-password');
      const handleTogglePassword = function () {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');

        if (input.type === 'password') {
          input.type = 'text';
          icon.setAttribute('data-lucide', 'eye-off');
        } else {
          input.type = 'password';
          icon.setAttribute('data-lucide', 'eye');
        }
        if (window.lucide) window.lucide.createIcons();
      };
      togglePasswordBtns.forEach((btn) => {
        btn.addEventListener('click', handleTogglePassword);
        cleanupFns.push(() => btn.removeEventListener('click', handleTogglePassword));
      });

      // Form Validation and Submission
      const handleUserFormSubmit = (e) => {
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
            .map((checkbox) => checkbox.value),
        };

        if (partnerSectionTop.style.display === 'block') {
          formData.relationship = document.getElementById('relationship').value;
          formData.primaryUserEmail = document.getElementById('primaryUserEmail').value;
        }

        // Store user data
        localStorage.setItem('cyclecare_user_data', JSON.stringify(formData));

        // Redirect to dashboard
        window.location.href = '/mainpages/tracker';
      };
      userFormTop.addEventListener('submit', handleUserFormSubmit);
      cleanupFns.push(() => userFormTop.removeEventListener('submit', handleUserFormSubmit));

      const handleLoginFormSubmit = (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Get stored user data
        const userData = JSON.parse(localStorage.getItem('cyclecare_user_data') || '{}');

        if (userData.email === email && userData.password === password) {
          window.location.href = '/mainpages/tracker';
        } else {
          alert('Invalid email or password');
        }
      };
      loginFormElementTop.addEventListener('submit', handleLoginFormSubmit);
      cleanupFns.push(() => loginFormElementTop.removeEventListener('submit', handleLoginFormSubmit));

      // Forgot Password
      const forgotPasswordBtn = document.getElementById('forgotPassword');
      const handleForgotPassword = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;

        if (email) {
          alert(`Password reset link would be sent to ${email}`);
        } else {
          alert('Please enter your email address');
        }
      };
      forgotPasswordBtn.addEventListener('click', handleForgotPassword);
      cleanupFns.push(() => forgotPasswordBtn.removeEventListener('click', handleForgotPassword));

      // Form Validation (date of birth)
      const dobInput = document.getElementById('dateOfBirth');
      const handleValidateDob = () => {
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
      };
      dobInput.addEventListener('change', handleValidateDob);
      cleanupFns.push(() => dobInput.removeEventListener('change', handleValidateDob));

      // Password Strength Validation
      const passwordInput = document.getElementById('password');
      const handlePasswordInput = (e) => {
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
      };
      passwordInput.addEventListener('input', handlePasswordInput);
      cleanupFns.push(() => passwordInput.removeEventListener('input', handlePasswordInput));
    } catch (err) {
      console.error(err);
    }

    // ---- Body of log.js's single `DOMContentLoaded` listener. This runs
    // last in real browser execution order (only after all top-level script
    // code above has finished and the document has fully parsed), and is
    // isolated in its own try/catch since it's an independently-invoked
    // event listener, separate from the top-level code above. Note it
    // re-declares several of the same element lookups under the same
    // names as the top-level code above (a pre-existing quirk of the
    // original file) - that's fine here since each block has its own
    // try { } scope. ----
    try {
      const roleButtonsDCL = document.querySelectorAll('.role-btn');
      const registrationFormDCL = document.getElementById('registrationForm');
      const roleSelectionDCL = document.getElementById('roleSelection');
      const partnerSectionDCL = document.getElementById('partnerSection');
      const personalSectionDCL = document.getElementById('personalSection');
      const healthSectionDCL = document.getElementById('healthSection');
      const savePartnerInfoButtonDCL = document.getElementById('savePartnerInfo');
      // eslint-disable-next-line no-unused-vars
      const createAccountButtonDCL = document.getElementById('createAccountButton');
      const partnerNameGroupDCL = document.getElementById('partnerNameGroup');

      let isCarePartner = false;

      const handleRoleButtonClickDCL = function () {
        const role = this.dataset.role;
        if (role === 'partner') {
          isCarePartner = true;
          // Care partner flow
          partnerSectionDCL.style.display = 'block';
          personalSectionDCL.style.display = 'none';
          healthSectionDCL.style.display = 'none';
          registrationFormDCL.style.display = 'block';
          roleSelectionDCL.style.display = 'none';
          partnerNameGroupDCL.style.display = 'block';
        } else {
          // Primary user flow
          isCarePartner = false;
          partnerSectionDCL.style.display = 'none';
          personalSectionDCL.style.display = 'block';
          healthSectionDCL.style.display = 'block';
          registrationFormDCL.style.display = 'block';
          roleSelectionDCL.style.display = 'none';
          partnerNameGroupDCL.style.display = 'none';
        }
      };
      roleButtonsDCL.forEach((button) => {
        button.addEventListener('click', handleRoleButtonClickDCL);
        cleanupFns.push(() => button.removeEventListener('click', handleRoleButtonClickDCL));
      });

      const handleSavePartnerInfo = () => {
        partnerSectionDCL.style.display = 'none';
        personalSectionDCL.style.display = 'block';
        healthSectionDCL.style.display = 'block';
      };
      savePartnerInfoButtonDCL.addEventListener('click', handleSavePartnerInfo);
      cleanupFns.push(() => savePartnerInfoButtonDCL.removeEventListener('click', handleSavePartnerInfo));

      const userFormDCL = document.getElementById('userForm');
      const handleUserFormSubmitDCL = function (event) {
        if (isCarePartner) {
          // Handle care partner submission
          event.preventDefault(); // Prevent standard form submission
          // Collect and process data from all three sections
          const relationship = document.getElementById('relationship').value;
          const primaryUserEmail = document.getElementById('primaryUserEmail').value;
          const fullName = document.getElementById('fullName').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const dateOfBirth = document.getElementById('dateOfBirth').value;
          const weight = document.getElementById('weight').value;
          const height = document.getElementById('height').value;
          const bloodGroup = document.getElementById('bloodGroup').value;

          // You can now send this data to your backend
          console.log('Care Partner Data:', {
            relationship,
            primaryUserEmail,
            fullName,
            email,
            password,
            dateOfBirth,
            weight,
            height,
            bloodGroup,
          });
        }
      };
      userFormDCL.addEventListener('submit', handleUserFormSubmitDCL);
      cleanupFns.push(() => userFormDCL.removeEventListener('submit', handleUserFormSubmitDCL));

      const relationshipButtonsDCL = document.querySelectorAll('.relationship-btn');
      const relationshipInputDCL = document.getElementById('relationship');

      const handleRelationshipBtnClick = function () {
        // Remove selected class from all buttons
        relationshipButtonsDCL.forEach((btn) => btn.classList.remove('selected'));
        // Add selected class to clicked button
        this.classList.add('selected');
        // Update hidden input value
        relationshipInputDCL.value = this.dataset.relationship;
      };
      relationshipButtonsDCL.forEach((button) => {
        button.addEventListener('click', handleRelationshipBtnClick);
        cleanupFns.push(() => button.removeEventListener('click', handleRelationshipBtnClick));
      });

      const handleRoleButtonClickDCL2 = function () {
        const role = this.dataset.role;
        if (role === 'partner') {
          partnerNameGroupDCL.style.display = 'block';
        } else {
          partnerNameGroupDCL.style.display = 'none';
        }
      };
      roleButtonsDCL.forEach((button) => {
        button.addEventListener('click', handleRoleButtonClickDCL2);
        cleanupFns.push(() => button.removeEventListener('click', handleRoleButtonClickDCL2));
      });
    } catch (err) {
      console.error(err);
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <title>BloomHer - Login</title>
      <link rel="stylesheet" href="/stylepages/log.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <header className="site-header">
        <div className="logo">
          <i data-lucide="heart"></i>
          <span>BloomHer</span>
        </div>
      </header>
      <div className="app">
        {/* Role Selection */}
        <div className="role-selection" id="roleSelection">
          <div className="role-card">
            <h1>Welcome to BloomHer</h1>
            <p>Please select your role to continue</p>

            <div className="role-buttons">
              <button className="role-btn" data-role="primary">
                <i data-lucide="user"></i>
                <span>I am tracking my cycle</span>
              </button>
              <button className="role-btn" data-role="partner">
                <i data-lucide="user"></i>
                <span>I am a care partner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="registration-form" id="registrationForm" style={{ display: 'none' }}>
          <div className="form-card">
            <div className="form-header">
              <button className="back-btn" id="backToRole">
                <i data-lucide="arrow-left"></i>
              </button>
              <h2>Create Your Account</h2>
            </div>

            <form id="userForm">
              <div className="form-sections">
                {/* Care Partner Information (Initially Visible if Care Partner) */}
                <div className="form-section" id="partnerSection">
                  <h3>Care Partner Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Choose Your Relationship</label>
                      <div className="relationship-buttons">
                        <button type="button" className="relationship-btn" data-relationship="partner">
                          <i data-lucide="heart"></i>
                          <span>Partner</span>
                        </button>
                        <button type="button" className="relationship-btn" data-relationship="daughter">
                          <i data-lucide="baby"></i>
                          <span>Daughter</span>
                        </button>
                        <button type="button" className="relationship-btn" data-relationship="wife">
                          <i data-lucide="user-cog-2"></i>
                          <span>Wife</span>
                        </button>
                        <button type="button" className="relationship-btn" data-relationship="sister">
                          <i data-lucide="users"></i>
                          <span>Sister</span>
                        </button>
                      </div>
                      <input type="hidden" id="relationship" name="relationship" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="primaryUserEmail">Primary User&apos;s Email</label>
                      <input type="email" id="primaryUserEmail" placeholder="Enter the email of the person you're supporting" />
                    </div>
                  </div>
                  <button type="button" className="primary-button" id="savePartnerInfo">
                    Save Partner Info
                    <i data-lucide="arrow-right"></i>
                  </button>
                </div>

                {/* Personal Information (Initially Hidden) */}
                <div className="form-section" id="personalSection" style={{ display: 'none' }}>
                  <h3>Personal Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fullName">Your Full Name</label>
                      <input type="text" id="fullName" required />
                    </div>

                    <div className="form-group" id="partnerNameGroup" style={{ display: 'none' }}>
                      <label htmlFor="partnerName">Primary User&apos;s Name</label>
                      <input type="text" id="partnerName" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="password-input">
                        <input type="password" id="password" required />
                        <button type="button" className="toggle-password">
                          <i data-lucide="eye"></i>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input type="date" id="dateOfBirth" required />
                    </div>
                  </div>
                </div>

                {/* Health Information (Initially Hidden) */}
                <div className="form-section" id="healthSection" style={{ display: 'none' }}>
                  <h3>Health Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="weight">Weight (kg)</label>
                      <input type="number" id="weight" min="30" max="200" step="0.1" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="height">Height (cm)</label>
                      <input type="number" id="height" min="100" max="250" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="age">Age</label>
                      <input type="number" id="age" min="13" max="100" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="bloodGroup">Blood Group</label>
                      <select id="bloodGroup" required>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="conditions">Medical Conditions</label>
                      <div className="checkbox-group">
                        <label className="checkbox">
                          <input type="checkbox" value="pcos" />
                          PCOS
                        </label>
                        <label className="checkbox">
                          <input type="checkbox" value="endometriosis" />
                          Endometriosis
                        </label>
                        <label className="checkbox">
                          <input type="checkbox" value="thyroid" />
                          Thyroid Issues
                        </label>
                        <label className="checkbox">
                          <input type="checkbox" value="diabetes" />
                          Diabetes
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="primary-button" id="createAccountButton">
                  Create Account
                  <i data-lucide="arrow-right"></i>
                </button>
                <p className="login-link">
                  Already have an account? <a href="#" id="showLogin">Log in</a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Login Form */}
        <div className="login-form" id="loginForm" style={{ display: 'none' }}>
          <div className="form-card">
            <div className="form-header">
              <button className="back-btn" id="backToRegister">
                <i data-lucide="arrow-left"></i>
              </button>
              <h2>Welcome Back</h2>
            </div>

            <form id="loginFormElement">
              <div className="form-group">
                <label htmlFor="loginEmail">Email</label>
                <input type="email" id="loginEmail" required />
              </div>

              <div className="form-group">
                <label htmlFor="loginPassword">Password</label>
                <div className="password-input">
                  <input type="password" id="loginPassword" required />
                  <button type="button" className="toggle-password">
                    <i data-lucide="eye"></i>
                  </button>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="primary-button">
                  Log In
                  <i data-lucide="log-in"></i>
                </button>
                <p className="forgot-password">
                  <a href="#" id="forgotPassword">Forgot your password?</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
