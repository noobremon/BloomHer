'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Module-level state mirrors the original stress.js's top-level `let`
// variables, which persisted for the lifetime of the (multi-page,
// full-reload) script. Kept here as plain mutable module state rather
// than useState/useRef so the ported logic below stays a 1:1 match of
// the original selector-based DOM code.
let userData = {
  meditation: {
    totalMinutes: 0,
    sessions: [],
  },
  journal: {
    entries: [],
  },
  moods: [],
  breathingExercises: {
    completed: 0,
    totalMinutes: 0,
  },
};

let breathingInterval;
let breathingTime = 300; // 5 minutes in seconds
let isBreathingActive = false;

function loadUserData() {
  const savedData = localStorage.getItem('cyclecare_stress_data');
  if (savedData) {
    userData = JSON.parse(savedData);
  }
  updateProgress();
}

function saveUserData() {
  localStorage.setItem('cyclecare_stress_data', JSON.stringify(userData));
  updateProgress();
}

function resetProgress() {
  document.getElementById('resetConfirmModal').style.display = 'block';
}

function confirmReset() {
  userData = {
    meditation: {
      totalMinutes: 0,
      sessions: [],
    },
    journal: {
      entries: [],
    },
    moods: [],
    breathingExercises: {
      completed: 0,
      totalMinutes: 0,
    },
  };

  saveUserData();

  closeModal('resetConfirmModal');
  alert('Your progress has been reset successfully.');
}

function startBreathing() {
  document.getElementById('breathingModal').style.display = 'block';
}

function toggleBreathing() {
  const button = document.querySelector('.breathing-controls .btn-primary');
  const instruction = document.querySelector('.breathing-instruction');
  const circle = document.querySelector('.breathing-circle');

  if (!isBreathingActive) {
    button.textContent = 'Pause';
    isBreathingActive = true;

    breathingInterval = setInterval(() => {
      breathingTime--;

      const minutes = Math.floor(breathingTime / 60);
      const seconds = breathingTime % 60;
      document.querySelector('.breathing-timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      const cycle = Math.floor((300 - breathingTime) % 8);
      if (cycle < 4) {
        instruction.textContent = 'Inhale';
        circle.style.transform = 'scale(1.1)';
      } else {
        instruction.textContent = 'Exhale';
        circle.style.transform = 'scale(1)';
      }

      if (breathingTime <= 0) {
        completeBreathing();
      }
    }, 1000);
  } else {
    button.textContent = 'Resume';
    isBreathingActive = false;
    clearInterval(breathingInterval);
  }
}

function resetBreathing() {
  clearInterval(breathingInterval);
  breathingTime = 300;
  isBreathingActive = false;
  document.querySelector('.breathing-timer').textContent = '5:00';
  document.querySelector('.breathing-controls .btn-primary').textContent = 'Start';
  document.querySelector('.breathing-circle').style.transform = 'scale(1)';
  document.querySelector('.breathing-instruction').textContent = 'Ready';
}

function completeBreathing() {
  clearInterval(breathingInterval);
  userData.breathingExercises.completed++;
  userData.breathingExercises.totalMinutes += 5;
  saveUserData();

  alert("Great job! You've completed the breathing exercise.");
  resetBreathing();
  closeModal('breathingModal');
}

function startMeditation() {
  document.getElementById('meditationModal').style.display = 'block';
}

function startMeditationSession(minutes) {
  const session = {
    date: new Date().toISOString(),
    duration: minutes,
  };

  userData.meditation.sessions.push(session);
  userData.meditation.totalMinutes += minutes;
  saveUserData();

  alert(`${minutes} minute meditation session completed!`);
  closeModal('meditationModal');
}

function openJournal() {
  document.getElementById('journalModal').style.display = 'block';
  document.getElementById('journalDate').valueAsDate = new Date();
}

function saveJournalEntry() {
  const date = document.getElementById('journalDate').value;
  const feelings = document.getElementById('feelingsEntry').value;
  const stressors = document.getElementById('stressorsEntry').value;
  const gratitude = document.getElementById('gratitudeEntry').value;

  if (!feelings && !stressors && !gratitude) {
    alert('Please fill in at least one field before saving.');
    return;
  }

  const entry = {
    date,
    feelings,
    stressors,
    gratitude,
  };

  userData.journal.entries.push(entry);
  saveUserData();

  alert('Journal entry saved successfully!');
  closeModal('journalModal');
  // Pre-existing bug: there is no element with id="journalForm" anywhere
  // in stress.html (the journal fields are plain divs, not a <form>), so
  // this line always throws a TypeError in the original site too. The
  // alert and closeModal above still run first; this just means the
  // fields are never actually cleared afterward.
  document.getElementById('journalForm').reset();
}

function showMoodTracker() {
  document.getElementById('moodModal').style.display = 'block';
}

function saveMoodEntry() {
  const selectedMood = document.querySelector('.mood-btn.selected');
  if (!selectedMood) {
    alert('Please select a mood');
    return;
  }

  const mood = selectedMood.dataset.mood;
  const notes = document.getElementById('moodNotes').value;

  const entry = {
    date: new Date().toISOString(),
    mood,
    notes,
  };

  userData.moods.push(entry);
  saveUserData();

  alert('Mood logged successfully!');
  closeModal('moodModal');
  document.getElementById('moodNotes').value = '';
  document.querySelectorAll('.mood-btn').forEach((btn) => btn.classList.remove('selected'));
}

function updateProgress() {
  const meditationMinutes = document.getElementById('meditationMinutes');
  if (meditationMinutes) {
    meditationMinutes.textContent = userData.meditation.totalMinutes;
  }

  const journalEntries = document.getElementById('journalEntries');
  if (journalEntries) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyEntries = userData.journal.entries.filter((entry) => new Date(entry.date) > weekAgo).length;

    journalEntries.textContent = weeklyEntries;
  }

  const moodTrend = document.getElementById('moodTrend');
  if (moodTrend) {
    const recentMoods = userData.moods.slice(-5);
    let trend = 'Neutral';

    if (recentMoods.length > 0) {
      const positiveCount = recentMoods.filter((m) => ['happy', 'calm'].includes(m.mood)).length;

      const negativeCount = recentMoods.filter((m) => ['anxious', 'stressed'].includes(m.mood)).length;

      if (positiveCount > negativeCount) {
        trend = 'Improving';
      } else if (negativeCount > positiveCount) {
        trend = 'Need Support';
      }
    }

    moodTrend.textContent = trend;
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

export default function StressPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Close modals when clicking outside (original stress.js sets this
    // directly as `window.onclick`, not via addEventListener).
    const handleWindowClick = function (event) {
      document.querySelectorAll('.modal').forEach((modal) => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    };
    window.onclick = handleWindowClick;

    loadUserData();

    const journalDate = document.getElementById('journalDate');
    if (journalDate) {
      journalDate.valueAsDate = new Date();
    }

    // Initialize close buttons
    const modalCloseButtons = Array.from(document.querySelectorAll('.modal-close'));
    const modalCloseHandlers = modalCloseButtons.map((button) => {
      const handler = () => {
        const modal = button.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      };
      button.addEventListener('click', handler);
      return handler;
    });

    // Mood button selection (originally the separate top-level
    // `initializeMoodButtons()` function, inlined here since it was only
    // ever called once, from inside this same DOMContentLoaded listener).
    const moodButtons = Array.from(document.querySelectorAll('.mood-btn'));
    const moodButtonHandlers = moodButtons.map((btn) => {
      const handler = () => {
        moodButtons.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
      btn.addEventListener('click', handler);
      return handler;
    });

    // Initialize action buttons.
    // Pre-existing bug: stress.html has no elements with class
    // "action-btn" anywhere (the quick-action buttons use "action-card"
    // instead), so this always queries an empty NodeList and silently
    // does nothing, exactly as in the original stress.js.
    const actionButtons = Array.from(document.querySelectorAll('.action-btn'));
    const actionButtonHandlers = actionButtons.map((button) => {
      const handler = () => {
        const action = button.dataset.action;
        switch (action) {
          case 'period':
            document.getElementById('periodModal').style.display = 'block';
            break;
          case 'symptoms':
            document.getElementById('symptomsModal').style.display = 'block';
            break;
          case 'mood':
            document.getElementById('moodModal').style.display = 'block';
            break;
          case 'cravings':
            document.getElementById('cravingsModal').style.display = 'block';
            break;
          default:
            break;
        }
      };
      button.addEventListener('click', handler);
      return handler;
    });

    return () => {
      window.onclick = null;
      clearInterval(breathingInterval);

      modalCloseButtons.forEach((button, i) => button.removeEventListener('click', modalCloseHandlers[i]));
      moodButtons.forEach((btn, i) => btn.removeEventListener('click', moodButtonHandlers[i]));
      actionButtons.forEach((button, i) => button.removeEventListener('click', actionButtonHandlers[i]));
    };
  }, []);

  return (
    <>
      <title>BloomHer - Stress Management</title>
      <link rel="stylesheet" href="/stylepages/stress.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="app-container">
        {/* Navigation */}
        <nav>
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <i data-lucide="heart" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/mainpages/tracker">Tracker</a>
                <a href="/mainpages/stress" className="active">Stress Relief</a>
                <a href="/mainpages/expert">Doctors</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Find Your Inner Peace</h1>
              <p>Take a moment to breathe, reflect, and restore your balance</p>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="container">
            <div className="actions-grid">
              <button className="action-card" onClick={startBreathing}>
                <i data-lucide="wind" className="icon-large"></i>
                <h3>Breathing Exercise</h3>
                <p>Guided breathing for instant calm</p>
              </button>
              <button className="action-card" onClick={startMeditation}>
                <i data-lucide="lotus" className="icon-large"></i>
                <h3>Meditation</h3>
                <p>Find peace in the present moment</p>
              </button>
              <button className="action-card" onClick={openJournal}>
                <i data-lucide="book" className="icon-large"></i>
                <h3>Journal</h3>
                <p>Express your thoughts and feelings</p>
              </button>
              <button className="action-card" onClick={showMoodTracker}>
                <i data-lucide="smile" className="icon-large"></i>
                <h3>Mood Tracker</h3>
                <p>Track your emotional journey</p>
              </button>
            </div>
          </div>
        </section>

        {/* Breathing Exercise Modal */}
        <div className="modal" id="breathingModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('breathingModal')}>
              <i data-lucide="x"></i>
            </button>
            <div className="breathing-exercise">
              <div className="breathing-circle">
                <div className="circle-text">Breathe</div>
              </div>
              <div className="breathing-instruction">Inhale</div>
              <div className="breathing-timer">5:00</div>
              <div className="breathing-controls">
                <button className="btn-secondary" onClick={resetBreathing}>Reset</button>
                <button className="btn-primary" onClick={toggleBreathing}>Start</button>
              </div>
            </div>
          </div>
        </div>

        {/* Meditation Modal */}
        <div className="modal" id="meditationModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('meditationModal')}>
              <i data-lucide="x"></i>
            </button>
            <div className="meditation-session">
              <h2>Guided Meditation</h2>
              <div className="meditation-options">
                <button className="meditation-option" onClick={() => startMeditationSession(5)}>
                  <span>5 minutes</span>
                  <p>Quick relaxation</p>
                </button>
                <button className="meditation-option" onClick={() => startMeditationSession(10)}>
                  <span>10 minutes</span>
                  <p>Deep breathing</p>
                </button>
                <button className="meditation-option" onClick={() => startMeditationSession(15)}>
                  <span>15 minutes</span>
                  <p>Stress relief</p>
                </button>
                <button className="meditation-option" onClick={() => startMeditationSession(20)}>
                  <span>20 minutes</span>
                  <p>Inner peace</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal" id="journalModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('journalModal')}>
              <i data-lucide="x"></i>
            </button>
            <div className="journal-section">
              <h2>Daily Journal</h2>
              <div className="journal-date">
                <input type="date" id="journalDate" />
              </div>
              <div className="journal-prompts">
                <div className="form-group">
                  <label>How are you feeling today?</label>
                  <textarea id="feelingsEntry" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>What&apos;s causing you stress?</label>
                  <textarea id="stressorsEntry" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>What are you grateful for?</label>
                  <textarea id="gratitudeEntry" rows="3"></textarea>
                </div>
              </div>
              <button className="btn-primary" onClick={saveJournalEntry}>Save Entry</button>
            </div>
          </div>
        </div>

        {/* Mood Tracker Modal */}
        <div className="modal" id="moodModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('moodModal')}>
              <i data-lucide="x"></i>
            </button>
            <div className="mood-tracker">
              <h2>Track Your Mood</h2>
              <div className="mood-grid">
                <button className="mood-btn" data-mood="happy">
                  <i data-lucide="laugh"></i>
                  <span>Happy</span>
                </button>
                <button className="mood-btn" data-mood="calm">
                  <i data-lucide="smile"></i>
                  <span>Calm</span>
                </button>
                <button className="mood-btn" data-mood="anxious">
                  <i data-lucide="alert-circle"></i>
                  <span>Anxious</span>
                </button>
                <button className="mood-btn" data-mood="stressed">
                  <i data-lucide="frown"></i>
                  <span>Stressed</span>
                </button>
              </div>
              <div className="form-group">
                <label>What&apos;s influencing your mood?</label>
                <textarea id="moodNotes" rows="3"></textarea>
              </div>
              <button className="btn-primary" onClick={saveMoodEntry}>Save Mood</button>
            </div>
          </div>
        </div>

        {/* Stress Tips Section */}
        <section className="stress-tips">
          <div className="container">
            <h2>Quick Stress Relief Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <i data-lucide="walk" className="icon-medium"></i>
                <h3>Take a Walk</h3>
                <p>A short walk can help clear your mind and reduce stress levels</p>
              </div>
              <div className="tip-card">
                <i data-lucide="music" className="icon-medium"></i>
                <h3>Listen to Music</h3>
                <p>Calming music can help reduce anxiety and improve mood</p>
              </div>
              <div className="tip-card">
                <i data-lucide="coffee" className="icon-medium"></i>
                <h3>Take a Break</h3>
                <p>Step away from work for a few minutes to reset</p>
              </div>
              <div className="tip-card">
                <i data-lucide="heart-handshake" className="icon-medium"></i>
                <h3>Talk to Someone</h3>
                <p>Share your feelings with a friend or family member</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Section */}
        <section className="progress-section">
          <div className="container">
            <div className="section-header">
              <h2>Your Progress</h2>
              <button className="btn-reset" onClick={resetProgress}>
                <i data-lucide="refresh-ccw" className="icon-small"></i>
                <span>Reset Progress</span>
              </button>
            </div>
            <div className="progress-grid">
              <div className="progress-card">
                <div className="progress-header">
                  <i data-lucide="timer" className="icon-medium"></i>
                  <h3>Meditation Minutes</h3>
                </div>
                <div className="progress-stats">
                  <span className="progress-number" id="meditationMinutes">0</span>
                  <span className="progress-label">minutes this week</span>
                </div>
              </div>
              <div className="progress-card">
                <div className="progress-header">
                  <i data-lucide="book" className="icon-medium"></i>
                  <h3>Journal Entries</h3>
                </div>
                <div className="progress-stats">
                  <span className="progress-number" id="journalEntries">0</span>
                  <span className="progress-label">entries this week</span>
                </div>
              </div>
              <div className="progress-card">
                <div className="progress-header">
                  <i data-lucide="trending-up" className="icon-medium"></i>
                  <h3>Mood Trend</h3>
                </div>
                <div className="progress-stats">
                  <span className="progress-text" id="moodTrend">Improving</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <i data-lucide="heart" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="footer-links">
                <a href="#">About</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Reset Confirmation Modal */}
      <div className="modal" id="resetConfirmModal">
        <div className="modal-content">
          <h2>Reset Progress</h2>
          <p>Are you sure you want to reset all your progress? This action cannot be undone.</p>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => closeModal('resetConfirmModal')}>Cancel</button>
            <button className="btn-danger" onClick={confirmReset}>Reset All Progress</button>
          </div>
        </div>
      </div>
    </>
  );
}
