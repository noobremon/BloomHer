'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ExercisesPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    function handleAnchorClick(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
      });
    }
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    const phaseCards = document.querySelectorAll('.phase-card');

    function handleMouseEnter() {
      this.style.transform = 'translateY(-10px)';
    }
    function handleMouseLeave() {
      this.style.transform = 'translateY(0)';
    }
    function handleCardClick() {
      phaseCards.forEach((c) => c.classList.remove('active'));
      this.classList.add('active');
    }

    phaseCards.forEach((card) => {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('click', handleCardClick);
    });

    const nav = document.querySelector('nav');
    let lastScroll = 0;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }

      if (currentScroll > lastScroll && currentScroll > 50) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      phaseCards.forEach((card) => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('click', handleCardClick);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <title>BloomHer - Cycle-Based Exercises</title>
      <link rel="stylesheet" href="/stylepages/exercises.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <nav>
        <div className="nav-container">
          <div className="logo">
            <i data-lucide="heart" className="brand-icon"></i>
            <h1>BloomHer</h1>
          </div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="#phases">Cycle Phases</a>
            <a href="/mainpages/contactus">Contact</a>
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Exercise Throughout Your Cycle</h1>
          <p>Discover the perfect workouts for each phase of your menstrual cycle</p>
          <a href="#phases" className="cta-button">Explore Phases</a>
        </div>
      </section>

      <section id="phases" className="phases">
        <h2>Cycle Phases & Recommended Exercises</h2>

        <div className="phase-cards">
          <div className="phase-card" data-phase="menstrual">
            <div className="phase-icon">
              <i className="bx bx-droplet"></i>
            </div>
            <h3>Menstrual Phase</h3>
            <p>Days 1-5</p>
            <div className="phase-content">
              <h4>Recommended Exercises:</h4>
              <ul>
                <li>Light Walking</li>
                <li>Gentle Yoga</li>
                <li>Stretching</li>
                <li>Light Swimming</li>
              </ul>
              <p className="phase-description">
                Focus on gentle movements and restorative exercises. Listen to your body and rest when needed.
              </p>
            </div>
          </div>

          <div className="phase-card" data-phase="follicular">
            <div className="phase-icon">
              <i className="bx bx-flower"></i>
            </div>
            <h3>Follicular Phase</h3>
            <p>Days 6-14</p>
            <div className="phase-content">
              <h4>Recommended Exercises:</h4>
              <ul>
                <li>High-Intensity Interval Training</li>
                <li>Strength Training</li>
                <li>Running</li>
                <li>Dance Classes</li>
              </ul>
              <p className="phase-description">
                Energy levels are rising! This is a great time for trying new workouts and challenging yourself.
              </p>
            </div>
          </div>

          <div className="phase-card" data-phase="ovulation">
            <div className="phase-icon">
              <i className="bx bx-sun"></i>
            </div>
            <h3>Ovulation Phase</h3>
            <p>Days 14-21</p>
            <div className="phase-content">
              <h4>Recommended Exercises:</h4>
              <ul>
                <li>Circuit Training</li>
                <li>Power Yoga</li>
                <li>Cycling</li>
                <li>Group Sports</li>
              </ul>
              <p className="phase-description">
                Peak energy and strength! Perfect time for challenging workouts and social exercise activities.
              </p>
            </div>
          </div>

          <div className="phase-card" data-phase="luteal">
            <div className="phase-icon">
              <i className="bx bx-moon"></i>
            </div>
            <h3>Luteal Phase</h3>
            <p>Days 22-28</p>
            <div className="phase-content">
              <h4>Recommended Exercises:</h4>
              <ul>
                <li>Pilates</li>
                <li>Low-Impact Cardio</li>
                <li>Light Strength Training</li>
                <li>Meditation</li>
              </ul>
              <p className="phase-description">
                Focus on maintaining routine while gradually reducing intensity as the phase progresses.
              </p>
            </div>
          </div>

          <div className="phase-card" data-phase="no-period">
            <div className="phase-icon">
              <i className="bx bx-leaf"></i>
            </div>
            <h3>No Period Phase</h3>
            <p>For those not experiencing menstruation</p>
            <div className="phase-content">
              <h4>Recommended Exercises:</h4>
              <ul>
                <li>Regular Strength Training</li>
                <li>Cardiovascular Exercise</li>
                <li>Flexibility Work</li>
                <li>High or Low Impact (As Preferred)</li>
              </ul>
              <p className="phase-description">
                Focus on consistent exercise routines and listen to your body&apos;s energy levels. Mix different types of workouts throughout the week.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <i data-lucide="heart" className="brand-icon"></i>
            <span className="brand">BloomHer</span>
          </div>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="bx bxl-facebook"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="bx bxl-instagram"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="bx bxl-twitter"></i></a>
            <a href="mailto:contact@bloomher.com"><i className="bx bxl-gmail"></i></a>
          </div>
          <p>&copy; 2024 BloomHer. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
