'use client';

import { useEffect } from 'react';

export default function ContactUsPage() {
  useEffect(() => {
    const contactForm = document.getElementById('contactForm');
    const socialIcons = document.querySelectorAll('.social-icon');
    let redirectTimeout;

    function handleSubmit(e) {
      e.preventDefault();

      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Message sent successfully!';
      document.body.appendChild(successMessage);

      successMessage.style.display = 'block';

      redirectTimeout = setTimeout(() => {
        successMessage.style.display = 'none';
        successMessage.remove();

        contactForm.reset();

        window.location.href = '/';
      }, 3000);
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleSubmit);
    }

    function handleMouseEnter() {
      this.style.transform = 'translateY(-3px)';
    }
    function handleMouseLeave() {
      this.style.transform = 'translateY(0)';
    }
    socialIcons.forEach((icon) => {
      icon.addEventListener('mouseenter', handleMouseEnter);
      icon.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      if (contactForm) {
        contactForm.removeEventListener('submit', handleSubmit);
      }
      socialIcons.forEach((icon) => {
        icon.removeEventListener('mouseenter', handleMouseEnter);
        icon.removeEventListener('mouseleave', handleMouseLeave);
      });
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <>
      <title>Contact Us - BloomHer</title>
      <link rel="stylesheet" href="/stylepages/contact.css" />
      <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />

      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="title-group">
                <h1 className="main-title"><i className="bx bxs-heart"></i> BloomHer</h1>
                <h2 className="sub-title"><i className="bx bx-user"></i> Contact Us</h2>
              </div>
            </div>
            <p className="subtitle">
              We&apos;re here to help and answer any questions you might have.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="bx bxl-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="bx bxl-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="mailto:support@bloomher.com" className="social-icon">
                <i className="bx bxl-gmail"></i>
              </a>
            </div>
          </div>
        </header>

        <div className="contact-container">
          <div className="contact-info">
            <div className="info-item">
              <i className="bx bx-envelope"></i>
              <div className="info-details">
                <h3>Email</h3>
                <p>bloomher@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <i className="bx bx-phone"></i>
              <div className="info-details">
                <h3>Phone</h3>
                <p>+91 9999999999</p>
              </div>
            </div>

            <div className="info-item">
              <i className="bx bx-map"></i>
              <div className="info-details">
                <h3>Address</h3>
                <p>123 Khalpar <br />Kolakta-700048</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <form id="contactForm">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" required></textarea>
              </div>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>

        <div className="back-button">
          <a href="/" className="btn-back">
            <i className="bx bx-left-arrow-alt"></i> Back to Home
          </a>
        </div>
      </div>
    </>
  );
}
