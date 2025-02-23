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
    // ... rest of your existing initialization code ...
});