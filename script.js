/* ============================================
   Study Coach - JavaScript
   ============================================ */

// ============================================
// Constants
// ============================================
const STORAGE_KEY = 'studyCoachData';
const TIMER_DURATION = 40 * 60; // 40 minutes in seconds

// ============================================
// Topics Data
// ============================================
let questionsData = null;
const topics = []; // Will be populated from JSON

// ============================================
// Load Questions Data
// ============================================
async function loadQuestionsData() {
  try {
    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'questions.json');
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve({ json: () => JSON.parse(xhr.responseText) });
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send();
    });
    
    questionsData = await response.json();
    console.log('Questions data loaded in script.js:', questionsData);
    
    // Populate topics from the new structure
    populateTopicsFromData();
  } catch (error) {
    console.error('Failed to load questions in script.js:', error);
    // Fallback to old hardcoded topics
    topics.push(
      { id: 'english', title: 'English', description: 'Grammar, comprehension, and literature', badge: 'Language' },
      { id: 'math', title: 'Core Mathematics', description: 'Algebra, geometry, and statistics', badge: 'Core' },
      { id: 'add-math', title: 'Add Mathematics', description: 'Calculus, differentiation, and integration', badge: 'Advanced' },
      { id: 'physics', title: 'Physics', description: 'Mechanics, waves, and electricity', badge: 'Science' },
      { id: 'chemistry', title: 'Chemistry', description: 'Atomic structure, reactions, and periodicity', badge: 'Science' },
      { id: 'biology', title: 'Biology', description: 'Cell biology, genetics, and ecology', badge: 'Science' },
      { id: 'ict', title: 'Information Technology', description: 'Computer fundamentals and applications', badge: 'Technology' },
      { id: 'economics', title: 'Economics', description: 'Microeconomics and macroeconomics', badge: 'Social' }
    );
  }
}

function populateTopicsFromData() {
  if (!questionsData || !questionsData.programs) return;
  
  topics.length = 0; // Clear existing topics
  
  Object.entries(questionsData.programs).forEach(([programKey, programData]) => {
    Object.entries(programData.levels).forEach(([levelKey, levelData]) => {
      Object.entries(levelData.subjects).forEach(([subjectKey, subjectData]) => {
        topics.push({
          id: `${programKey}_${levelKey}_${subjectKey}`,
          title: subjectData.name,
          description: subjectData.description || `${subjectData.name} for SHS Level ${levelKey}`,
          badge: programData.name,
          program: programKey,
          level: levelKey,
          subject: subjectKey
        });
      });
    });
  });
}

// ============================================
// State
// ============================================
let timer = {
  duration: TIMER_DURATION,
  remaining: TIMER_DURATION,
  interval: null,
  isRunning: false
};

let data = {
  completedTopics: [],
  streak: 0,
  lastStudyDate: null,
  xp: 0,
  level: 0
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuestionsData();
  loadData();
  initNavigation();
  initTimer();
  renderTopics();
  renderDashboard();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
  // Handle mobile nav toggle
  window.toggleNav = function() {
    const menu = document.querySelector('.nav-menu');
    if (menu) {
      menu.classList.toggle('active');
    }
  };

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.nav-menu');
      if (menu && window.innerWidth <= 768) {
        menu.classList.remove('active');
      }
    });
  });
}

// ============================================
// Page Navigation
// ============================================
window.navigateTo = function(page) {
  window.location.href = page;
};

// ============================================
// Timer Functions
// ============================================
function initTimer() {
  const timerPage = document.getElementById('timerPage') || document.querySelector('.study-page');
  if (!timerPage) return;

  // Reset display
  updateTimerDisplay();
}

function startTimer() {
  if (timer.isRunning) return;
  
  timer.isRunning = true;
  
  // Update button states
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  if (startBtn) startBtn.classList.add('hidden');
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  if (resetBtn) resetBtn.classList.remove('hidden');
  
  timer.interval = setInterval(() => {
    timer.remaining--;
    updateTimerDisplay();
    
    if (timer.remaining <= 0) {
      timerComplete();
    }
  }, 1000);
}

function pauseTimer() {
  if (!timer.isRunning) return;
  
  timer.isRunning = false;
  clearInterval(timer.interval);
  
  // Update button states
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  
  if (startBtn) startBtn.textContent = 'Resume';
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
}

function resetTimer() {
  clearInterval(timer.interval);
  timer.isRunning = false;
  timer.remaining = timer.duration;
  
  // Update button states
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  if (startBtn) {
    startBtn.textContent = 'Start';
    startBtn.classList.remove('hidden');
  }
  if (pauseBtn) pauseBtn.classList.add('hidden');
  if (resetBtn) resetBtn.classList.add('hidden');
  
  updateTimerDisplay();
}

function timerComplete() {
  clearInterval(timer.interval);
  timer.isRunning = false;
  
  // Add completion XP
  addXP(50);
  
  // Show completion message
  alert('Great job! You completed your study session. +50 XP earned!');
  
  // Update streak
  updateStreak();
  
  resetTimer();
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (display) {
    const minutes = Math.floor(timer.remaining / 60);
    const seconds = timer.remaining % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

// ============================================
// Focus Mode
// ============================================
window.toggleFocusMode = function() {
  document.body.classList.toggle('focus-mode');
};

// ============================================
// Topics Rendering
// ============================================
function renderTopics() {
  const container = document.getElementById('topicsList');
  if (!container) return;

  if (!topics || topics.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No topics available.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = topics.map(topic => {
    const isCompleted = data.completedTopics.includes(topic.id);
    return `
      <div class="topic-card ${isCompleted ? 'completed' : ''}">
        <div 
          class="topic-checkbox ${isCompleted ? 'checked' : ''}" 
          onclick="toggleTopic('${topic.id}')"
          role="checkbox"
          aria-checked="${isCompleted}"
          tabindex="0"
          onkeypress="if(event.key==='Enter') toggleTopic('${topic.id}')"
        ></div>
        <div class="topic-info">
          <h3 class="topic-title">${topic.title}</h3>
          <p class="topic-description">${topic.description}</p>
        </div>
        <span class="topic-badge">${topic.badge}</span>
      </div>
    `;
  }).join('');
}

function toggleTopic(topicId) {
  const index = data.completedTopics.indexOf(topicId);
  
  if (index > -1) {
    data.completedTopics.splice(index, 1);
  } else {
    data.completedTopics.push(topicId);
    addXP(10);
    updateStreak();
  }
  
  saveData();
  renderTopics();
  
  // Update dashboard if on dashboard page
  renderDashboard();
}

// ============================================
// Dashboard Rendering
// ============================================
function renderDashboard() {
  // Update stats
  const streakEl = document.getElementById('streakValue');
  const xpEl = document.getElementById('xpValue');
  const topicsEl = document.getElementById('topicsCompleted');
  const levelEl = document.getElementById('levelValue');
  
  if (streakEl) streakEl.textContent = data.streak;
  if (xpEl) xpEl.textContent = data.xp;
  if (topicsEl) topicsEl.textContent = data.completedTopics.length;
  if (levelEl) levelEl.textContent = data.level;
}

// ============================================
// XP & Streak System
// ============================================
function addXP(amount) {
  data.xp += amount;
  data.level = Math.floor(data.xp / 100);
  saveData();
}

function updateStreak() {
  const today = new Date().toDateString();
  
  if (data.lastStudyDate) {
    const last = new Date(data.lastStudyDate);
    const todayDate = new Date(today);
    const diff = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      data.streak += 1;
    } else if (diff > 1) {
      data.streak = 1;
    }
  } else {
    data.streak = 1;
  }
  
  data.lastStudyDate = today;
  saveData();
}

// ============================================
// Data Storage
// ============================================
function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      data = { ...data, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

// ============================================
// Export functions to window
// ============================================
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.toggleFocusMode = toggleFocusMode;
window.toggleTopic = toggleTopic;