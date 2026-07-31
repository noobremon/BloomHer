'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// ---- Module-level state + functions, ported 1:1 from tracker.js. These
// live outside the component (mirroring the original script's top-level
// `let`/`function` declarations) so they can be shared between the mount
// effect below and the JSX `onClick` handlers that replace the original
// inline `onclick="..."` attributes. ----

let selectedDate = null;
// `dailyLogs` is declared in the original tracker.js but never read or
// written anywhere else in the file - a pre-existing dead variable,
// preserved as-is.
// eslint-disable-next-line no-unused-vars
let dailyLogs = {};

// State management
let currentDate = new Date();
let periodData = {
  firstPeriod: null,
  cycles: {},
};

// Calendar functions
function createDayElement(day) {
  const div = document.createElement('div');
  div.className = 'calendar-day';
  div.textContent = day;
  return div;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  document.getElementById('currentMonth').textContent =
    firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = document.getElementById('calendarDays');
  calendarDays.innerHTML = '';

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendarDays.appendChild(createDayElement(''));
  }

  // Add days of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayElement = createDayElement(day);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (periodData.cycles[dateString]) {
      dayElement.classList.add('period');
    }

    if (selectedDate === dateString) {
      dayElement.classList.add('selected');
    }

    dayElement.addEventListener('click', () => selectDate(dayElement, dateString));
    calendarDays.appendChild(dayElement);
  }
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function selectDate(element, date) {
  selectedDate = date;

  // Remove selected class from all dates
  const allDates = document.querySelectorAll('.calendar-days div');
  allDates.forEach((dateDiv) => dateDiv.classList.remove('selected'));

  // Add selected class to clicked date
  element.classList.add('selected');

  // Show daily log section
  const dailyLogSection = document.getElementById('dailyLogSection');
  dailyLogSection.classList.remove('hidden');
  dailyLogSection.classList.add('visible');

  // Format and display selected date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Update the selected date display
  const selectedDateElement = document.getElementById('selectedDate');
  selectedDateElement.textContent = formattedDate;
  selectedDateElement.style.display = 'block';

  // Set cycle day
  document.getElementById('cycleDay').textContent = '1';

  // Reset other states
  resetActiveStates();
  clearLogs();
}

// Add this function to save cycle day data
// eslint-disable-next-line no-unused-vars
function saveCycleDay(day) {
  localStorage.setItem('currentCycleDay', day);
  localStorage.setItem('lastUpdated', new Date().toISOString());
}

// Add this function to save cycle data
function saveCycleData(day) {
  const cycleData = {
    day: day,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem('cycleData', JSON.stringify(cycleData));
}

// Modify your existing function where you set the cycle day
// `updateCycleDay` and `selectDay` below are both dead code in the
// original tracker.js - neither is ever called from anywhere else in the
// file (or from any HTML `onclick` attribute). Preserved as-is.
// eslint-disable-next-line no-unused-vars
function updateCycleDay(day) {
  const cycleDayElement = document.getElementById('cycleDay');
  cycleDayElement.textContent = day;
  saveCycleData(day);
}

// Modify your existing day selection function
// eslint-disable-next-line no-unused-vars
function selectDay(date) {
  // ...existing code...

  // Assuming this is where you set the cycle day
  const cycleDay = document.getElementById('cycleDay');
  cycleDay.textContent = calculateCycleDay(date);

  // Add this line to save the cycle day
  saveCycleDay(cycleDay.textContent);

  // ...rest of existing code...
}

function resetActiveStates() {
  // Remove active class from all buttons
  document.querySelectorAll('.flow-btn, .symptom-btn, .mood-btn, .craving-btn')
    .forEach((btn) => btn.classList.remove('active'));
}

function clearLogs() {
  // Clear all log displays
  document.getElementById('periodLog').textContent = '';
  document.getElementById('symptomsLog').textContent = '';
  document.getElementById('moodLog').textContent = '';
  document.getElementById('cravingsLog').textContent = '';
  document.getElementById('todaySummary').innerHTML = '<p>Select options above to see your daily summary.</p>';
}

function logPeriod(flow) {
  if (!selectedDate) return;

  // Reset all flow buttons
  document.querySelectorAll('.flow-btn').forEach((btn) => btn.classList.remove('active'));

  // Add active class to clicked button. The original code reads the bare
  // global `event` here (relying on the deprecated `window.event`), rather
  // than taking an event parameter - preserved as-is.
  // eslint-disable-next-line no-undef
  const button = event.target;
  button.classList.add('active');

  // Update period log
  document.getElementById('periodLog').textContent = flow;
  updateSummary();
  // `updateTodaySummary` is never defined anywhere in the original
  // tracker.js - calling it throws, which means `saveToLocalStorage()`
  // right after it is unreachable dead code. This is a pre-existing bug,
  // preserved as-is (see summary notes).
  // eslint-disable-next-line no-undef
  updateTodaySummary();
  saveToLocalStorage();
}

function logSymptom(symptom) {
  if (!selectedDate) return;

  // eslint-disable-next-line no-undef
  const button = event.target;
  button.classList.toggle('active');

  // Get all active symptoms
  const activeSymptoms = Array.from(document.querySelectorAll('.symptom-btn.active'))
    .map((btn) => btn.textContent);

  // Update symptoms log
  document.getElementById('symptomsLog').textContent = activeSymptoms.join(', ');
  updateSummary();
  // eslint-disable-next-line no-undef
  updateTodaySummary();
  saveToLocalStorage();
}

function logMood(mood) {
  if (!selectedDate) return;

  // eslint-disable-next-line no-undef
  const button = event.target;
  button.classList.toggle('active');

  // Get all active moods
  const activeMoods = Array.from(document.querySelectorAll('.mood-btn.active'))
    .map((btn) => btn.textContent);

  // Update mood log
  document.getElementById('moodLog').textContent = activeMoods.join(', ');
  updateSummary();
  // eslint-disable-next-line no-undef
  updateTodaySummary();
  saveToLocalStorage();
}

function logCraving(craving) {
  if (!selectedDate) return;

  // eslint-disable-next-line no-undef
  const button = event.target;
  button.classList.toggle('active');

  // Get all active cravings
  const activeCravings = Array.from(document.querySelectorAll('.craving-btn.active'))
    .map((btn) => btn.textContent);

  // Update cravings log
  document.getElementById('cravingsLog').textContent = activeCravings.join(', ');
  updateSummary();
  // eslint-disable-next-line no-undef
  updateTodaySummary();
  saveToLocalStorage();
}

function updateSummary() {
  const periodFlow = document.getElementById('periodLog').textContent;
  const symptoms = document.getElementById('symptomsLog').textContent;
  const moods = document.getElementById('moodLog').textContent;
  const cravings = document.getElementById('cravingsLog').textContent;

  let summaryHTML = '<p>';
  if (periodFlow) summaryHTML += `Period Flow: ${periodFlow}<br>`;
  if (symptoms) summaryHTML += `Symptoms: ${symptoms}<br>`;
  if (moods) summaryHTML += `Mood: ${moods}<br>`;
  if (cravings) summaryHTML += `Cravings: ${cravings}`;
  summaryHTML += '</p>';

  document.getElementById('todaySummary').innerHTML = summaryHTML || '<p>Select options above to see your daily summary.</p>';
}

function saveFirstPeriod() {
  const dateInput = document.getElementById('firstPeriodDate');
  const saveButton = document.querySelector('.form-group .btn-primary');
  const label = document.querySelector('.form-group label');

  if (dateInput.value) {
    // Format the date for display (computed but unused in the original
    // as well - dead code, preserved)
    // eslint-disable-next-line no-unused-vars
    const savedDate = new Date(dateInput.value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Hide the save button
    saveButton.style.display = 'none';

    // Make the input readonly
    dateInput.setAttribute('readonly', true);
    dateInput.style.border = 'none';
    dateInput.style.background = 'transparent';

    // Change the label text
    label.textContent = 'Your First Period Date:';

    // Store the date
    localStorage.setItem('firstPeriodDate', dateInput.value);
  }
}

function calculateCycleDay(dateString) {
  // Find the most recent period start date before the selected date
  const selectedDateTime = new Date(dateString).getTime();
  let cycleStartDate = null;

  Object.keys(periodData.cycles)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .forEach((date) => {
      const currentCycleDate = new Date(date).getTime();
      if (currentCycleDate <= selectedDateTime && periodData.cycles[date].flow) {
        if (!cycleStartDate || currentCycleDate > new Date(cycleStartDate).getTime()) {
          cycleStartDate = date;
        }
      }
    });

  if (!cycleStartDate) return 1;

  // Calculate days difference
  const diffTime = Math.abs(new Date(dateString) - new Date(cycleStartDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function saveToLocalStorage() {
  const cycleData = {
    cycleDay: document.getElementById('cycleDay').textContent,
    selectedDate: document.getElementById('selectedDate').textContent,
    periodFlow: document.getElementById('periodLog').textContent,
    symptoms: document.getElementById('symptomsLog').textContent,
    mood: document.getElementById('moodLog').textContent,
    cravings: document.getElementById('cravingsLog').textContent,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem('cycleData', JSON.stringify(cycleData));
}

export default function TrackerPage() {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();

    // Initialize calendar - top-level call in the original tracker.js
    // (runs synchronously before `DOMContentLoaded` ever fires, since the
    // original <script> tag sits at the end of <body>).
    renderCalendar();

    // First of two separate, independent `DOMContentLoaded` listeners in
    // the original tracker.js. It calls `createCalendar(...)`, a function
    // that is never defined anywhere in the original script (pre-existing
    // bug) - this throws immediately, so the log-card header click
    // handlers and the "restore saved date on page load" logic below it,
    // in this same block, never actually run on the original site either.
    // Preserved exactly, isolated in its own try/catch to match the
    // independently-invoked-listener semantics of the original.
    try {
      if (window.lucide) window.lucide.createIcons();
      const today = new Date();
      // eslint-disable-next-line no-undef
      createCalendar(today.getFullYear(), today.getMonth());

      // Add click handlers for log card headers (unreachable, see above)
      document.querySelectorAll('.log-card h3').forEach((header) => {
        header.addEventListener('click', function () {
          const optionsContainer = this.nextElementSibling;
          optionsContainer.classList.toggle('hidden');
        });
      });

      // Restore saved date on page load (unreachable, see above)
      const savedDate = localStorage.getItem('firstPeriodDate');
      if (savedDate) {
        const dateInput = document.getElementById('firstPeriodDate');
        const saveButton = document.querySelector('.form-group .btn-primary');
        const label = document.querySelector('.form-group label');

        dateInput.value = savedDate;
        dateInput.setAttribute('readonly', true);
        dateInput.style.border = 'none';
        dateInput.style.background = 'transparent';
        saveButton.style.display = 'none';
        label.textContent = 'Your First Period Date:';
      }
    } catch (err) {
      console.error(err);
    }

    // Second, independent `DOMContentLoaded` listener - duplicates the
    // log-card header click-to-toggle wiring. Unlike the first block, this
    // one actually succeeds (it doesn't call the missing `createCalendar`
    // first), so this is the listener that really makes the log-card
    // headers toggle their options container on click.
    const logCardHeaderHandlers = [];
    try {
      if (window.lucide) window.lucide.createIcons();

      const handleLogCardHeaderClick = function () {
        // Toggle the hidden class on the options container
        const optionsContainer = this.nextElementSibling;
        optionsContainer.classList.toggle('hidden');
      };
      document.querySelectorAll('.log-card h3').forEach((header) => {
        header.addEventListener('click', handleLogCardHeaderClick);
        logCardHeaderHandlers.push({ header, handler: handleLogCardHeaderClick });
      });
    } catch (err) {
      console.error(err);
    }

    const calendarDaysContainer = document.getElementById('calendarDays');

    return () => {
      logCardHeaderHandlers.forEach(({ header, handler }) => {
        header.removeEventListener('click', handler);
      });
      // The calendar day cells are (re)built via `innerHTML = ''` +
      // `appendChild` inside `renderCalendar()`, so clearing the container
      // here discards them (and their attached click listeners) together.
      if (calendarDaysContainer) {
        calendarDaysContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <title>BloomHer</title>
      <link rel="stylesheet" href="/stylepages/tracker.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="app">

        <nav className="nav">
          <div className="nav-container">
            <div className="nav-brand">
              <i data-lucide="heart" className="brand-icon"></i>
              <span className="brand-name">BloomHer</span>
            </div>
            <div className="nav-actions">
              <a href="/" className="btn-secondary">
                <i data-lucide="home"></i>
                Home
              </a>
              <a href="/mainpages/log" className="btn-primary">Get Started</a>
            </div>
          </div>
        </nav>

        <main className="main-content">

          <section id="firstPeriodSection" className="section">
            <h2>First Period Information</h2>
            <div className="form-group">
              <label>When did you have your first period?</label>
              <input type="date" id="firstPeriodDate" />
              <button onClick={saveFirstPeriod} className="btn-primary">Save</button>
            </div>
          </section>

          <section className="section">
            <h2>Period Calendar</h2>
            <div className="calendar-container">
              <div className="calendar-header">
                <button onClick={previousMonth} className="calendar-nav-btn">
                  <i data-lucide="chevron-left"></i>
                </button>
                <h3 id="currentMonth">September 2023</h3>
                <button onClick={nextMonth} className="calendar-nav-btn">
                  <i data-lucide="chevron-right"></i>
                </button>
              </div>
              <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div id="calendarDays" className="calendar-days"></div>
            </div>
          </section>

          <section id="dailyLogSection" className="section hidden">

            <div className="cycle-day-card">
              <div className="daily-log-header">
                <h3>Day <span id="cycleDay">1</span> of Your Cycle</h3>
                <h4 className="selected-date" id="selectedDate"></h4>
              </div>
            </div>

            <div className="logs-container">

              <div className="log-card">
                <h3><i data-lucide="droplets" className="category-icon"></i> Period Flow</h3>
                <div className="options-container hidden">
                  <div className="flow-buttons">
                    <button onClick={() => logPeriod('light')} className="flow-btn">Light</button>
                    <button onClick={() => logPeriod('medium')} className="flow-btn">Medium</button>
                    <button onClick={() => logPeriod('heavy')} className="flow-btn">Heavy</button>
                  </div>
                  <p id="periodLog" className="log-display"></p>
                </div>
              </div>

              <div className="log-card">
                <h3><i data-lucide="stethoscope" className="category-icon"></i> Symptoms</h3>
                <div className="options-container hidden">
                  <div className="symptom-buttons">
                    <button onClick={() => logSymptom('cramps')} className="symptom-btn">Cramps</button>
                    <button onClick={() => logSymptom('headache')} className="symptom-btn">Headache</button>
                    <button onClick={() => logSymptom('bloating')} className="symptom-btn">Bloating</button>
                    <button onClick={() => logSymptom('fatigue')} className="symptom-btn">Fatigue</button>
                    <button onClick={() => logSymptom('backache')} className="symptom-btn">Backache</button>
                  </div>
                  <p id="symptomsLog" className="log-display"></p>
                </div>
              </div>

              <div className="log-card">
                <h3><i data-lucide="smile" className="category-icon"></i> Mood</h3>
                <div className="options-container hidden">
                  <div className="mood-buttons">
                    <button onClick={() => logMood('happy')} className="mood-btn">Happy</button>
                    <button onClick={() => logMood('sad')} className="mood-btn">Sad</button>
                    <button onClick={() => logMood('anxious')} className="mood-btn">Anxious</button>
                    <button onClick={() => logMood('irritated')} className="mood-btn">Irritated</button>
                    <button onClick={() => logMood('energetic')} className="mood-btn">Energetic</button>
                  </div>
                  <p id="moodLog" className="log-display"></p>
                </div>
              </div>

              <div className="log-card">
                <h3><i data-lucide="cookie" className="category-icon"></i> Cravings</h3>
                <div className="options-container hidden">
                  <div className="craving-buttons">
                    <button onClick={() => logCraving('sweet')} className="craving-btn">Sweet</button>
                    <button onClick={() => logCraving('salty')} className="craving-btn">Salty</button>
                    <button onClick={() => logCraving('chocolate')} className="craving-btn">Chocolate</button>
                    <button onClick={() => logCraving('carbs')} className="craving-btn">Carbs</button>
                    <button onClick={() => logCraving('none')} className="craving-btn">None</button>
                  </div>
                  <p id="cravingsLog" className="log-display"></p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <h3>Today&apos;s Summary</h3>
              <div id="todaySummary" className="summary-content">
                <p>Select options above to see your daily summary.</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="nav-container">
            <div className="nav-brand">
              <i data-lucide="heart" className="brand-icon"></i>
              <span className="brand-name">BloomHer</span>
            </div>
            <div className="footer-links">
              <a href="/mainpages/diet" className="footer-link">Diet</a>
              <a href="" className="footer-link">Privacy</a>
              <a href="/mainpages/contactus" className="footer-link">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
