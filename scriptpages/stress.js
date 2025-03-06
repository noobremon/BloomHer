// Initialize Lucide icons
lucide.createIcons();

// User data structure
let userData = {
    meditation: {
        totalMinutes: 0,
        sessions: []
    },
    journal: {
        entries: []
    },
    moods: [],
    breathingExercises: {
        completed: 0,
        totalMinutes: 0
    }
};

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('cyclecare_stress_data');
    if (savedData) {
        userData = JSON.parse(savedData);
    }
    updateProgress();
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('cyclecare_stress_data', JSON.stringify(userData));
    updateProgress();
}

// Breathing Exercise
let breathingInterval;
let breathingTime = 300; // 5 minutes in seconds
let isBreathingActive = false;

function startBreathing() {
    document.getElementById('breathingModal').style.display = 'block';
}

function toggleBreathing() {
    const button = document.querySelector('.breathing-controls .btn-primary');
    const instruction = document.querySelector('.breathing-instruction');
    
    if (!isBreathingActive) {
        button.textContent = 'Pause';
        isBreathingActive = true;
        
        breathingInterval = setInterval(() => {
            breathingTime--;
            
            // Update timer display
            const minutes = Math.floor(breathingTime / 60);
            const seconds = breathingTime % 60;
            document.querySelector('.breathing-timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update breathing instruction
            const cycle = Math.floor((300 - breathingTime) % 8);
            if (cycle < 4) {
                instruction.textContent = 'Inhale';
                document.querySelector('.breathing-circle').style.transform = 'scale(1.1)';
            } else {
                instruction.textContent = 'Exhale';
                document.querySelector('.breathing-circle').style.transform = 'scale(1)';
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
}

function completeBreathing() {
    clearInterval(breathingInterval);
    userData.breathingExercises.completed++;
    userData.breathingExercises.totalMinutes += 5;
    saveUserData();
    
    alert('Great job! You\'ve completed the breathing exercise.');
    resetBreathing();
}

// Meditation
function startMeditation() {
    document.getElementById('meditationModal').style.display = 'block';
}

function startMeditationSession(minutes) {
    const session = {
        date: new Date().toISOString(),
        duration: minutes
    };
    
    userData.meditation.sessions.push(session);
    userData.meditation.totalMinutes += minutes;
    saveUserData();
    
    // Here you would typically start the actual meditation session
    // For now, we'll just show a completion message
    alert(`${minutes} minute meditation session completed!`);
    closeModal('meditationModal');
}

// Journal
function openJournal() {
    document.getElementById('journalModal').style.display = 'block';
    document.getElementById('journalDate').valueAsDate = new Date();
}

function saveJournalEntry() {
    const date = document.getElementById('journalDate').value;
    const feelings = document.getElementById('feelingsEntry').value;
    const stressors = document.getElementById('stressorsEntry').value;
    const gratitude = document.getElementById('gratitudeEntry').value;
    
    if (!feelings && !stressors && !gratitude) { ```javascript
        alert('Please fill in at least one field before saving.');
        return;
    }
    
    const entry = {
        date,
        feelings,
        stressors,
        gratitude
    };
    
    userData.journal.entries.push(entry);
    saveUserData();
    
    alert('Journal entry saved successfully!');
    closeModal('journalModal');
    document.getElementById('journalForm').reset();
}

// Mood Tracking
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
        notes
    };
    
    userData.moods.push(entry);
    saveUserData();
    
    alert('Mood logged successfully!');
    closeModal('moodModal');
    document.getElementById('moodNotes').value = '';
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
}

// Mood button selection
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

// Progress Updates
function updateProgress() {
    // Update meditation minutes
    const meditationMinutes = document.getElementById('meditationMinutes');
    if (meditationMinutes) {
        meditationMinutes.textContent = userData.meditation.totalMinutes;
    }
    
    // Update journal entries
    const journalEntries = document.getElementById('journalEntries');
    if (journalEntries) {
        // Count entries from the past week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyEntries = userData.journal.entries.filter(entry => 
            new Date(entry.date) > weekAgo
        ).length;
        
        journalEntries.textContent = weeklyEntries;
    }
    
    // Update mood trend
    const moodTrend = document.getElementById('moodTrend');
    if (moodTrend) {
        const recentMoods = userData.moods.slice(-5);
        let trend = 'Neutral';
        
        if (recentMoods.length > 0) {
            const positiveCount = recentMoods.filter(m => 
                ['happy', 'calm'].includes(m.mood)
            ).length;
            
            const negativeCount = recentMoods.filter(m => 
                ['anxious', 'stressed'].includes(m.mood)
            ).length;
            
            if (positiveCount > negativeCount) {
                trend = 'Improving';
            } else if (negativeCount > positiveCount) {
                trend = 'Need Support';
            }
        }
        
        moodTrend.textContent = trend;
    }
}

// Modal handling
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    
    // Set current date for journal
    const journalDate = document.getElementById('journalDate');
    if (journalDate) {
        journalDate.valueAsDate = new Date();
    }
});
    }
