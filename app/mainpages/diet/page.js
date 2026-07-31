'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const cyclePhaseRecommendations = {
  Menstrual: {
    phase: 'Menstrual Phase',
    foods: [
      { icon: 'apple', name: 'Leafy greens (rich in iron)' },
      { icon: 'beef', name: 'Lean red meat (iron source)' },
      { icon: 'fish', name: 'Fatty fish (omega-3)' },
    ],
    tips: [
      'Focus on iron-rich foods',
      'Stay hydrated with warm beverages',
      'Include anti-inflammatory foods',
      'Eat small, frequent meals',
    ],
  },
  Follicular: {
    phase: 'Follicular Phase',
    foods: [
      { icon: 'salad', name: 'Fresh fruits and vegetables' },
      { icon: 'wheat', name: 'Whole grains' },
      { icon: 'egg', name: 'Lean proteins' },
    ],
    tips: [
      'Focus on light, energizing foods',
      'Include fermented foods',
      'Eat plenty of fiber',
      'Stay hydrated',
    ],
  },
};

export default function DietPage() {
  useEffect(() => {
    function getCycleData() {
      const cycleData = localStorage.getItem('cycleData');
      return cycleData ? JSON.parse(cycleData) : null;
    }

    // eslint-disable-next-line no-unused-vars
    function redirectToTracker() {
      window.location.href = '/mainpages/tracker';
    }

    function updateDietRecommendations() {
      const cycleData = getCycleData();
      const phaseElement = document.querySelector('.phase-name');
      const recommendedFoods = document.querySelector('.food-recommendations');
      const tipsList = document.querySelector('.tips');

      if (cycleData) {
        const recommendations = cyclePhaseRecommendations[cycleData.phase] || cyclePhaseRecommendations.Follicular;

        phaseElement.textContent = `${recommendations.phase} - Day ${cycleData.day}`;

        recommendedFoods.innerHTML = recommendations.foods.map((food) => `
            <div class="food-item">
                <i data-lucide="${food.icon}"></i>
                <span>${food.name}</span>
            </div>
        `).join('');

        tipsList.innerHTML = recommendations.tips.map((tip) => `
            <p>\u2022 ${tip}</p>
        `).join('');

        if (window.lucide) window.lucide.createIcons();
      }
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
      if (window.lucide) window.lucide.createIcons();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }

    let mealLogs = [];
    const CALORIE_GOAL = 2000;

    const mealForm = document.getElementById('mealForm');
    const mealLogsContainer = document.getElementById('mealLogs');
    const totalCaloriesElement = document.getElementById('totalCalories');
    const caloriesProgressElement = document.getElementById('caloriesProgress');
    const tabs = document.querySelectorAll('.tab');

    function formatTime(time) {
      return new Date(`2000/01/01 ${time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    function updateUI() {
      mealLogsContainer.innerHTML = mealLogs
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((meal) => `
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

      const totalCalories = mealLogs.reduce((sum, meal) => sum + meal.calories, 0);
      totalCaloriesElement.textContent = totalCalories;

      const progress = Math.min((totalCalories / CALORIE_GOAL) * 100, 100);
      caloriesProgressElement.style.width = `${progress}%`;

      if (window.lucide) window.lucide.createIcons();
    }

    function handleMealSubmit(e) {
      e.preventDefault();

      const food = document.getElementById('foodInput').value;
      const calories = parseInt(document.getElementById('caloriesInput').value, 10);
      const time = document.getElementById('timeInput').value;

      if (!food || !calories || !time) return;

      const meal = {
        id: Date.now().toString(),
        food,
        calories,
        time,
      };

      mealLogs.push(meal);
      updateUI();
      mealForm.reset();
    }

    function handleTabChange(selectedTab) {
      tabs.forEach((tab) => tab.classList.remove('active'));
      selectedTab.classList.add('active');
    }

    mealForm.addEventListener('submit', handleMealSubmit);
    const tabHandlers = [];
    tabs.forEach((tab) => {
      const handler = () => handleTabChange(tab);
      tabHandlers.push(handler);
      tab.addEventListener('click', handler);
    });

    updateUI();

    // The four blocks below mirror four separate, independent
    // `DOMContentLoaded` listeners in the original diet.js. Each is
    // isolated with try/catch so that a failure in one (e.g. the
    // pre-existing reference to a `#cycleInfo` element that does not
    // exist on this page) does not stop the others from running,
    // matching the original browser behavior of independently-invoked
    // event listeners.
    try {
      updateDietRecommendations();
      updateCyclePhase();
      updateCyclePhaseDisplay();
    } catch (err) {
      console.error(err);
    }

    try {
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
    } catch (err) {
      console.error(err);
    }

    try {
      const cycleInfoSection = document.getElementById('cycleInfo');

      function displayCycleInfo() {
        const cycleData = JSON.parse(localStorage.getItem('cycleData'));

        if (!cycleData) {
          cycleInfoSection.innerHTML = `
                <div class="no-data-message">
                    <p>Please track your cycle first to get personalized diet recommendations.</p>
                    <a href="/mainpages/tracker" class="btn-primary">Go to Tracker</a>
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
    } catch (err) {
      console.error(err);
    }

    try {
      const currentCycleDayElement = document.getElementById('currentCycleDay');
      const cycleData = JSON.parse(localStorage.getItem('cycleData'));

      if (cycleData && cycleData.day && currentCycleDayElement) {
        currentCycleDayElement.textContent = `Day ${cycleData.day} of Cycle`;
      }
    } catch (err) {
      console.error(err);
    }

    return () => {
      mealForm.removeEventListener('submit', handleMealSubmit);
      tabs.forEach((tab, index) => {
        tab.removeEventListener('click', tabHandlers[index]);
      });
    };
  }, []);

  function handleCyclePhaseClick() {
    window.location.href = '/mainpages/tracker';
  }

  return (
    <>
      <title>BloomHer</title>
      <link rel="stylesheet" href="/stylepages/diet.css" />
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
            <div className="nav-actions desktop-only">
              <a href="/" className="icon-button">
                <i data-lucide="home"></i>
              </a>
              <button className="icon-button">
                <i data-lucide="heart"></i>
              </button>
              <div className="cart-button">
                <i data-lucide="shopping-cart"></i>
                <span className="cart-count" id="cartCount">0</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-wrapper">
          <div className="tabs">
            <button className="tab active" data-tab="dashboard">
              <i data-lucide="bar-chart"></i>
              Dashboard
            </button>
            <button className="tab" data-tab="tracking">
              <i data-lucide="calendar"></i>
              Track Meals
            </button>
            <button className="tab" data-tab="suggestions">
              <i data-lucide="apple"></i>
              Food Suggestions
            </button>
            <button className="tab" data-tab="education">
              <i data-lucide="book-open"></i>
              Learn
            </button>
          </div>

          <div className="content-grid">
            <div className="main-column">
              <button className="card cycle-phase-card" onClick={handleCyclePhaseClick}>
                <h3 className="card-title">Current Cycle Phase</h3>
                <div className="cycle-phase" id="cyclePhaseContent">
                  <p id="currentCycleDay">No cycle data available</p>
                  <p className="hint">Click to update in tracker</p>
                </div>
              </button>

              <div className="card">
                <h3 className="card-title">Track Your Meals</h3>
                <form id="mealForm" className="meal-form">
                  <div className="form-grid">
                    <input
                      type="text"
                      id="foodInput"
                      placeholder="What did you eat?"
                      required
                    />
                    <input
                      type="number"
                      id="caloriesInput"
                      placeholder="Calories"
                      required
                    />
                    <input
                      type="time"
                      id="timeInput"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary btn-full">Add Meal</button>
                </form>
              </div>

              <div className="card">
                <h3 className="card-title">Today&apos;s Meals</h3>
                <div id="mealLogs" className="meal-logs"></div>
              </div>
            </div>

            <div className="sidebar">
              <div className="card">
                <h3 className="card-title">Daily Summary</h3>
                <div className="summary">
                  <div className="summary-row">
                    <span>Calories Goal</span>
                    <span className="summary-value">2000</span>
                  </div>
                  <div className="summary-row">
                    <span>Consumed</span>
                    <span id="totalCalories" className="summary-value highlight">0</span>
                  </div>
                  <div className="progress-bar">
                    <div id="caloriesProgress" className="progress-fill"></div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">Recommended Foods</h3>
                <div className="food-recommendations">
                  <div className="food-item">
                    <i data-lucide="apple"></i>
                    <span>Apples (rich in iron)</span>
                  </div>
                  <div className="food-item">
                    <i data-lucide="salad"></i>
                    <span>Nuts and seeds</span>
                  </div>
                  <div className="food-item">
                    <i data-lucide="wheat"></i>
                    <span>Whole grains</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">PCOS Diet Tips</h3>
                <div className="tips">
                  <p>&bull; Limit processed foods and sugars</p>
                  <p>&bull; Include anti-inflammatory foods</p>
                  <p>&bull; Stay hydrated throughout the day</p>
                  <p>&bull; Eat smaller, frequent meals</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
