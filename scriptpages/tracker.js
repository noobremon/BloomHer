// Initialize Lucide icons
lucide.createIcons();

// Store user's period data
let userData = {
    periods: [],
    symptoms: [],
    moods: [],
    cravings: [],
    settings: {
        averageCycleLength: 28,
        averagePeriodLength: 5
    }
};

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('cyclecare_data');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('cyclecare_data', JSON.stringify(userData));
}

// Initialize calendar
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();

    // Update month display
    document.getElementById('currentMonth').textContent = 
        new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Clear previous calendar
    calendar.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    // Add blank days
    for (let i = 0; i < startingDay; i++) {
        const blankDay = document.createElement('div');
        blankDay.className = 'calendar-day blank';
        calendar.appendChild(blankDay);
    }

    // Add days
    for (let i = 1; i <= monthLength; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;

        // Check if this day is today
        const thisDate = new Date(currentYear, currentMonth, i);

        if (thisDate.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        // Check if this day has a period logged
        if (isPeriodDay(thisDate)) {
            dayElement.classList.add('period');
        }

        dayElement.addEventListener('click', () => selectDate(thisDate));
        calendar.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    initializeCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    initializeCalendar();
}

// Check if a date has a period logged
function isPeriodDay(date) {
    return userData.periods.some(period => {
        const periodDate = new Date(period.date);
        return periodDate.toDateString() === date.toDateString();
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    
    // Set default date to today
    const dateInput = modal.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Logging Functions
function logPeriod() {
    showModal('periodModal');
}

function logSymptoms() {
    showModal('symptomsModal');
}

function logMood() {
    showModal('moodModal');
}

function logCravings() {
    showModal('cravingsModal');
}

// Handle Form Submissions
function handlePeriodLog(event) {
    event.preventDefault();
    
    const formData = {
        date: document.getElementById('periodDate').value,
        flow: document.querySelector('.flow-btn.active')?.dataset.flow || 'medium',
        painLevel: document.getElementById('painLevel').value
    };

    userData.periods.push(formData);
    saveUserData();
    updateUI();
    closeModal('periodModal');
}

function handleSymptomsLog(event) {
    event.preventDefault();
    
    const checkedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);

    const formData = {
        date: document.getElementById('symptomsDate').value,
        symptoms: checkedSymptoms,
        notes: document.getElementById('symptomNotes').value
    };

    userData.symptoms.push(formData);
    saveUserData();
    updateUI();
    closeModal('symptomsModal');
}

function handleMoodLog(event) {
    event.preventDefault();
    
    const formData = {
        date: document.getElementById('moodDate').value,
        mood: document.querySelector('.mood-btn.active')?.dataset.mood || 'neutral',
        notes: document.getElementById('moodNotes').value
    };

    userData.moods.push(formData);
    saveUserData();
    updateUI();
    closeModal('moodModal');
}

function handleCravingsLog(event) {
    event.preventDefault();
    
    const checkedCravings = Array.from(document.querySelectorAll('input[name="cravings"]:checked'))
        .map(checkbox => checkbox.value);

    const formData = {
        date: document.getElementById('cravingsDate').value,
        cravings: checkedCravings,
        specific: document.getElementById('specificCravings').value,
        notes: document.getElementById('cravingNotes').value
    };

    userData.cravings.push(formData);
    saveUserData();
    updateUI();
    closeModal('cravingsModal');
}

// UI Updates
function updateUI() {
    initializeCalendar();
    updateTodaySummary();
    updateRecentLogs();
}

function updateTodaySummary() {
    // Calculate cycle day
    const lastPeriod = [...userData.periods].sort((a, b) => 
        new Date(b.date) - new Date(a.date))[0];
    
    if (lastPeriod) {
        const daysSinceLastPeriod = Math.floor(
            (new Date() - new Date(lastPeriod.date)) / (1000 * 60 * 60 * 24)
        );
        document.getElementById('cycleDay').textContent = 
            `Day ${daysSinceLastPeriod + 1} of ${userData.settings.averageCycleLength}`;

        // Predict next period
        const nextPeriodDate = new Date(lastPeriod.date);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + userData.settings.averageCycleLength);
        const daysUntilNext = Math.floor(
            (nextPeriodDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        document.getElementById('nextPeriod').textContent = 
            daysUntilNext > 0 ? `In ${daysUntilNext} days` : 'Due today';
    }

    // Update current flow if on period
    const todaysPeriod = userData.periods.find(period => 
        new Date(period.date).toDateString() === new Date().toDateString()
    );
    document.getElementById('currentFlow').textContent = 
        todaysPeriod ? todaysPeriod.flow.charAt(0).toUpperCase() + todaysPeriod.flow.slice(1) : 'None';
}

function updateRecentLogs() {
    const recentLogs = document.getElementById('recentLogs');
    recentLogs.innerHTML = '';

    // Combine all logs and sort by date
    const allLogs = [
        ...userData.periods.map(log => ({...log, type: 'period'})),
        ...userData.symptoms.map(log => ({...log, type: 'symptoms'})),
        ...userData.moods.map(log => ({...log, type: 'mood'})),
        ...userData.cravings.map(log => ({...log, type: 'cravings'}))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display last 5 logs
    allLogs.slice(0, 5).forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = 'log-item';
        
        let icon, title;
        switch(log.type) {
            case 'period':
                icon = 'droplet';
                title = `Period logged - ${log.flow} flow`;
                break;
            case 'symptoms':
                icon = 'clipboard-list';
                title = `Symptoms logged - ${log.symptoms.length} symptoms`;
                break;
            case 'mood':
                icon = 'smile';
                title = `Mood logged - ${log.mood}`;
                break;
            case 'cravings':
                icon = 'utensils';
                title = `Cravings logged - ${log.cravings.length} items`;
                break;
        }

        logElement.innerHTML = `
            <div class="log-icon">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="log-content">
                <div class="log-title">${title}</div>
                <div class="log-date">${new Date(log.date).toLocaleDateString()}</div>
            </div>
        `;

        recentLogs.appendChild(logElement);
    });

    // Reinitialize Lucide icons for new content
    lucide.createIcons();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    updateUI();

    // Flow button selection
    document.querySelectorAll('.flow-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.flow-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mood button selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});