'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function HomePage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    function handleMobileMenuClick() {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', handleMobileMenuClick);
    }

    const nav = document.querySelector('nav');

    function handleNavScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleNavScroll);

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    function handleAnchorClick(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    const revealNowElements = document.querySelectorAll('.feature-card, .benefit-item, .hero-content, .hero-image');
    revealNowElements.forEach((element) => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const revealOnScrollElements = document.querySelectorAll('.feature-card, .benefit-item');
    revealOnScrollElements.forEach((element) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease-out';
      observer.observe(element);
    });

    function handleCommunityParallax() {
      const communitySection = document.querySelector('.community');
      if (communitySection) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        communitySection.style.backgroundPosition = `center ${rate}px`;
      }
    }
    window.addEventListener('scroll', handleCommunityParallax);

    function handleBackgroundScroll() {
      const scrolled = window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrolled / maxScroll) * 100;

      document.body.style.background = `
            linear-gradient(135deg, 
            hsl(${scrollProgress}, 100%, 95%) 0%,
            white 50%,
            hsl(${scrollProgress + 30}, 100%, 95%) 100%)
        `;
    }
    window.addEventListener('scroll', handleBackgroundScroll);

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    function handleDropdownToggleClick(event) {
      event.preventDefault();
      const dropdownMenu = event.currentTarget.nextElementSibling;

      document.querySelectorAll('.dropdown-menu').forEach((menu) => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('show');
        }
      });

      dropdownMenu.classList.toggle('show');
    }
    dropdownToggles.forEach((item) => {
      item.addEventListener('click', handleDropdownToggleClick);
    });

    function handleDocumentClickForDropdown(event) {
      const isClickInside = event.target.closest('.dropdown-toggle') || event.target.closest('.dropdown-menu');
      if (!isClickInside) {
        document.querySelectorAll('.dropdown-menu').forEach((menu) => {
          menu.classList.remove('show');
        });
      }
    }
    document.addEventListener('click', handleDocumentClickForDropdown);

    const startJourneyBtn = document.querySelector('.hero-content .btn-primary');
    const journeyMenu = document.createElement('div');
    journeyMenu.className = 'journey-menu hidden';

    journeyMenu.innerHTML = `
        <div class="journey-buttons">
            <a href="/mainpages/shop" class="journey-btn">
                <i data-lucide="shopping-bag"></i>
                <span>Shop</span>
            </a>
            <a href="/mainpages/blog" class="journey-btn">
                <i data-lucide="book"></i>
                <span>Blog</span>
            </a>
            <a href="/mainpages/tracker" class="journey-btn">
                <i data-lucide="calendar"></i>
                <span>Tracker</span>
            </a>
            <a href="/mainpages/diet" class="journey-btn">
                <i data-lucide="apple"></i>
                <span>Diet</span>
            </a>
            <a href="/mainpages/exercises" class="journey-btn">
                <i data-lucide="dumbbell"></i>
                <span>Exercises</span>
            </a>
             <a href="/mainpages/sleep" class="journey-btn">
                <i data-lucide="bed"></i>
                <span>Sleep</span>
            </a>
             <a href="/mainpages/stress" class="journey-btn">
                <i data-lucide="feather"></i>
                <span>stress</span>
            </a>
            <a href="/mainpages/expert" class="journey-btn">
                <i data-lucide="stethoscope"></i>
                <span>Expert</span>
            </a>
            <a href="/mainpages/community" class="journey-btn">
                <i data-lucide="users"></i>
                <span>Community</span>
            </a>
            <a href="/mainpages/contactus" class="journey-btn">
                <i data-lucide="message-circle"></i>
                <span>Contact Us</span>
            </a>

        </div>
    `;

    document.body.appendChild(journeyMenu);

    function handleStartJourneyClick() {
      journeyMenu.classList.toggle('hidden');
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
    if (startJourneyBtn) {
      startJourneyBtn.addEventListener('click', handleStartJourneyClick);
    }

    function handleDocumentClickForJourneyMenu(e) {
      if (!journeyMenu.contains(e.target) && startJourneyBtn && !startJourneyBtn.contains(e.target)) {
        journeyMenu.classList.add('hidden');
      }
    }
    document.addEventListener('click', handleDocumentClickForJourneyMenu);

    return () => {
      if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.removeEventListener('click', handleMobileMenuClick);
      }
      window.removeEventListener('scroll', handleNavScroll);
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      observer.disconnect();
      window.removeEventListener('scroll', handleCommunityParallax);
      window.removeEventListener('scroll', handleBackgroundScroll);
      dropdownToggles.forEach((item) => {
        item.removeEventListener('click', handleDropdownToggleClick);
      });
      document.removeEventListener('click', handleDocumentClickForDropdown);
      if (startJourneyBtn) {
        startJourneyBtn.removeEventListener('click', handleStartJourneyClick);
      }
      document.removeEventListener('click', handleDocumentClickForJourneyMenu);
      journeyMenu.remove();
    };
  }, []);

  return (
    <>
      <title>BloomHer - Menstrual & PCOS Management</title>
      <link rel="stylesheet" href="/stylepages/mainstyle.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="min-h-screen">
        <header className="container">
          <nav>
            <div className="logo">
              <i data-lucide="heart" className="icon-rose"></i>
              <span className="brand">BloomHer</span>
            </div>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="/mainpages/shop">Shop</a>
              <a href="/mainpages/blog">Blog</a>
              <div className="dropdown">
                <a href="" className="nav-link dropdown-toggle">Services</a>
                <div className="dropdown-menu">
                  <a href="/mainpages/tracker">Tracker</a>
                  <a href="/mainpages/diet">Diet</a>
                  <a href="/mainpages/exercises">Exercises</a>
                  <a href="/mainpages/sleep">Sleep Cycle</a>
                  <a href="/mainpages/stress">Stress </a>
                </div>
              </div>
              <a href="/mainpages/expert">Expert</a>
              <a href="/mainpages/community">Community</a>
              <a href="/mainpages/contactus">Contact Us</a>
              <a href="/mainpages/log" className="btn-primary">My Account</a>
            </div>
            <button className="mobile-menu-btn">
              <i data-lucide="menu" className="icon-dark"></i>
            </button>
          </nav>

          <div className="hero">
            <div className="hero-content">
              <h1>Take Control of Your <span className="text-rose">Cycle</span></h1>
              <p>Understand your body better with our comprehensive menstrual and PCOS management platform. Track, learn, and thrive with personalized insights. Our platform is designed to empower women by providing them with the tools and knowledge they need to manage their menstrual health effectively. Whether you&apos;re dealing with irregular cycles, PCOS, or just want to understand your body better, BloomHer is here to support you every step of the way. Join our community and take the first step towards a healthier, more informed you.</p>
              <button className="btn-primary">
                <span>Start Your Journey</span>
                <i data-lucide="arrow-right"></i>
              </button>
            </div>
            <div className="hero-image">
              <img src="/images/img1.webp" alt="Woman feeling empowered" />
            </div>
          </div>
        </header>

        <section id="features" className="features">
          <div className="container">
            <h2>Comprehensive Care Features</h2>
            <div className="feature-grid">
              <div className="feature-card">
                <i data-lucide="calendar" className="icon-rose"></i>
                <h3>Period Tracking</h3>
                <p>Advanced tracking with AI-powered predictions and symptom logging</p>
              </div>
              <div className="feature-card">
                <i data-lucide="activity" className="icon-rose"></i>
                <h3>PCOS Management</h3>
                <p>Specialized tools and insights for PCOS symptom management</p>
              </div>
              <div className="feature-card">
                <i data-lucide="clock" className="icon-rose"></i>
                <h3>Cycle Analysis</h3>
                <p>Detailed analysis of your cycle patterns and symptoms</p>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="container">
            <div className="benefits-content">
              <div className="benefits-text">
                <h2>Your Wellness Journey Starts Here</h2>
                <div className="benefit-items">
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i data-lucide="moon" className="icon-rose"></i>
                    </div>
                    <div className="benefit-info">
                      <h3>Track Your Cycle</h3>
                      <p>Log symptoms, moods, and activities throughout your cycle</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i data-lucide="sun" className="icon-rose"></i>
                    </div>
                    <div className="benefit-info">
                      <h3>Well-being Monitoring</h3>
                      <p>Get insights into your body&apos;s natural rhythms</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i data-lucide="book-open" className="icon-rose"></i>
                    </div>
                    <div className="benefit-info">
                      <h3>Expert Resources</h3>
                      <p>Access educational content from healthcare professionals</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i data-lucide="brain" className="icon-rose"></i>
                    </div>
                    <div className="benefit-info">
                      <h3>Mental Health Support</h3>
                      <p>Supervising your mind through our Experts</p>
                    </div>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">
                      <i data-lucide="bot" className="icon-rose"></i>
                    </div>
                    <div className="benefit-info">
                      <h3>24/7 AI Chatbot Support</h3>
                      <p>Get ultimate virtual assistance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="benefits-image">
                <img src="/images/img2.webp" alt="Wellness journey" />
              </div>
            </div>
          </div>
        </section>

        <section className="community">
          <div className="container">
            <i data-lucide="users" className="icon-rose icon-large"></i>
            <h2>Join Our Growing Community</h2>
            <p>Connect with others, share experiences, and learn from a supportive community of women on similar journeys.</p>
            <a href="/mainpages/community" className="btn-primary">Join Now</a>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <i data-lucide="heart" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="footer-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="/mainpages/contactus">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
