// Initialize Lucide icons
lucide.createIcons();

// User data structure
let userData = {
    sleepLogs: [],
    bedtimeReminder: null,
    wakeupAlarm: null,
    settings: {
        soundVolumes: {
            ocean: 50,
            rain: 50,
            'white-noise': 50,
            music: 50
        }
    }
};

// Audio elements
const sounds = {
    ocean: new Audio('/sounds/ocean.mp3'),
    rain: new Audio('/sounds/rain.mp3'),
    'white-noise': new Audio('/sounds/piano.mp3'),
    music: new Audio('/sounds/madhubala.mp3')
};

sounds['white-noise'].id = 'white-noise';

let currentSound = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeSounds();
    updateUI();
    setCurrentDate();
    loadSleepLogs();
    updateStatistics();

    // Initialize sleep quality buttons
    document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectQuality(this.dataset.quality);
        });
    });
});

// Set current date in the sleep log form
function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sleepDate').value = today;
}

// Initialize sound elements
function initializeSounds() {
    Object.values(sounds).forEach(sound => {
        sound.loop = true;
    });

    // Update volume sliders
    document.querySelectorAll('.volume-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const soundCard = e.target.closest('.sound-card');
            const soundName = soundCard.querySelector('h3').textContent.toLowerCase().replace(' ', '-');
            const volume = e.target.value / 100;
            
            if (sounds[soundName]) {
                sounds[soundName].volume = volume;
                userData.settings.soundVolumes[soundName] = e.target.value;
                saveUserData();
            }
        });
    });
}

// Toggle sound playback
async function toggleSound(soundName, button) {
    if (sounds[soundName]) {
        if (currentSound === sounds[soundName]) {
            // If the current sound is the same as the button's sound, toggle play/pause
            if (!sounds[soundName].paused) {
                sounds[soundName].pause();
                button.innerHTML = '<i data-lucide="play" class="icon-small"></i>';
                lucide.createIcons(); // Re-render icons after changing the button content
            } else {
                sounds[soundName].play();
                button.innerHTML = '<i data-lucide="pause" class="icon-small"></i>';
                lucide.createIcons(); // Re-render icons after changing the button content
            }
        } else {
            // If it's a different sound or no sound is playing, stop the current sound and play the new one
            if (currentSound) {
                currentSound.pause();
                // Reset the previous button to play icon
                const previousButton = document.querySelector(`.btn-play[onclick="toggleSound('${currentSound.id}', this)"]`);
                if (previousButton) {
                    previousButton.innerHTML = '<i data-lucide="play" class="icon-small"></i>';
                    lucide.createIcons(); // Re-render icons
                }
            }

            // Play the new sound
            sounds[soundName].play();
            button.innerHTML = '<i data-lucide="pause" class="icon-small"></i>';
            lucide.createIcons(); // Ensure icons are rendered after changing the button content
            currentSound = sounds[soundName];
        }
    }
}

// Set bedtime reminder
function setBedtimeReminder() {
    const bedtime = document.getElementById('bedtime').value;
    if (!bedtime) return;

    userData.bedtimeReminder = bedtime;
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

// Set wakeup alarm
function setWakeupReminder() {
    const wakeTime = document.getElementById('wakeTime').value;
    if (!wakeTime) return;

    userData.wakeupAlarm = wakeTime;
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

// Show sleep log modal
function showLogModal() {
    document.getElementById('logSleepModal').style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Select sleep quality
function selectQuality(quality) {
    document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`.quality-btn[data-quality="${quality}"]`).classList.add('selected');
}

// Handle sleep log submission
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

// Calculate sleep duration
function calculateSleepDuration(sleepTime, wakeupTime) {
    const sleep = new Date(`2000-01-01T${sleepTime}`);
    const wake = new Date(`2000-01-01T${wakeupTime}`);
    
    if (wake < sleep) {
        wake.setDate(wake.getDate() + 1);
    }
    
    const diff = wake - sleep;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    return `${hours}h ${minutes}m`;
}

// Update UI with sleep logs
function updateUI() {
    const logGrid = document.getElementById('sleepLogGrid');
    logGrid.innerHTML = '';

    userData.sleepLogs.slice(0, 6).forEach(log => {
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

// Update sleep statistics
function updateStats() {
    if (userData.sleepLogs.length === 0) return;

    // Calculate average sleep duration
    const durations = userData.sleepLogs.map(log => {
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
        'poor': 1,
        'fair': 2,
        'good': 3,
        'excellent': 4
    };
    
    const avgQuality = userData.sleepLogs
        .map(log => qualities[log.quality])
        .reduce((a, b) => a + b, 0) / userData.sleepLogs.length;
    
    document.getElementById('avgSleepQuality').textContent = 
        avgQuality >= 3.5 ? 'Excellent' :
        avgQuality >= 2.5 ? 'Good' :
        avgQuality >= 1.5 ? 'Fair' : 'Poor';

    // Calculate bedtime consistency
    const bedtimes = userData.sleepLogs.map(log => log.sleepTime);
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

    const timeInMinutes = times.map(time => {
        const [hours, minutes] = time.split(':');
        return parseInt(hours) * 60 + parseInt(minutes);
    });

    const variations = timeInMinutes.slice(1).map((time, i) => 
        Math.abs(time - timeInMinutes[i])
    );

    const avgVariation = variations.reduce((a, b) => a + b, 0) / variations.length;
    return Math.max(0, 100 - (avgVariation / 30) * 100);
}

// Show notification
function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: message });
            }
        });
    } else {
        alert(`${title}: ${message}`);
    }
}

// Save and load user data
function saveUserData() {
    localStorage.setItem('cyclecare_sleep_data', JSON.stringify(userData));
}

function loadUserData() {
    const savedData = localStorage.getItem('cyclecare_sleep_data');
    if (savedData) {
        userData = JSON.parse(savedData);
        
        // Restore saved volumes
        Object.entries(userData.settings.soundVolumes).forEach(([sound, volume]) => {
            if (sounds[sound]) {
                sounds[sound].volume = volume / 100;
                const slider = document.querySelector(`.sound-card:has(h3:contains('${sound}')) .volume-slider`);
                if (slider) slider.value = volume;
            }
        });
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

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
    let sleepLogs = JSON.parse(localStorage.getItem('sleepLogs')) || [];
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
    let qualityCount = { poor: 0, fair: 0, good: 0, excellent: 0 };
    sleepLogs.forEach(log => {
        const sleepDuration = calculateSleepDuration(log.sleepTime, log.wakeUpTime);
        totalSleepDuration += sleepDuration;
        qualityCount[log.quality]++;
    });

    const avgDuration = (totalSleepDuration / sleepLogs.length).toFixed(1);
    avgSleepDuration.textContent = `${avgDuration} hours`;

    const mostCommonQuality = Object.keys(qualityCount).reduce((a, b) => qualityCount[a] > qualityCount[b] ? a : b);
    avgSleepQuality.textContent = mostCommonQuality.charAt(0).toUpperCase() + mostCommonQuality.slice(1);

    // Assuming bedtime consistency and sleep score are calculated based on some logic
    bedtimeConsistency.textContent = '80%'; // Placeholder value
    sleepScore.textContent = '85'; // Placeholder value
}

function calculateSleepDuration(sleepTime, wakeUpTime) {
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(':').map(Number);
    const sleepDate = new Date(0, 0, 0, sleepHour, sleepMinute);
    const wakeDate = new Date(0, 0, 0, wakeHour, wakeMinute);
    if (wakeDate < sleepDate) {
        wakeDate.setDate(wakeDate.getDate() + 1);
    }
    const duration = (wakeDate - sleepDate) / (1000 * 60 * 60); // Convert milliseconds to hours
    return duration;
}