'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function SleepPage() {
  const userDataRef = useRef({
    sleepLogs: [],
    bedtimeReminder: null,
    wakeupAlarm: null,
    settings: {
      soundVolumes: {
        ocean: 50,
        rain: 50,
        'white-noise': 50,
        music: 50,
      },
    },
  });
  const soundsRef = useRef({});
  const currentSoundRef = useRef(null);

  function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('sleepDate');
    if (dateInput) dateInput.value = today;
  }

  function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification(title, { body: message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // eslint-disable-next-line no-new
          new Notification(title, { body: message });
        }
      });
    } else {
      alert(`${title}: ${message}`);
    }
  }

  function saveUserData() {
    localStorage.setItem('cyclecare_sleep_data', JSON.stringify(userDataRef.current));
  }

  function loadUserData() {
    const savedData = localStorage.getItem('cyclecare_sleep_data');
    if (savedData) {
      userDataRef.current = JSON.parse(savedData);

      Object.entries(userDataRef.current.settings.soundVolumes).forEach(([sound, volume]) => {
        const sounds = soundsRef.current;
        if (sounds[sound]) {
          sounds[sound].volume = volume / 100;
          // Pre-existing bug: `:contains()` / `:has(...:contains(...))` is not
          // valid CSS (it's jQuery-only syntax) — this querySelector throws a
          // SyntaxError whenever savedData exists. Preserved verbatim from the
          // original sleep.js.
          const slider = document.querySelector(`.sound-card:has(h3:contains('${sound}')) .volume-slider`);
          if (slider) slider.value = volume;
        }
      });
    }
  }

  function initializeSounds() {
    Object.values(soundsRef.current).forEach((sound) => {
      sound.loop = true;
    });
  }

  function handleVolumeSliderInput(e) {
    const soundCard = e.target.closest('.sound-card');
    const soundName = soundCard.querySelector('h3').textContent.toLowerCase().replace(' ', '-');
    const volume = e.target.value / 100;

    const sounds = soundsRef.current;
    if (sounds[soundName]) {
      sounds[soundName].volume = volume;
      userDataRef.current.settings.soundVolumes[soundName] = e.target.value;
      saveUserData();
    }
  }

  async function toggleSound(soundName, button) {
    const sounds = soundsRef.current;
    if (sounds[soundName]) {
      if (currentSoundRef.current === sounds[soundName]) {
        // If the current sound is the same as the button's sound, toggle play/pause
        if (!sounds[soundName].paused) {
          sounds[soundName].pause();
          button.innerHTML = '<i data-lucide="play" class="icon-small"></i>';
          if (window.lucide) window.lucide.createIcons();
        } else {
          sounds[soundName].play();
          button.innerHTML = '<i data-lucide="pause" class="icon-small"></i>';
          if (window.lucide) window.lucide.createIcons();
        }
      } else {
        // If it's a different sound or no sound is playing, stop the current sound and play the new one
        if (currentSoundRef.current) {
          currentSoundRef.current.pause();
          // Pre-existing bug: this looks up the previous button via its literal
          // `onclick="toggleSound('id', this)"` HTML attribute. Only the
          // 'white-noise' Audio object ever had `.id` set in the original
          // script, so this only ever matched the White Noise button (and even
          // then only because the attribute text existed in the DOM). Since
          // this page's buttons now use React's `onClick` prop instead of a
          // literal `onclick` attribute, no button ever has this attribute in
          // the rendered DOM anymore, so this lookup now always returns null.
          // Preserved verbatim (not "fixed") — see migration notes.
          const previousButton = document.querySelector(`.btn-play[onclick="toggleSound('${currentSoundRef.current.id}', this)"]`);
          if (previousButton) {
            previousButton.innerHTML = '<i data-lucide="play" class="icon-small"></i>';
            if (window.lucide) window.lucide.createIcons();
          }
        }

        // Play the new sound
        sounds[soundName].play();
        button.innerHTML = '<i data-lucide="pause" class="icon-small"></i>';
        if (window.lucide) window.lucide.createIcons();
        currentSoundRef.current = sounds[soundName];
      }
    }
  }

  function setBedtimeReminder() {
    const bedtime = document.getElementById('bedtime').value;
    if (!bedtime) return;

    userDataRef.current.bedtimeReminder = bedtime;
    saveUserData();

    // Schedule notification
    const [hours, minutes] = bedtime.split(':');
    const now = new Date();
    const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime - now;
    setTimeout(() => {
      showNotification('Bedtime Reminder', 'Time to prepare for bed!');
    }, timeUntilReminder);

    showNotification('Reminder Set', 'Bedtime reminder has been set successfully!');
  }

  function setWakeupReminder() {
    const wakeTime = document.getElementById('wakeTime').value;
    if (!wakeTime) return;

    userDataRef.current.wakeupAlarm = wakeTime;
    saveUserData();

    // Schedule notification
    const [hours, minutes] = wakeTime.split(':');
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const timeUntilAlarm = alarmTime - now;
    setTimeout(() => {
      showNotification('Wake Up!', 'Time to start your day!');
    }, timeUntilAlarm);

    showNotification('Alarm Set', 'Wake up alarm has been set successfully!');
  }

  function showLogModal() {
    document.getElementById('logSleepModal').style.display = 'block';
  }

  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  function selectQuality(quality) {
    document.querySelectorAll('.quality-btn').forEach((btn) => {
      btn.classList.remove('selected');
    });
    document.querySelector(`.quality-btn[data-quality="${quality}"]`).classList.add('selected');
  }

  function handleSleepLog(event) {
    event.preventDefault();
    const sleepDate = document.getElementById('sleepDate').value;
    const sleepTime = document.getElementById('sleepTime').value;
    const wakeUpTime = document.getElementById('wakeupTime').value;
    const quality = document.querySelector('.quality-btn.selected').dataset.quality;
    const notes = document.getElementById('sleepNotes').value;

    const sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];
    sleepLogs.push({ date: sleepDate, sleepTime, wakeUpTime, quality, notes });
    localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));

    loadSleepLogs();
    updateStatistics();
    closeModal('logSleepModal');
  }

  // NOTE: the original sleep.js declared `calculateSleepDuration` TWICE at the
  // top level (once returning a "Xh Ym" string, once returning a plain number
  // of hours). In plain JS, the second function declaration silently
  // overwrites the first, so only this (second, numeric) version was ever
  // actually used at runtime — including by `updateUI()`, which displays the
  // result assuming a "Xh Ym" string. That mismatch (numbers like "7.5"
  // showing where "7h 30m" was intended) is a preserved pre-existing bug.
  function calculateSleepDuration(sleepTime, wakeUpTime) {
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(':').map(Number);
    const sleepDate = new Date(0, 0, 0, sleepHour, sleepMinute);
    const wakeDate = new Date(0, 0, 0, wakeHour, wakeMinute);
    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    return (wakeDate - sleepDate) / (1000 * 60 * 60); // Convert milliseconds to hours
  }

  // Update UI with sleep logs
  // NOTE: dead-ish code preserved verbatim — `userDataRef.current.sleepLogs`
  // is never pushed to anywhere in this script (only ever replaced wholesale
  // by `loadUserData()` from the unrelated `cyclecare_sleep_data` storage
  // key), so this normally iterates zero items. Its DOM target
  // (`#sleepLogGrid`) is also the same element `loadSleepLogs()` writes to
  // right afterward in the init sequence, so whatever this renders is
  // immediately overwritten. Preserved as-is (not removed/"fixed").
  function updateUI() {
    const logGrid = document.getElementById('sleepLogGrid');
    logGrid.innerHTML = '';

    userDataRef.current.sleepLogs.slice(0, 6).forEach((log) => {
      const duration = calculateSleepDuration(log.sleepTime, log.wakeupTime);
      const card = document.createElement('div');
      card.className = 'log-card';
      card.innerHTML = `
            <h3>${new Date(log.date).toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric'
            })}</h3>
            <div class="log-details">
                <p>Sleep: ${log.sleepTime}</p>
                <p>Wake: ${log.wakeupTime}</p>
                <p>Duration: ${duration}</p>
                <p>Quality: ${log.quality}</p>
                ${log.notes ? `<p>Notes: ${log.notes}</p>` : ''}
            </div>
        `;
      logGrid.appendChild(card);
    });

    updateStats();
  }

  // Update sleep statistics (operates on the same dead `userDataRef.current.sleepLogs`
  // as `updateUI()` above — see note there. Its output is immediately
  // overwritten by `updateStatistics()` later in the init sequence.)
  function updateStats() {
    if (userDataRef.current.sleepLogs.length === 0) return;

    // Calculate average sleep duration
    const durations = userDataRef.current.sleepLogs.map((log) => {
      const sleep = new Date(`2000-01-01T${log.sleepTime}`);
      const wake = new Date(`2000-01-01T${log.wakeupTime}`);
      if (wake < sleep) wake.setDate(wake.getDate() + 1);
      return (wake - sleep) / 3600000; // Convert to hours
    });

    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    document.getElementById('avgSleepDuration').textContent =
      `${Math.floor(avgDuration)}h ${Math.round((avgDuration % 1) * 60)}m`;

    // Calculate sleep quality
    const qualities = {
      poor: 1,
      fair: 2,
      good: 3,
      excellent: 4,
    };

    const avgQuality = userDataRef.current.sleepLogs
      .map((log) => qualities[log.quality])
      .reduce((a, b) => a + b, 0) / userDataRef.current.sleepLogs.length;

    document.getElementById('avgSleepQuality').textContent =
      avgQuality >= 3.5 ? 'Excellent' :
        avgQuality >= 2.5 ? 'Good' :
          avgQuality >= 1.5 ? 'Fair' : 'Poor';

    // Calculate bedtime consistency
    const bedtimes = userDataRef.current.sleepLogs.map((log) => log.sleepTime);
    const consistency = calculateConsistency(bedtimes);
    document.getElementById('bedtimeConsistency').textContent = `${Math.round(consistency)}%`;

    // Calculate sleep score
    const score = Math.round(
      (avgDuration / 8 * 40) + // Duration contributes 40%
      (avgQuality / 4 * 40) + // Quality contributes 40%
      (consistency / 100 * 20) // Consistency contributes 20%
    );
    document.getElementById('sleepScore').textContent = score;
  }

  // Calculate time consistency
  function calculateConsistency(times) {
    if (times.length < 2) return 100;

    const timeInMinutes = times.map((time) => {
      const [hours, minutes] = time.split(':');
      return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    });

    const variations = timeInMinutes.slice(1).map((time, i) =>
      Math.abs(time - timeInMinutes[i]));

    const avgVariation = variations.reduce((a, b) => a + b, 0) / variations.length;
    return Math.max(0, 100 - (avgVariation / 30) * 100);
  }

  function deleteAllLogs() {
    localStorage.removeItem('sleepLogs');
    loadSleepLogs();
    updateStatistics();
  }

  function loadSleepLogs() {
    const sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];
    const sleepLogGrid = document.getElementById('sleepLogGrid');
    sleepLogGrid.innerHTML = '';

    sleepLogs.forEach((log, index) => { // Include index for deletion
      const logCard = document.createElement('div');
      logCard.className = 'log-card';
      logCard.innerHTML = `
            <h3>${log.date}</h3>
            <p>Sleep Time: ${log.sleepTime}</p>
            <p>Wake Up Time: ${log.wakeUpTime}</p>
            <p>Quality: ${log.quality}</p>
            <p>Notes: ${log.notes}</p>
            <button class="btn-remove" onclick="deleteSleepLog(${index})">Delete</button>
        `;
      sleepLogGrid.appendChild(logCard);
    });
  }

  function deleteSleepLog(index) {
    const sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];
    sleepLogs.splice(index, 1); // Remove the log at the specified index
    localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));
    loadSleepLogs();
    updateStatistics();
  }

  function updateStatistics() {
    const sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];
    const avgSleepDuration = document.getElementById('avgSleepDuration');
    const avgSleepQuality = document.getElementById('avgSleepQuality');
    const bedtimeConsistency = document.getElementById('bedtimeConsistency');
    const sleepScore = document.getElementById('sleepScore');

    if (sleepLogs.length === 0) {
      avgSleepDuration.textContent = '0 hours';
      avgSleepQuality.textContent = 'N/A';
      bedtimeConsistency.textContent = '0%';
      sleepScore.textContent = '0';
      return;
    }

    // Calculate statistics
    let totalSleepDuration = 0;
    const qualityCount = { poor: 0, fair: 0, good: 0, excellent: 0 };
    sleepLogs.forEach((log) => {
      const sleepDuration = calculateSleepDuration(log.sleepTime, log.wakeUpTime);
      totalSleepDuration += sleepDuration;
      qualityCount[log.quality]++;
    });

    const avgDuration = (totalSleepDuration / sleepLogs.length).toFixed(1);
    avgSleepDuration.textContent = `${avgDuration} hours`;

    const mostCommonQuality = Object.keys(qualityCount).reduce((a, b) => (qualityCount[a] > qualityCount[b] ? a : b));
    avgSleepQuality.textContent = mostCommonQuality.charAt(0).toUpperCase() + mostCommonQuality.slice(1);

    // Assuming bedtime consistency and sleep score are calculated based on some logic
    bedtimeConsistency.textContent = '80%'; // Placeholder value
    sleepScore.textContent = '85'; // Placeholder value
  }

  function handleWindowClick(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  }

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Audio elements (module-level in the original script, moved here since
    // `Audio` only exists in the browser)
    soundsRef.current = {
      ocean: new Audio('/sounds/ocean.mp3'),
      rain: new Audio('/sounds/rain.mp3'),
      'white-noise': new Audio('/sounds/piano.mp3'),
      music: new Audio('/sounds/madhubala.mp3'),
    };
    soundsRef.current['white-noise'].id = 'white-noise';

    loadUserData();
    initializeSounds();

    const volumeSliders = document.querySelectorAll('.volume-slider');
    volumeSliders.forEach((slider) => {
      slider.addEventListener('input', handleVolumeSliderInput);
    });

    updateUI();
    setCurrentDate();
    loadSleepLogs();
    updateStatistics();

    // Initialize sleep quality buttons. This duplicates the effect of the
    // `onClick`/`onclick="selectQuality(...)"` already present on each
    // button (a pre-existing redundant double-binding in the original
    // sleep.js) — preserved as-is, harmless since `selectQuality` is
    // idempotent.
    const qualityButtons = document.querySelectorAll('.quality-btn');
    const qualityButtonHandlers = [];
    qualityButtons.forEach((btn) => {
      const handler = function () {
        selectQuality(this.dataset.quality);
      };
      qualityButtonHandlers.push(handler);
      btn.addEventListener('click', handler);
    });

    // Close modals when clicking outside
    window.onclick = handleWindowClick;

    // `loadSleepLogs()` builds per-log delete buttons via `innerHTML` with a
    // literal `onclick="deleteSleepLog(${index})"` attribute string, which
    // the browser resolves against the global scope when clicked — expose it
    // on `window` the way a plain (non-module) `<script>` would.
    window.deleteSleepLog = deleteSleepLog;

    return () => {
      volumeSliders.forEach((slider) => {
        slider.removeEventListener('input', handleVolumeSliderInput);
      });
      qualityButtons.forEach((btn, index) => {
        btn.removeEventListener('click', qualityButtonHandlers[index]);
      });
      window.onclick = null;
      delete window.deleteSleepLog;

      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach((sound) => {
          sound.pause();
        });
      }
    };
  }, []);

  return (
    <>
      <title>BloomHer - Sleep Management</title>
      <link rel="stylesheet" href="/stylepages/sleep.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="app-container">

        <nav>
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <i data-lucide="heart" className="heart"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/mainpages/tracker">Tracker</a>
                <a href="/mainpages/sleep" className="active">Sleep</a>
                <a href="/mainpages/stress">Stress Relief</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Better Sleep, Better Health</h1>
              <p>Track your sleep patterns, establish healthy routines, and improve your sleep quality</p>
            </div>
          </div>
        </header>

        {/* Sleep Timer */}
        <section className="sleep-timer">
          <div className="container">
            <div className="timer-content">
              <div className="bedtime-card">
                <i data-lucide="bed" className="icon-large"></i>
                <h3>Set Bedtime</h3>
                <div className="time-picker">
                  <input type="time" id="bedtime" defaultValue="22:00" />
                  <button className="btn-primary" onClick={setBedtimeReminder}>
                    Set Reminder
                  </button>
                </div>
              </div>
              <div className="wakeup-card">
                <i data-lucide="sun" className="icon-large"></i>
                <h3>Set Wake Time</h3>
                <div className="time-picker">
                  <input type="time" id="wakeTime" defaultValue="06:00" />
                  <button className="btn-primary" onClick={setWakeupReminder}>
                    Set Alarm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sleep Sounds */}
        <section className="sleep-sounds">
          <div className="container">
            <h2>Relaxing Sounds</h2>
            <div className="sounds-grid">
              <div className="sound-card">
                <i data-lucide="waves" className="icon-medium"></i>
                <h3>Ocean Waves</h3>
                <div className="sound-controls">
                  <button className="btn-play" onClick={(e) => toggleSound('ocean', e.currentTarget)}>
                    <i data-lucide="play" className="icon-small"></i>
                  </button>
                  <input type="range" min="0" max="100" defaultValue="50" className="volume-slider" />
                </div>
              </div>
              <div className="sound-card">
                <i data-lucide="cloud-rain" className="icon-medium"></i>
                <h3>Rain</h3>
                <div className="sound-controls">
                  <button className="btn-play" onClick={(e) => toggleSound('rain', e.currentTarget)}>
                    <i data-lucide="play" className="icon-small"></i>
                  </button>
                  <input type="range" min="0" max="100" defaultValue="50" className="volume-slider" />
                </div>
              </div>
              <div className="sound-card">
                <i data-lucide="wind" className="icon-medium"></i>
                <h3>White Noise</h3>
                <div className="sound-controls">
                  <button className="btn-play" onClick={(e) => toggleSound('white-noise', e.currentTarget)}>
                    <i data-lucide="play" className="icon-small"></i>
                  </button>
                  <input type="range" min="0" max="100" defaultValue="50" className="volume-slider" />
                </div>
              </div>
              <div className="sound-card">
                <i data-lucide="music" className="icon-medium"></i>
                <h3>Soft Music</h3>
                <div className="sound-controls">
                  <button className="btn-play" onClick={(e) => toggleSound('music', e.currentTarget)}>
                    <i data-lucide="play" className="icon-small"></i>
                  </button>
                  <input type="range" min="0" max="100" defaultValue="50" className="volume-slider" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sleep Log */}
        <section className="sleep-log">
          <div className="container">
            <div className="section-header">
              <h2>Sleep Log</h2>
              <button className="btn-primary" onClick={showLogModal}>
                <i data-lucide="plus" className="icon-small"></i>
                <span>Log Sleep</span>
              </button>
              <button className="btn-remove" onClick={deleteAllLogs}>
                <i data-lucide="trash" className="icon-small"></i>
                <span>Delete All Logs</span>
              </button>
            </div>
            <div className="log-grid" id="sleepLogGrid">
              {/* Sleep logs will be dynamically added here */}
            </div>
          </div>
        </section>

        {/* Sleep Stats */}
        <section className="sleep-stats">
          <div className="container">
            <h2>Sleep Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <i data-lucide="clock" className="icon-medium"></i>
                <h3>Average Sleep Duration</h3>
                <p id="avgSleepDuration">7.5 hours</p>
              </div>
              <div className="stat-card">
                <i data-lucide="bar-chart" className="icon-medium"></i>
                <h3>Sleep Quality</h3>
                <p id="avgSleepQuality">Good</p>
              </div>
              <div className="stat-card">
                <i data-lucide="bed" className="icon-medium"></i>
                <h3>Bedtime Consistency</h3>
                <p id="bedtimeConsistency">80%</p>
              </div>
              <div className="stat-card">
                <i data-lucide="activity" className="icon-medium"></i>
                <h3>Sleep Score</h3>
                <p id="sleepScore">85</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sleep Tips */}
        <section className="sleep-tips">
          <div className="container">
            <h2>Sleep Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <i data-lucide="coffee" className="icon-medium"></i>
                <h3>Limit Caffeine</h3>
                <p>Avoid caffeine at least 6 hours before bedtime</p>
              </div>
              <div className="tip-card">
                <i data-lucide="smartphone" className="icon-medium"></i>
                <h3>Screen Time</h3>
                <p>Avoid screens 1 hour before bed</p>
              </div>
              <div className="tip-card">
                <i data-lucide="sun" className="icon-medium"></i>
                <h3>Natural Light</h3>
                <p>Get sunlight exposure during the day</p>
              </div>
              <div className="tip-card">
                <i data-lucide="clock" className="icon-medium"></i>
                <h3>Consistent Schedule</h3>
                <p>Maintain regular sleep and wake times</p>
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
                <a href="/mainpages/contactus">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Log Sleep Modal */}
      <div className="modal" id="logSleepModal">
        <div className="modal-content">
          <button className="modal-close" onClick={() => closeModal('logSleepModal')}>
            <i data-lucide="x"></i>
          </button>
          <h2>Log Your Sleep</h2>
          <form id="sleepLogForm" onSubmit={handleSleepLog}>
            <div className="form-group">
              <label htmlFor="sleepDate">Date</label>
              <input type="date" id="sleepDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="sleepTime">Sleep Time</label>
              <input type="time" id="sleepTime" required />
            </div>
            <div className="form-group">
              <label htmlFor="wakeupTime">Wake Up Time</label>
              <input type="time" id="wakeupTime" required />
            </div>
            <div className="form-group">
              <label>Sleep Quality</label>
              <div className="quality-buttons">
                <button type="button" className="quality-btn" data-quality="poor" onClick={() => selectQuality('poor')}>
                  <i data-lucide="frown"></i>
                  <span>Poor</span>
                </button>
                <button type="button" className="quality-btn" data-quality="fair" onClick={() => selectQuality('fair')}>
                  <i data-lucide="meh"></i>
                  <span>Fair</span>
                </button>
                <button type="button" className="quality-btn" data-quality="good" onClick={() => selectQuality('good')}>
                  <i data-lucide="smile"></i>
                  <span>Good</span>
                </button>
                <button type="button" className="quality-btn" data-quality="excellent" onClick={() => selectQuality('excellent')}>
                  <i data-lucide="star"></i>
                  <span>Excellent</span>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="sleepNotes">Notes</label>
              <textarea id="sleepNotes" rows="3" placeholder="Any factors affecting your sleep..."></textarea>
            </div>
            <button type="submit" className="btn-primary">Save Sleep Log</button>
          </form>
        </div>
      </div>
    </>
  );
}
