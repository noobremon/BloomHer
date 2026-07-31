let selectedDate = null;
let dailyLogs = {};

// Initialize calendar and Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    const today = new Date();
    createCalendar(today.getFullYear(), today.getMonth());

    // Add click handlers for log card headers
    document.querySelectorAll('.log-card h3').forEach(header => {
        header.addEventListener('click', function() {
            const optionsContainer = this.nextElementSibling;
            optionsContainer.classList.toggle('hidden');
        });
    });

    // Restore saved date on page load
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
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Make sure Lucide icons are created
    lucide.createIcons();
    
    // Add click handlers for all log card headers
    document.querySelectorAll('.log-card h3').forEach(header => {
        header.addEventListener('click', function() {
            // Toggle the hidden class on the options container
            const optionsContainer = this.nextElementSibling;
            optionsContainer.classList.toggle('hidden');
        });
    });
});

// State management
let currentDate = new Date();
let periodData = {
    firstPeriod: null,
    cycles: {}
};

// Calendar functions
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

function createDayElement(day) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    div.textContent = day;
    return div;
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
    allDates.forEach(dateDiv => dateDiv.classList.remove('selected'));
    
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
        day: 'numeric'
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
function saveCycleDay(day) {
    localStorage.setItem('currentCycleDay', day);
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

// Add this function to save cycle data
function saveCycleData(day) {
    const cycleData = {
        day: day,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('cycleData', JSON.stringify(cycleData));
}

// Modify your existing function where you set the cycle day
function updateCycleDay(day) {
    const cycleDayElement = document.getElementById('cycleDay');
    cycleDayElement.textContent = day;
    saveCycleData(day);
}

// Modify your existing day selection function
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
        .forEach(btn => btn.classList.remove('active'));
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
    document.querySelectorAll('.flow-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    const button = event.target;
    button.classList.add('active');
    
    // Update period log
    document.getElementById('periodLog').textContent = flow;
    updateSummary();
    updateTodaySummary();
    saveToLocalStorage();
}

function logSymptom(symptom) {
    if (!selectedDate) return;
    
    const button = event.target;
    button.classList.toggle('active');
    
    // Get all active symptoms
    const activeSymptoms = Array.from(document.querySelectorAll('.symptom-btn.active'))
        .map(btn => btn.textContent);
    
    // Update symptoms log
    document.getElementById('symptomsLog').textContent = activeSymptoms.join(', ');
    updateSummary();
    updateTodaySummary();
    saveToLocalStorage();
}

function logMood(mood) {
    if (!selectedDate) return;
    
    const button = event.target;
    button.classList.toggle('active');
    
    // Get all active moods
    const activeMoods = Array.from(document.querySelectorAll('.mood-btn.active'))
        .map(btn => btn.textContent);
    
    // Update mood log
    document.getElementById('moodLog').textContent = activeMoods.join(', ');
    updateSummary();
    updateTodaySummary();
    saveToLocalStorage();
}

function logCraving(craving) {
    if (!selectedDate) return;
    
    const button = event.target;
    button.classList.toggle('active');
    
    // Get all active cravings
    const activeCravings = Array.from(document.querySelectorAll('.craving-btn.active'))
        .map(btn => btn.textContent);
    
    // Update cravings log
    document.getElementById('cravingsLog').textContent = activeCravings.join(', ');
    updateSummary();
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
        // Format the date for display
        const savedDate = new Date(dateInput.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
        .forEach(date => {
            const currentDate = new Date(date).getTime();
            if (currentDate <= selectedDateTime && periodData.cycles[date].flow) {
                if (!cycleStartDate || currentDate > new Date(cycleStartDate).getTime()) {
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
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('cycleData', JSON.stringify(cycleData));
}

// Initialize calendar
renderCalendar();