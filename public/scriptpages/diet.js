// Add these functions at the beginning of your diet.js file
function getCycleData() {
    const cycleData = localStorage.getItem('cycleData');
    return cycleData ? JSON.parse(cycleData) : null;
}

const cyclePhaseRecommendations = {
    Menstrual: {
        phase: 'Menstrual Phase',
        foods: [
            { icon: 'apple', name: 'Leafy greens (rich in iron)' },
            { icon: 'beef', name: 'Lean red meat (iron source)' },
            { icon: 'fish', name: 'Fatty fish (omega-3)' }
        ],
        tips: [
            'Focus on iron-rich foods',
            'Stay hydrated with warm beverages',
            'Include anti-inflammatory foods',
            'Eat small, frequent meals'
        ]
    },
    Follicular: {
        phase: 'Follicular Phase',
        foods: [
            { icon: 'salad', name: 'Fresh fruits and vegetables' },
            { icon: 'wheat', name: 'Whole grains' },
            { icon: 'egg', name: 'Lean proteins' }
        ],
        tips: [
            'Focus on light, energizing foods',
            'Include fermented foods',
            'Eat plenty of fiber',
            'Stay hydrated'
        ]
    }
    // Add other phases as needed
};

function updateDietRecommendations() {
    const cycleData = getCycleData();
    const phaseElement = document.querySelector('.phase-name');
    const recommendedFoods = document.querySelector('.food-recommendations');
    const tipsList = document.querySelector('.tips');

    if (cycleData) {
        const recommendations = cyclePhaseRecommendations[cycleData.phase] || cyclePhaseRecommendations.Follicular;

        // Update cycle phase display
        phaseElement.textContent = `${recommendations.phase} - Day ${cycleData.day}`;

        // Update recommended foods
        recommendedFoods.innerHTML = recommendations.foods.map(food => `
            <div class="food-item">
                <i data-lucide="${food.icon}"></i>
                <span>${food.name}</span>
            </div>
        `).join('');

        // Update tips
        tipsList.innerHTML = recommendations.tips.map(tip => `
            <p>• ${tip}</p>
        `).join('');

        // Refresh Lucide icons
        lucide.createIcons();
    }
}

function redirectToTracker() {
    window.location.href = '/mainpages/tracker.html';
}

function updateCyclePhase() {
    const cyclePhaseContent = document.getElementById('cyclePhaseContent');
    const currentDay = localStorage.getItem('currentCycleDay');
    const lastUpdated = localStorage.getItem('lastUpdated');

    if (currentDay) {
        cyclePhaseContent.innerHTML = `
            <p>Day ${currentDay} of Cycle</p>
            <p class="last-updated">Last updated: ${new Date(lastUpdated).toLocaleDateString()}</p>
        `;
    } else {
        cyclePhaseContent.innerHTML = `
            <p>No cycle data available</p>
            <p class="hint">Click to update in tracker</p>
        `;
    }
}

function handleCyclePhaseClick() {
    window.location.href = 'tracker.html';
}

function updateCyclePhaseDisplay() {
  const cyclePhaseContent = document.getElementById('cyclePhaseContent');
  const cycleData = localStorage.getItem('cycleData');

  if (!cycleData) {
    cyclePhaseContent.innerHTML = `
      <div class="empty-state">
        <i data-lucide="calendar-plus" class="empty-icon"></i>
        <p class="phase-name">Track Your Cycle</p>
        <p class="phase-tip">Click here to start tracking</p>
      </div>
    `;
  } else {
    const data = JSON.parse(cycleData);
    cyclePhaseContent.innerHTML = `
      <div class="phase-info">
        <p class="phase-name">${data.phase}</p>
        <p class="phase-tip">Day ${data.day} of your cycle</p>
      </div>
    `;
  }
  lucide.createIcons();
}

// Initialize Lucide icons
lucide.createIcons();

// State management
let mealLogs = [];
const CALORIE_GOAL = 2000;

// DOM Elements
const mealForm = document.getElementById('mealForm');
const mealLogsContainer = document.getElementById('mealLogs');
const totalCaloriesElement = document.getElementById('totalCalories');
const caloriesProgressElement = document.getElementById('caloriesProgress');
const tabs = document.querySelectorAll('.tab');

// Event Listeners
mealForm.addEventListener('submit', handleMealSubmit);
tabs.forEach(tab => {
  tab.addEventListener('click', () => handleTabChange(tab));
});

// Handle meal submission
function handleMealSubmit(e) {
  e.preventDefault();

  const food = document.getElementById('foodInput').value;
  const calories = parseInt(document.getElementById('caloriesInput').value);
  const time = document.getElementById('timeInput').value;

  if (!food || !calories || !time) return;

  const meal = {
    id: Date.now().toString(),
    food,
    calories,
    time
  };

  mealLogs.push(meal);
  updateUI();
  mealForm.reset();
}

// Update UI elements
function updateUI() {
  // Update meal logs
  mealLogsContainer.innerHTML = mealLogs
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(meal => `
      <div class="meal-log">
        <div class="meal-time">
          <i data-lucide="clock"></i>
          <span>${formatTime(meal.time)}</span>
        </div>
        <div class="meal-food">${meal.food}</div>
        <div class="meal-calories">${meal.calories} cal</div>
      </div>
    `)
    .join('');

  // Update total calories
  const totalCalories = mealLogs.reduce((sum, meal) => sum + meal.calories, 0);
  totalCaloriesElement.textContent = totalCalories;

  // Update progress bar
  const progress = Math.min((totalCalories / CALORIE_GOAL) * 100, 100);
  caloriesProgressElement.style.width = `${progress}%`;

  // Reinitialize Lucide icons for new content
  lucide.createIcons();
}

// Handle tab changes
function handleTabChange(selectedTab) {
  tabs.forEach(tab => tab.classList.remove('active'));
  selectedTab.classList.add('active');
}

// Format time for display
function formatTime(time) {
  return new Date(`2000/01/01 ${time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
}

// Initial UI update
updateUI();

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDietRecommendations();
    updateCyclePhase();
    updateCyclePhaseDisplay();
    // ... rest of your existing initialization code ...
});

document.addEventListener('DOMContentLoaded', function() {
    const cycleInfo = document.getElementById('cycleInfo');
    const cycleData = localStorage.getItem('currentCycleData');

    if (cycleData) {
        const data = JSON.parse(cycleData);
        cycleInfo.innerHTML = `
            <div class="cycle-summary">
                <p><strong>Cycle Day:</strong> ${data.cycleDay}</p>
                <p><strong>Date:</strong> ${data.selectedDate}</p>
                <p><strong>Period Flow:</strong> ${data.periodFlow || 'Not logged'}</p>
                <p><strong>Symptoms:</strong> ${data.symptoms || 'None reported'}</p>
                <p><strong>Mood:</strong> ${data.mood || 'Not logged'}</p>
                <p><strong>Cravings:</strong> ${data.cravings || 'None reported'}</p>
            </div>
        `;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const cycleInfoSection = document.getElementById('cycleInfo');
    
    function displayCycleInfo() {
        const cycleData = JSON.parse(localStorage.getItem('cycleData'));
        
        if (!cycleData) {
            cycleInfoSection.innerHTML = `
                <div class="no-data-message">
                    <p>Please track your cycle first to get personalized diet recommendations.</p>
                    <a href="tracker.html" class="btn-primary">Go to Tracker</a>
                </div>
            `;
            return;
        }

        cycleInfoSection.innerHTML = `
            <div class="cycle-info-container">
                <h3>Current Cycle Information</h3>
                <div class="cycle-details">
                    <p><strong>Cycle Day:</strong> ${cycleData.cycleDay}</p>
                    <p><strong>Last Updated:</strong> ${new Date(cycleData.lastUpdated).toLocaleDateString()}</p>
                    <p><strong>Flow:</strong> ${cycleData.periodFlow || 'Not logged'}</p>
                    <p><strong>Symptoms:</strong> ${cycleData.symptoms || 'None reported'}</p>
                    <p><strong>Mood:</strong> ${cycleData.mood || 'Not logged'}</p>
                    <p><strong>Cravings:</strong> ${cycleData.cravings || 'None reported'}</p>
                </div>
            </div>
        `;
    }

    displayCycleInfo();
});

document.addEventListener('DOMContentLoaded', function() {
    const currentCycleDayElement = document.getElementById('currentCycleDay');
    
    // Get cycle data from localStorage
    const cycleData = JSON.parse(localStorage.getItem('cycleData'));
    
    if (cycleData && cycleData.day) {
        currentCycleDayElement.textContent = `Day ${cycleData.day} of Cycle`;
    }
});

function handleCyclePhaseClick() {
    window.location.href = 'tracker.html';
}