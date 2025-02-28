// Initialize Lucide icons
lucide.createIcons();

// Sleep data structure
let sleepData = {
    logs: [],
    schedule: {
        bedtime: { hour: 10, minute: 30, ampm: 'PM' },
        wakeup: { hour: 6, minute: 30, ampm: 'AM' },
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        reminders: { bedtime: true, wakeup: true }
    },
    selectedDate: new Date()
};

// Check if sleep data exists in localStorage
const savedSleepData = localStorage.getItem('cyclecare_sleep_data');
if (savedSleepData) {
    sleepData = JSON.parse(savedSleepData);
}

// Get user cycle data if available
const userData = JSON.parse(localStorage.getItem('cyclecare_user_data') || '{}');

// Initialize page
updateDateDisplay();
updateSleepSummary();
updateScheduleDisplay();
initializeChart();

// Date navigation
document.getElementById('prevDate').addEventListener('click', () => {
    const date = new Date(sleepData.selectedDate);
    date.setDate(date.getDate() - 1);
    sleepData.selectedDate = date.toISOString();
    updateDateDisplay();
    updateSleepSummary();
});

document.getElementById('nextDate').addEventListener('click', () => {
    const date = new Date(sleepData.selectedDate);
    date.setDate(date.getDate() + 1);
    sleepData.selectedDate = date.toISOString();
    updateDateDisplay();
    updateSleepSummary();
});

function updateDateDisplay() {
    const date = new Date(sleepData.selectedDate);
    const today = new Date();
    
    let dateText = '';
    if (isSameDay(date, today)) {
        dateText = 'Today, ';
    } else if (isSameDay(date, new Date(today.setDate(today.getDate() - 1)))) {
        dateText = 'Yesterday, ';
    } else if (isSameDay(date, new Date(today.setDate(today.getDate() + 2)))) {
        dateText = 'Tomorrow, ';
    }
    
    dateText += date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    document.getElementById('currentDate').textContent = dateText;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Sleep Log Modal
const sleepLogModal = document.getElementById('sleepLogModal');
const closeSleepModal = document.getElementById('closeSleepModal');
const logSleepBtn = document.getElementById('logSleepBtn');
const sleepLogForm = document.getElementById('sleepLogForm');

logSleepBtn.addEventListener('click', () => {
    // Set default date to selected date
    const date = new Date(sleepData.selectedDate);
    document.getElementById('sleepDate').value = formatDateForInput(date);
    
    // Show modal
    sleepLogModal.classList.add('active');
});

closeSleepModal.addEventListener('click', () => {
    sleepLogModal.classList.remove('active');
});

// Format date for input field (YYYY-MM-DD)
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Sleep quality rating display
const sleepQualityRating = document.getElementById('sleepQualityRating');
const qualityValue = document.getElementById('qualityValue');

sleepQualityRating.addEventListener('input', () => {
    qualityValue.textContent = `${sleepQualityRating.value}/10`;
});

// Sleep log form submission
sleepLogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const sleepDate = document.getElementById('sleepDate').value;
    const bedtimeHour = document.getElementById('bedtimeHour').value;
    const bedtimeMinute = document.getElementById('bedtimeMinute').value;
    const bedtimeAmPm = document.getElementById('bedtimeAmPm').value;
    const wakeupHour = document.getElementById('wakeupHour').value;
    const wakeupMinute = document.getElementById('wakeupMinute').value;
    const wakeupAmPm = document.getElementById('wakeupAmPm').value;
    const quality = parseInt(sleepQualityRating.value);
    
    const disruptions = Array.from(document.querySelectorAll('#sleepLogForm input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    const notes = document.getElementById('sleepNotes').value;
    
    // Calculate sleep duration
    const sleepDuration = calculateSleepDuration(
        parseInt(bedtimeHour), 
        parseInt(bedtimeMinute), 
        bedtimeAmPm,
        parseInt(wakeupHour),
        parseInt(wakeupMinute),
        wakeupAmPm
    );
    
    // Create sleep log entry
    const sleepLog = {
        date: sleepDate,
        bedtime: {
            hour: parseInt(bedtimeHour),
            minute: parseInt(bedtimeMinute),
            ampm: bedtimeAmPm
        },
        wakeup: {
            hour: parseInt(wakeupHour),
            minute: parseInt(wakeupMinute),
            ampm: wakeupAmPm
        },
        duration: sleepDuration,
        quality: quality,
        disruptions: disruptions,
        notes: notes
    };
    
    // Add to sleep logs or update existing
    const existingLogIndex = sleepData.logs.findIndex(log => log.date === sleepDate);
    if (existingLogIndex !== -1) {
        sleepData.logs[existingLogIndex] = sleepLog;
    } else {
        sleepData.logs.push(sleepLog);
    }
    
    // Save to localStorage
    saveSleepData();
    
    // Update UI
    sleepLogModal.classList.remove('active');
    updateSleepSummary();
    updateChart();
});

// Calculate sleep duration in minutes
function calculateSleepDuration(bedHour, bedMinute, bedAmPm, wakeHour, wakeMinute, wakeAmPm) {
    // Convert to 24-hour format
    let bedHour24 = bedHour;
    if (bedAmPm === 'PM' && bedHour !== 12) bedHour24 += 12;
    if (bedAmPm === 'AM' && bedHour === 12) bedHour24 = 0;
    
    let wakeHour24 = wakeHour;
    if (wakeAmPm === 'PM' && wakeHour !== 12) wakeHour24 += 12;
    if (wakeAmPm === 'AM' && wakeHour === 12) wakeHour24 = 0;
    
    // Calculate minutes since midnight
    const bedMinutesSinceMidnight = bedHour24 * 60 + bedMinute;
    let wakeMinutesSinceMidnight = wakeHour24 * 60 + wakeMinute;
    
    // If wake time is earlier than bedtime, add a day
    if (wakeMinutesSinceMidnight < bedMinutesSinceMidnight) {
        wakeMinutesSinceMidnight += 24 * 60;
    }
    
    // Return duration in minutes
    return wakeMinutesSinceMidnight - bedMinutesSinceMidnight;
}

// Format time (e.g., "10:30 PM")
function formatTime(hour, minute, ampm) {
    return `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
}

// Format duration (e.g., "7h 30m")
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Update sleep summary based on selected date
function updateSleepSummary() {
    const date = new Date(sleepData.selectedDate);
    const dateString = formatDateForInput(date);
    
    // Find sleep log for selected date
    const sleepLog = sleepData.logs.find(log => log => log.date === dateString);
    
    if (sleepLog) {
        // Update summary with actual sleep data
        document.getElementById('sleepDuration').textContent = formatDuration(sleepLog.duration);
        document.getElementById('sleepQuality').textContent = `${sleepLog.quality}/10`;
        document.getElementById('bedtime').textContent = formatTime(sleepLog.bedtime.hour, sleepLog.bedtime.minute, sleepLog.bedtime.ampm);
        document.getElementById('wakeTime').textContent = formatTime(sleepLog.wakeup.hour, sleepLog.wakeup.minute, sleepLog.wakeup.ampm);
    } else {
        // Show placeholder or estimated data
        document.getElementById('sleepDuration').textContent = "Not logged";
        document.getElementById('sleepQuality').textContent = "Not logged";
        document.getElementById('bedtime').textContent = "Not logged";
        document.getElementById('wakeTime').textContent = "Not logged";
    }
}

// Schedule Modal
const scheduleModal = document.getElementById('scheduleModal');
const closeScheduleModal = document.getElementById('closeScheduleModal');
const editScheduleBtn = document.getElementById('editScheduleBtn');
const scheduleForm = document.getElementById('scheduleForm');

editScheduleBtn.addEventListener('click', () => {
    // Set current schedule values
    document.getElementById('targetBedtimeHour').value = sleepData.schedule.bedtime.hour;
    document.getElementById('targetBedtimeMinute').value = sleepData.schedule.bedtime.minute;
    document.getElementById('targetBedtimeAmPm').value = sleepData.schedule.bedtime.ampm;
    
    document.getElementById('targetWakeupHour').value = sleepData.schedule.wakeup.hour;
    document.getElementById('targetWakeupMinute').value = sleepData.schedule.wakeup.minute;
    document.getElementById('targetWakeupAmPm').value = sleepData.schedule.wakeup.ampm;
    
    document.getElementById('bedtimeReminder').checked = sleepData.schedule.reminders.bedtime;
    document.getElementById('wakeupReminder').checked = sleepData.schedule.reminders.wakeup;
    
    // Set selected days
    document.querySelectorAll('.day-btn input').forEach(checkbox => {
        checkbox.checked = sleepData.schedule.days.includes(checkbox.value);
    });
    
    // Show modal
    scheduleModal.classList.add('active');
});

closeScheduleModal.addEventListener('click', () => {
    scheduleModal.classList.remove('active');
});

// Schedule form submission
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bedtimeHour = document.getElementById('targetBedtimeHour').value;
    const bedtimeMinute = document.getElementById('targetBedtimeMinute').value;
    const bedtimeAmPm = document.getElementById('targetBedtimeAmPm').value;
    
    const wakeupHour = document.getElementById('targetWakeupHour').value;
    const wakeupMinute = document.getElementById('targetWakeupMinute').value;
    const wakeupAmPm = document.getElementById('targetWakeupAmPm').value;
    
    const bedtimeReminder = document.getElementById('bedtimeReminder').checked;
    const wakeupReminder = document.getElementById('wakeupReminder').checked;
    
    const selectedDays = Array.from(document.querySelectorAll('.day-btn input:checked'))
        .map(checkbox => checkbox.value);
    
    // Update schedule
    sleepData.schedule = {
        bedtime: {
            hour: parseInt(bedtimeHour),
            minute: parseInt(bedtimeMinute),
            ampm: bedtimeAmPm
        },
        wakeup: {
            hour: parseInt(wakeupHour),
            minute: parseInt(wakeupMinute),
            ampm: wakeupAmPm
        },
        days: selectedDays,
        reminders: {
            bedtime: bedtimeReminder,
            wakeup: wakeupReminder
        }
    };
    
    // Save to localStorage
    saveSleepData();
    
    // Update UI
    scheduleModal.classList.remove('active');
    updateScheduleDisplay();
});

// Update schedule display
function updateScheduleDisplay() {
    document.getElementById('scheduledBedtime').textContent = formatTime(
        sleepData.schedule.bedtime.hour,
        sleepData.schedule.bedtime.minute,
        sleepData.schedule.bedtime.ampm
    );
    
    document.getElementById('scheduledWakeup').textContent = formatTime(
        sleepData.schedule.wakeup.hour,
        sleepData.schedule.wakeup.minute,
        sleepData.schedule.wakeup.ampm
    );
}

// Save sleep data to localStorage
function saveSleepData() {
    localStorage.setItem('cyclecare_sleep_data', JSON.stringify(sleepData));
}

// Sleep quality factors tracking
document.querySelectorAll('.factor-checkbox input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const factorId = checkbox.id;
        const isChecked = checkbox.checked;
        
        // Get current date
        const today = formatDateForInput(new Date());
        
        // Find or create log for today
        let todayLog = sleepData.logs.find(log => log.date === today);
        if (!todayLog) {
            todayLog = {
                date: today,
                factors: []
            };
            sleepData.logs.push(todayLog);
        }
        
        // Add or remove factor
        if (!todayLog.factors) todayLog.factors = [];
        
        if (isChecked) {
            if (!todayLog.factors.includes(factorId)) {
                todayLog.factors.push(factorId);
            }
        } else {
            todayLog.factors = todayLog.factors.filter(f => f !== factorId);
        }
        
        // Save to localStorage
        saveSleepData();
    });
});

// Initialize chart
let sleepChart;

function initializeChart() {
    const ctx = document.getElementById('sleepChart').getContext('2d');
    
    sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: getLast7Days(),
            datasets: [
                {
                    label: 'Sleep Duration (hours)',
                    data: getSleepDurationData(),
                    backgroundColor: 'rgba(139, 92, 246, 0.5)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Sleep Quality',
                    data: getSleepQualityData(),
                    backgroundColor: 'rgba(236, 72, 153, 0.5)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1,
                    type: 'line',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    },
                    max: 12
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Quality (1-10)'
                    },
                    max: 10,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Update chart with new data
function updateChart() {
    sleepChart.data.labels = getLast7Days();
    sleepChart.data.datasets[0].data = getSleepDurationData();
    sleepChart.data.datasets[1].data = getSleepQualityData();
    sleepChart.update();
}

// Get last 7 days for chart labels
function getLast7Days() {
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    return dates;
}

// Get sleep duration data for last 7 days
function getSleepDurationData() {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = formatDateForInput(date);
        
        const log = sleepData.logs.find(log => log.date === dateString);
        if (log && log.duration) {
            data.push((log.duration / 60).toFixed(1)); // Convert minutes to hours
        } else {
            data.push(null);
        }
    }
    
    return data;
}

// Get sleep quality data for last 7 days
function getSleepQualityData() {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = formatDateForInput(date);
        
        const log = sleepData.logs.find(log => log.date === dateString);
        if (log && log.quality) {
            data.push(log.quality);
        } else {
            data.push(null);
        }
    }
    
    return data;
}

// Check if we need to show sleep reminders
function checkReminders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if today is a scheduled day
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    if (!sleepData.schedule.days.includes(dayOfWeek)) return;
    
    // Check for bedtime reminder (30 min before)
    if (sleepData.schedule.reminders.bedtime) {
        let bedtimeHour = sleepData.schedule.bedtime.hour;
        if (sleepData.schedule.bedtime.ampm === 'PM' && bedtimeHour !== 12) bedtimeHour += 12;
        if (sleepData.schedule.bedtime.ampm === 'AM' && bedtimeHour === 12) bedtimeHour = 0;
        
        let reminderHour = bedtimeHour;
        let reminderMinute = sleepData.schedule.bedtime.minute - 30;
        
        if (reminderMinute < 0) {
            reminderMinute += 60;
            reminderHour -= 1;
            if (reminderHour < 0) reminderHour += 24;
        }
        
        if (currentHour === reminderHour && currentMinute === reminderMinute) {
            showNotification('Bedtime Soon', 'Your scheduled bedtime is in 30 minutes.');
        }
    }
}

// Show browser notification
function showNotification(title, message) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }
}

// Check for reminders every minute
setInterval(checkReminders, 60000);

// Request notification permission on page load
if ('Notification' in window) {
    Notification.requestPermission();
}