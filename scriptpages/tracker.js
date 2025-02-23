// Initialize Lucide icons
lucide.createIcons();

// User data structure
let userData = {
    firstPeriodDate: null,
    periods: [],
    symptoms: [],
    moods: [],
    cravings: [],
    settings: {
        averageCycleLength: 28,
        averagePeriodLength: 5
    }
};

// Current date being viewed in calendar
let currentDate = new Date();

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    initializeCalendar();
    setupEventListeners();
    updateUI();
});

// Initialize calendar
function initializeCalendar() {
    updateCalendar();
    setupCalendarControls();
}

// Set up event listeners
function setupEventListeners() {
    // First period form
    const firstPeriodForm = document.querySelector('.first-period-form');
    if (firstPeriodForm) {
        firstPeriodForm.addEventListener('submit', handleFirstPeriodSubmit);
    }

    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Delete data button
    const deleteBtn = document.querySelector('.delete-data-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteAllData);
    }

    // Flow button handlers
    document.querySelectorAll('.flow-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.flow-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mood button handlers
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Set today's date as default for all date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });
}

// Handle first period submission
function handleFirstPeriodSubmit(event) {
    event.preventDefault();
    const firstPeriodDate = document.getElementById('firstPeriodDate').value;
    
    if (!firstPeriodDate) {
        alert('Please select a date');
        return;
    }

    userData.firstPeriodDate = firstPeriodDate;
    
    // Add this as a period entry
    userData.periods.push({
        date: firstPeriodDate,
        flow: 'medium',
        painLevel: 5
    });
    
    saveUserData();
    updateUI();
    
    // Show success message
    showNotification('First period date saved successfully!');
}

// Delete all tracking data
function deleteAllData() {
    if (confirm('Are you sure you want to delete all your period tracking data? This cannot be undone.')) {
        userData = {
            firstPeriodDate: null,
            periods: [],
            symptoms: [],
            moods: [],
            cravings: [],
            settings: {
                averageCycleLength: 28,
                averagePeriodLength: 5
            }
        };
        saveUserData();
        updateUI();
        
        // Clear the first period date input
        document.getElementById('firstPeriodDate').value = '';
        
        // Show success message
        showNotification('All data has been deleted successfully.');
    }
}

// Calendar Navigation
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
}

// Update calendar display
function updateCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonth = document.getElementById('currentMonth');
    
    if (!calendar || !currentMonth) return;
    
    // Clear existing calendar
    calendar.innerHTML = '';
    
    // Set month and year in header
    currentMonth.textContent = currentDate.toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Add day labels
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'calendar-day day-label';
        dayLabel.textContent = day;
        calendar.appendChild(dayLabel);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Add empty cells for days before first of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if this is today
        const currentDateString = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        const today = formatDate(new Date());
        
        if (currentDateString === today) {
            dayCell.classList.add('today');
        }
        
        // Check if this day has a period logged
        if (userData.periods.some(p => p.date === currentDateString)) {
            dayCell.classList.add('period');
        }
        
        // Add click handler
        dayCell.addEventListener('click', () => handleDayClick(currentDateString));
        
        calendar.appendChild(dayCell);
    }
}

// Handle day click
function handleDayClick(dateString) {
    const hasPeriod = userData.periods.some(p => p.date === dateString);
    
    if (hasPeriod) {
        // Remove period
        userData.periods = userData.periods.filter(p => p.date !== dateString);
    } else {
        // Add period
        userData.periods.push({
            date: dateString,
            flow: 'medium',
            painLevel: 5
        });
    }
    
    saveUserData();
    updateUI();
}

// Quick actions
function handleQuickAction(action) {
    switch (action) {
        case 'period':
            showModal('periodModal');
            break;
        case 'symptoms':
            showModal('symptomsModal');
            break;
        case 'mood':
            showModal('moodModal');
            break;
        case 'cravings':
            showModal('cravingsModal');
            break;
    }
}

// Modal handling
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Log Period Functions
function logPeriod() {
    showModal('periodModal');
}

function handlePeriodLog(event) {
    event.preventDefault();
    const date = document.getElementById('periodDate').value;
    const flow = document.querySelector('.flow-btn.active')?.dataset.flow || 'medium';
    const pain = document.getElementById('painLevel').value;

    // Add to recent logs
    addToRecentLogs('Period', `Date: ${date}, Flow: ${flow}, Pain Level: ${pain}`);
    closeModal('periodModal');
}

// Log Symptoms Functions
function logSymptoms() {
    showModal('symptomsModal');
}

function handleSymptomsLog(event) {
    event.preventDefault();
    const date = document.getElementById('symptomsDate').value;
    const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);
    const notes = document.getElementById('symptomNotes').value;

    // Add to recent logs
    addToRecentLogs('Symptoms', `Date: ${date}, Symptoms: ${symptoms.join(', ')}`);
    closeModal('symptomsModal');
}

// Log Mood Functions
function logMood() {
    showModal('moodModal');
}

function handleMoodLog(event) {
    event.preventDefault();
    const date = document.getElementById('moodDate').value;
    const mood = document.querySelector('.mood-btn.active')?.dataset.mood || '';
    const notes = document.getElementById('moodNotes').value;

    // Add to recent logs
    addToRecentLogs('Mood', `Date: ${date}, Mood: ${mood}`);
    closeModal('moodModal');
}

// Log Cravings Functions
function logCravings() {
    showModal('cravingsModal');
}

function handleCravingsLog(event) {
    event.preventDefault();
    const date = document.getElementById('cravingsDate').value;
    const cravings = Array.from(document.querySelectorAll('input[name="cravings"]:checked'))
        .map(checkbox => checkbox.value);
    const specific = document.getElementById('specificCravings').value;

    // Add to recent logs
    addToRecentLogs('Cravings', `Date: ${date}, Cravings: ${cravings.join(', ')}`);
    closeModal('cravingsModal');
}

// Helper Functions
function addToRecentLogs(type, details) {
    const recentLogs = document.getElementById('recentLogs');
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-entry');
    logEntry.innerHTML = `
        <div class="log-header">
            <span class="log-type">${type}</span>
            <button class="delete-log" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
        <p class="log-details">${details}</p>
    `;
    recentLogs.insertBefore(logEntry, recentLogs.firstChild);
    lucide.createIcons(); // Refresh icons
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Save and load user data
function saveUserData() {
    localStorage.setItem('cyclecare_data', JSON.stringify(userData));
}

function loadUserData() {
    const savedData = localStorage.getItem('cyclecare_data');
    if (savedData) {
        userData = JSON.parse(savedData);
        if (userData.firstPeriodDate) {
            const firstPeriodInput = document.getElementById('firstPeriodDate');
            if (firstPeriodInput) {
                firstPeriodInput.value = userData.firstPeriodDate;
            }
        }
    }
}

// Update UI elements
function updateUI() {
    updateCalendar();
    updateSummary();
    updateRecentLogs();
}

// Update summary section
function updateSummary() {
    const cycleDay = document.getElementById('cycleDay');
    const nextPeriod = document.getElementById('nextPeriod');
    const currentFlow = document.getElementById('currentFlow');
    
    if (!cycleDay || !nextPeriod || !currentFlow) return;
    
    if (userData.periods.length > 0) {
        const lastPeriod = new Date(userData.periods[userData.periods.length - 1].date);
        const today = new Date();
        const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
        
        cycleDay.textContent = `Day ${daysSinceLastPeriod + 1} of ${userData.settings.averageCycleLength}`;
        
        const nextPredicted = new Date(lastPeriod);
        nextPredicted.setDate(nextPredicted.getDate() + userData.settings.averageCycleLength);
        const daysUntilNext = Math.floor((nextPredicted - today) / (1000 * 60 * 60 * 24));
        
        nextPeriod.textContent = `In ${daysUntilNext} days`;
        currentFlow.textContent = userData.periods[userData.periods.length - 1].flow;
    } else {
        cycleDay.textContent = 'No data';
        nextPeriod.textContent = 'No data';
        currentFlow.textContent = 'No data';
    }
}

// Update recent logs
function updateRecentLogs() {
    const logsList = document.getElementById('recentLogs');
    if (!logsList) return;
    
    logsList.innerHTML = '';
    
    // Combine all logs and sort by date
    const allLogs = [
        ...userData.periods.map(p => ({ type: 'period', date: p.date, data: p })),
        ...userData.symptoms.map(s => ({ type: 'symptoms', date: s.date, data: s })),
        ...userData.moods.map(m => ({ type: 'mood', date: m.date, data: m })),
        ...userData.cravings.map(c => ({ type: 'cravings', date: c.date, data: c }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show last 5 logs
    allLogs.slice(0, 5).forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        
        const icon = getLogIcon(log.type);
        const date = new Date(log.date).toLocaleDateString();
        const description = getLogDescription(log);
        
        logItem.innerHTML = `
            <div class="log-icon">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="log-content">
                <div class="log-date">${date}</div>
                <div>${description}</div>
            </div>
        `;
        
        logsList.appendChild(logItem);
    });
    
    // Reinitialize Lucide icons for new content
    lucide.createIcons();
}

// Helper functions for logs
function getLogIcon(type) {
    switch (type) {
        case 'period': return 'droplet';
        case 'symptoms': return 'activity';
        case 'mood': return 'smile';
        case 'cravings': return 'utensils';
        default: return 'circle';
    }
}

function getLogDescription(log) {
    switch (log.type) {
        case 'period':
            return `Period day with ${log.data.flow} flow`;
        case 'symptoms':
            return `Logged symptoms: ${log.data.symptoms.join(', ')}`;
        case 'mood':
            return `Feeling ${log.data.mood}`;
        case 'cravings':
            return `Craving: ${log.data.foods.join(', ')}`;
        default:
            return 'Log entry';
    }
}

// Show notification
function showNotification(message) {
    // Implementation depends on your UI design
    alert(message);
}