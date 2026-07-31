'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

// The original scriptpages/log.js attached THREE separate, conflicting
// click handlers to the same role buttons (one "top-level" handler and
// two more inside its DOMContentLoaded listener), which fought over the
// registration form's `display` value ('flex' vs 'block'), and TWO
// separate submit handlers on the same form. On top of that, the
// "is this a care-partner submission?" check always evaluated to false
// in practice (it re-checked a section's visibility *after* that section
// had already been hidden by an earlier step), so partner-specific data
// (relationship, primary user's email, partner's name) was silently
// dropped, and the manually-entered "age" field was collected nowhere.
// This rewrite keeps the exact same visual design/markup/CSS classes but
// drives the multi-step flow with React state instead of imperative,
// mutually-conflicting DOM writes, so the role selection -> registration
// (with the care-partner sub-step) -> account creation -> login flow
// actually works end-to-end.

function EyeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

const RELATIONSHIPS = [
  { value: 'partner', label: 'Partner', icon: 'heart' },
  { value: 'daughter', label: 'Daughter', icon: 'baby' },
  { value: 'wife', label: 'Wife', icon: 'user-cog-2' },
  { value: 'sister', label: 'Sister', icon: 'users' },
];

export default function LogPage() {
  // 'role' -> 'register' -> 'login' (or back)
  const [screen, setScreen] = useState('role');
  const [role, setRole] = useState(null); // 'primary' | 'partner'
  const [partnerInfoSaved, setPartnerInfoSaved] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [primaryUserEmail, setPrimaryUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const fullNameRef = useRef(null);
  const partnerNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dobRef = useRef(null);
  const weightRef = useRef(null);
  const heightRef = useRef(null);
  const ageRef = useRef(null);
  const bloodGroupRef = useRef(null);

  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [screen, role, partnerInfoSaved]);

  function selectRole(selected) {
    setRole(selected);
    setPartnerInfoSaved(false);
    setRelationship('');
    setPrimaryUserEmail('');
    setScreen('register');
  }

  function handleSavePartnerInfo() {
    if (!relationship) {
      alert('Please choose your relationship to the primary user.');
      return;
    }
    if (!primaryUserEmail) {
      alert("Please enter the primary user's email.");
      return;
    }
    setPartnerInfoSaved(true);
  }

  function handleDobChange(e) {
    const dob = new Date(e.target.value);
    const today = new Date();

    if (Number.isNaN(dob.getTime())) {
      e.target.setCustomValidity('');
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }

    if (age < 13) {
      e.target.setCustomValidity('You must be at least 13 years old');
    } else if (age > 70) {
      e.target.setCustomValidity('Please enter a valid date of birth');
    } else {
      e.target.setCustomValidity('');
    }
  }

  function handlePasswordChange(e) {
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
  }

  function handleCreateAccount(e) {
    e.preventDefault();

    const formData = {
      role,
      fullName: fullNameRef.current?.value || '',
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      dateOfBirth: dobRef.current?.value || '',
      age: ageRef.current?.value || '',
      weight: weightRef.current?.value || '',
      height: heightRef.current?.value || '',
      bloodGroup: bloodGroupRef.current?.value || '',
      conditions: Array.from(e.target.querySelectorAll('input[type="checkbox"]:checked'))
        .map((checkbox) => checkbox.value),
    };

    if (role === 'partner') {
      formData.relationship = relationship;
      formData.primaryUserEmail = primaryUserEmail;
      formData.partnerName = partnerNameRef.current?.value || '';
    }

    localStorage.setItem('cyclecare_user_data', JSON.stringify(formData));
    window.location.href = '/mainpages/tracker';
  }

  function handleLogin(e) {
    e.preventDefault();

    const email = loginEmailRef.current?.value || '';
    const password = loginPasswordRef.current?.value || '';

    const userData = JSON.parse(localStorage.getItem('cyclecare_user_data') || '{}');

    if (userData.email && userData.email === email && userData.password === password) {
      window.location.href = '/mainpages/tracker';
    } else {
      alert('Invalid email or password');
    }
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    const email = loginEmailRef.current?.value || '';

    if (email) {
      alert(`Password reset link would be sent to ${email}`);
    } else {
      alert('Please enter your email address');
    }
  }

  const showPartnerSection = role === 'partner' && !partnerInfoSaved;
  const showMainSections = role === 'primary' || (role === 'partner' && partnerInfoSaved);

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
        {screen === 'role' && (
          <div className="role-selection" id="roleSelection">
            <div className="role-card">
              <h1>Welcome to BloomHer</h1>
              <p>Please select your role to continue</p>

              <div className="role-buttons">
                <button type="button" className="role-btn" data-role="primary" onClick={() => selectRole('primary')}>
                  <i data-lucide="user"></i>
                  <span>I am tracking my cycle</span>
                </button>
                <button type="button" className="role-btn" data-role="partner" onClick={() => selectRole('partner')}>
                  <i data-lucide="user"></i>
                  <span>I am a care partner</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'register' && (
          <div className="registration-form" id="registrationForm">
            <div className="form-card">
              <div className="form-header">
                <button type="button" className="back-btn" id="backToRole" onClick={() => setScreen('role')}>
                  <i data-lucide="arrow-left"></i>
                </button>
                <h2>Create Your Account</h2>
              </div>

              <form id="userForm" onSubmit={handleCreateAccount}>
                <div className="form-sections">
                  {showPartnerSection && (
                    <div className="form-section" id="partnerSection">
                      <h3>Care Partner Information</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Choose Your Relationship</label>
                          <div className="relationship-buttons">
                            {RELATIONSHIPS.map((option) => (
                              <button
                                type="button"
                                key={option.value}
                                className={`relationship-btn${relationship === option.value ? ' selected' : ''}`}
                                data-relationship={option.value}
                                onClick={() => setRelationship(option.value)}
                              >
                                <i data-lucide={option.icon}></i>
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                          <input type="hidden" id="relationship" name="relationship" value={relationship} required readOnly />
                        </div>

                        <div className="form-group">
                          <label htmlFor="primaryUserEmail">Primary User&apos;s Email</label>
                          <input
                            type="email"
                            id="primaryUserEmail"
                            placeholder="Enter the email of the person you're supporting"
                            value={primaryUserEmail}
                            onChange={(e) => setPrimaryUserEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button type="button" className="primary-button" id="savePartnerInfo" onClick={handleSavePartnerInfo}>
                        Save Partner Info
                        <i data-lucide="arrow-right"></i>
                      </button>
                    </div>
                  )}

                  {showMainSections && (
                    <>
                      <div className="form-section" id="personalSection">
                        <h3>Personal Information</h3>
                        <div className="form-grid">
                          <div className="form-group">
                            <label htmlFor="fullName">Your Full Name</label>
                            <input type="text" id="fullName" ref={fullNameRef} required />
                          </div>

                          {role === 'partner' && (
                            <div className="form-group" id="partnerNameGroup">
                              <label htmlFor="partnerName">Primary User&apos;s Name</label>
                              <input type="text" id="partnerName" ref={partnerNameRef} required />
                            </div>
                          )}

                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" ref={emailRef} required />
                          </div>

                          <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                ref={passwordRef}
                                onChange={handlePasswordChange}
                                required
                              />
                              <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                              </button>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input type="date" id="dateOfBirth" ref={dobRef} onChange={handleDobChange} required />
                          </div>
                        </div>
                      </div>

                      <div className="form-section" id="healthSection">
                        <h3>Health Information</h3>
                        <div className="form-grid">
                          <div className="form-group">
                            <label htmlFor="weight">Weight (kg)</label>
                            <input type="number" id="weight" ref={weightRef} min="30" max="200" step="0.1" required />
                          </div>

                          <div className="form-group">
                            <label htmlFor="height">Height (cm)</label>
                            <input type="number" id="height" ref={heightRef} min="100" max="250" required />
                          </div>
                          <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input type="number" id="age" ref={ageRef} min="13" max="100" required />
                          </div>

                          <div className="form-group">
                            <label htmlFor="bloodGroup">Blood Group</label>
                            <select id="bloodGroup" ref={bloodGroupRef} required defaultValue="">
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
                    </>
                  )}
                </div>

                <div className="form-footer">
                  {showMainSections && (
                    <button type="submit" className="primary-button" id="createAccountButton">
                      Create Account
                      <i data-lucide="arrow-right"></i>
                    </button>
                  )}
                  <p className="login-link">
                    Already have an account?{' '}
                    <a
                      href="#"
                      id="showLogin"
                      onClick={(e) => {
                        e.preventDefault();
                        setScreen('login');
                      }}
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {screen === 'login' && (
          <div className="login-form" id="loginForm">
            <div className="form-card">
              <div className="form-header">
                <button type="button" className="back-btn" id="backToRegister" onClick={() => setScreen('register')}>
                  <i data-lucide="arrow-left"></i>
                </button>
                <h2>Welcome Back</h2>
              </div>

              <form id="loginFormElement" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="loginEmail">Email</label>
                  <input type="email" id="loginEmail" ref={loginEmailRef} required />
                </div>

                <div className="form-group">
                  <label htmlFor="loginPassword">Password</label>
                  <div className="password-input">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="loginPassword"
                      ref={loginPasswordRef}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="form-footer">
                  <button type="submit" className="primary-button">
                    Log In
                    <i data-lucide="log-in"></i>
                  </button>
                  <p className="forgot-password">
                    <a href="#" id="forgotPassword" onClick={handleForgotPassword}>Forgot your password?</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
