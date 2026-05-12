const APP_STORAGE_KEY = 'studyCoachData';
let questionsData = null;
let currentProgram = null;
let currentLevel = null;
let currentSubject = null;
let currentTopic = null;
let currentQuestions = [];
let currentReadingMaterials = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval = null;
let timeLeft = 0;
let sessionItems = []; // Array of {type: 'reading'|'question', item: data}
let currentItemIndex = 0;
let currentSession = 1;
const TOTAL_SESSIONS = 3;
let liveScore = 0;
let totalPossibleScore = 0;

const motivationalTexts = [
  "Stay focused 💪",
  "You got this! 🔥",
  "Keep pushing! 💯",
  "Almost there! ⚡",
  "Stay strong! 💪",
  "You've got this! 🌟"
];

const feedbackMessages = {
  excellent: ["Outstanding! 🎉", "Amazing work! 🌟", "Excellent results! 💯"],
  good: ["Good job! 👍", "Nice work! ✨", "Well done! 🎯"],
  average: ["Keep practicing! 📚", "Room for improvement! 💪", "Let's do better! 🔄"],
  poor: ["Let's improve this topic! 📖", "Practice makes perfect! 💪", "Don't give up! 🌟"]
};

const subjectTopics = {
  chemistry: "Atomic Structure",
  physics: "Electricity",
  biology: "Cells",
  addmath: "Algebra",
  coremath: "Statistics",
  english: "Comprehension",
  economics: "Demand & Supply"
};

function loadData() {
  const stored = localStorage.getItem(APP_STORAGE_KEY);
  let parsed = null;
  if (stored) {
    try {
      parsed = JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse stored app data:', error);
    }
  }

  const data = parsed || {
    streak: 0,
    lastStudyDate: null,
    totalSessions: 0,
    subjectScores: {},
    completedTopics: []
  };

  if (!data.subjectScores) data.subjectScores = {};
  if (!data.completedTopics) data.completedTopics = [];

  return data;
}

function saveData(data) {
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data));
}

function updateStreak() {
  const data = loadData();
  const today = new Date().toDateString();
  const lastDate = data.lastStudyDate;
  
  if (lastDate) {
    const last = new Date(lastDate);
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
  saveData(data);
}

function getTodayPlan() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];

  if (questionsData && questionsData.dailyPlans && questionsData.dailyPlans[today]) {
    return questionsData.dailyPlans[today];
  }

  // Fallback: use the first available subject key from programs
  const fallback = [];
  if (questionsData && questionsData.programs) {
    Object.entries(questionsData.programs).forEach(([programKey, programData]) => {
      Object.entries(programData.levels || {}).forEach(([levelKey, levelData]) => {
        Object.keys(levelData.subjects || {}).forEach(subjectKey => {
          fallback.push(`${programKey}_${levelKey}_${subjectKey}`);
        });
      });
    });
  }
  return fallback.length ? [fallback[0]] : [];
}

function getRandomSubjectFromPlan(plan) {
  if (!plan || plan.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * plan.length);
  const subjectKey = plan[randomIndex];

  const programKeys = Object.keys(questionsData.programs || {});
  for (const programKey of programKeys) {
    if (subjectKey.startsWith(`${programKey}_`)) {
      const remainder = subjectKey.slice(programKey.length + 1);
      const remainderParts = remainder.split('_');
      let level = '1';
      let subject = remainder;

      if (remainderParts.length >= 2 && ['1', '2', '3'].includes(remainderParts[0])) {
        level = remainderParts[0];
        subject = remainderParts.slice(1).join('_');
      }

      return { program: programKey, level, subject };
    }
  }

  // Fallback if program keys are not found
  const parts = subjectKey.split('_');
  if (parts.length >= 3) {
    const program = `${parts[0]}_${parts[1]}`;
    const level = parts[2] && ['1', '2', '3'].includes(parts[2]) ? parts[2] : '1';
    const subject = level === parts[2] ? parts.slice(3).join('_') : parts.slice(2).join('_');
    return { program, level, subject };
  }

  return null;
}

function getSubjectData(program, subject, level = '1') {
  return questionsData.programs[program]?.levels?.[level]?.subjects?.[subject] || null;
}

function getDifficultyClass(difficulty) {
  return `difficulty-${difficulty}`;
}

function getDifficultyLabel(difficulty) {
  const labels = {
    hard: 'Hard',
    medium: 'Medium',
    light: 'Light'
  };
  return labels[difficulty] || difficulty;
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
  }
}

function renderTodayPlan() {
  const plan = getTodayPlan();
  const container = document.getElementById('topicsList');
  container.innerHTML = '';
  
  if (!plan || plan.length === 0) {
    container.innerHTML = '<div class="empty-state">No subjects planned for today</div>';
    return;
  }
  
  plan.forEach(subjectKey => {
    const subjectInfo = getRandomSubjectFromPlan([subjectKey]);
    if (subjectInfo) {
      const subjectData = getSubjectData(subjectInfo.program, subjectInfo.subject, subjectInfo.level);
      if (subjectData) {
        const card = createSubjectCard(subjectData, subjectInfo.program, subjectInfo.level, subjectInfo.subject);
        container.appendChild(card);
      }
    }
  });
}

function createSubjectCard(subjectData, program, level, subject) {
  const card = document.createElement('div');
  card.className = 'card subject-card';
  card.onclick = () => startStudySession(program, level, subject);
  
  card.innerHTML = `
    <div class="subject-icon">${subjectData.icon}</div>
    <div class="subject-info">
      <div class="subject-name">${subjectData.name}</div>
      <div class="subject-program">${questionsData.programs[program].name} • SHS ${level}</div>
    </div>
    <button class="btn btn-sm btn-primary">Start</button>
  `;
  
  return card;
}

function startStudySession(program, level, subject) {
  currentProgram = program;
  currentLevel = level;
  currentSubject = subject;
  const subjectData = getSubjectData(program, subject, level);
  
  if (!subjectData) return;
  
  currentSession = 1;
  
  const iconElement = document.getElementById('currentSubjectIcon');
  if (iconElement) iconElement.textContent = subjectData.icon;
  const nameElement = document.getElementById('currentSubjectName');
  if (nameElement) nameElement.textContent = subjectData.name;
  
  // Create session items (reading + questions)
  createSessionItems(subjectData);
  
  showPage('timerPage');
  resetTimer();
}

function createSessionItems(subjectData) {
  sessionItems = [];
  currentItemIndex = 0;
  liveScore = 0;
  totalPossibleScore = 0;
  
  // Add reading materials first
  if (subjectData.readingMaterials) {
    subjectData.readingMaterials.forEach(material => {
      sessionItems.push({
        type: 'reading',
        item: material
      });
    });
  }
  
  // Add questions
  if (subjectData.questions) {
    subjectData.questions.forEach(question => {
      sessionItems.push({
        type: 'question',
        item: question
      });
      totalPossibleScore += getQuestionScore(question);
    });
  }
  
  // Shuffle the items for variety
  sessionItems = sessionItems.sort(() => Math.random() - 0.5);
  
  // Calculate total time based on reading materials
  timeLeft = calculateSessionTime(subjectData);
}

function getQuestionScore(question) {
  // Score based on difficulty
  const scores = { easy: 10, medium: 20, hard: 30 };
  return scores[question.difficulty] || 10;
}

function calculateSessionTime(subjectData) {
  let totalTime = 0;
  if (subjectData.readingMaterials) {
    totalTime = subjectData.readingMaterials.reduce((sum, material) => sum + (material.timeAllocation || 5), 0);
  }
  // Add time for questions (assume 2 minutes per question)
  const questionTime = (subjectData.questions?.length || 0) * 2 * 60;
  totalTime += questionTime;
  
  return Math.max(totalTime, 10 * 60); // Minimum 10 minutes
}

function resetTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  const subjectData = getSubjectData(currentProgram, currentSubject, currentLevel);
  const ratio = subjectData ? timeLeft / calculateSessionTime(subjectData) : 1;
  updateTimerCircle(timeLeft > 0 ? ratio : 1);
  
  const motivational = document.getElementById('timerMotivational');
  if (motivational) {
    motivational.textContent = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
  }
  const sessionProgressLabel = document.getElementById('sessionProgress');
  if (sessionProgressLabel) {
    sessionProgressLabel.textContent = `Session ${currentSession}/${TOTAL_SESSIONS}`;
  }
  
  // Show first item
  showCurrentSessionItem();
  
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
  if (resetBtn) resetBtn.classList.add('hidden');
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (!display) return;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimerCircle(ratio) {
  const circle = document.getElementById('timerCircle');
  if (!circle) return;
  const length = circle.getTotalLength();
  circle.style.strokeDasharray = length;
  circle.style.strokeDashoffset = `${length * (1 - Math.max(0, Math.min(1, ratio)))}`;
}

function pauseTimer() {
  if (!timerInterval) return;
  clearInterval(timerInterval);
  timerInterval = null;
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
}

function showCurrentSessionItem() {
  if (currentItemIndex >= sessionItems.length) {
    // Session complete
    timerComplete();
    return;
  }
  
  const currentItem = sessionItems[currentItemIndex];
  const container = document.getElementById('sessionContent');
  
  if (currentItem.type === 'reading') {
    container.innerHTML = `
      <div class="reading-card card">
        <div class="reading-header">
          <h3>${currentItem.item.title}</h3>
          <div class="topic-badge">Topic: ${currentItem.item.topic}</div>
        </div>
        <div class="reading-content">
          ${currentItem.item.content}
        </div>
        <div class="reading-actions">
          <button class="btn btn-primary" onclick="nextSessionItem()">Continue Reading</button>
        </div>
      </div>
    `;
  } else if (currentItem.type === 'question') {
    renderLiveQuestion(currentItem.item);
  }
  
  updateProgressBar();
}

function renderMCQ(question) {
  return `
    <div class="options-grid">
      ${question.options.map((option, index) => `
        <button type="button" class="option" data-index="${index}" onclick="selectOption(this)">
          ${option}
        </button>
      `).join('')}
    </div>
  `;
}

function renderShortAnswer(question) {
  return `
    <div class="short-answer">
      <input id="shortAnswer" type="text" placeholder="Type your answer..." aria-label="Short answer" />
    </div>
  `;
}

function selectOption(button) {
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.toggle('selected', opt === button);
  });
}

function renderLiveQuestion(question) {
  const container = document.getElementById('sessionContent');
  
  container.innerHTML = `
    <div class="question-card card">
      <div class="question-header">
        <div class="question-number">Question ${currentItemIndex + 1} of ${sessionItems.length}</div>
        <div class="live-score">Score: ${liveScore}/${totalPossibleScore}</div>
      </div>
      <div class="question-text">${question.question}</div>
      
      ${question.type === 'mcq' ? renderMCQ(question) : renderShortAnswer(question)}
      
      <div class="question-actions">
        <button class="btn btn-primary" onclick="submitLiveAnswer()">Submit Answer</button>
      </div>
    </div>
  `;
}

function submitLiveAnswer() {
  const currentItem = sessionItems[currentItemIndex];
  const question = currentItem.item;
  let userAnswer = null;
  let isCorrect = false;
  
  if (question.type === 'mcq') {
    const selectedOption = document.querySelector('.option.selected');
    if (selectedOption) {
      userAnswer = parseInt(selectedOption.getAttribute('data-index'));
      isCorrect = userAnswer === question.correct;
    }
  } else {
    const input = document.getElementById('shortAnswer');
    userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = question.answer.toLowerCase().trim();
    isCorrect = userAnswer === correctAnswer;
  }
  
  if (isCorrect) {
    liveScore += getQuestionScore(question);
    showFeedback(true, question.explanation || 'Correct!');
  } else {
    showFeedback(false, question.explanation || `Correct answer: ${question.type === 'mcq' ? question.options[question.correct] : question.answer}`);
  }
  
  // Store answer
  userAnswers[currentItemIndex] = {
    question: question.question,
    userAnswer,
    correctAnswer: question.type === 'mcq' ? question.options[question.correct] : question.answer,
    isCorrect,
    explanation: question.explanation
  };
  
  // Auto-advance after feedback
  setTimeout(() => {
    nextSessionItem();
  }, 2000);
}

function showFeedback(isCorrect, message) {
  const container = document.getElementById('sessionContent');
  const feedbackClass = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
  const icon = isCorrect ? '✅' : '❌';
  
  container.innerHTML += `
    <div class="feedback-overlay ${feedbackClass}">
      <div class="feedback-content">
        <div class="feedback-icon">${icon}</div>
        <div class="feedback-message">${message}</div>
      </div>
    </div>
  `;
}

function nextSessionItem() {
  currentItemIndex++;
  showCurrentSessionItem();
}

function updateProgressBar() {
  const progress = (currentItemIndex / sessionItems.length) * 100;
  const progressBar = document.getElementById('sessionProgressBar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
}

function startTimer() {
  const subjectData = getSubjectData(currentProgram, currentSubject, currentLevel);
  if (!subjectData) {
    console.warn('No subject selected for timer start.');
    return;
  }

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (startBtn) startBtn.classList.add('hidden');
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  if (resetBtn) resetBtn.classList.remove('hidden');
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    updateTimerCircle(timeLeft / calculateSessionTime(subjectData));
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerComplete();
    }
  }, 1000);
}

function timerComplete() {
  if (currentSession < TOTAL_SESSIONS) {
    currentSession++;
    resetTimer();
    startTimer();
  } else {
    showPage('resultsPage');
    calculateResults();
  }
}

function calculateResults() {
  const totalQuestions = Object.keys(userAnswers).length;
  const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  let feedback, feedbackSub;
  
  if (percentage >= 80) {
    feedback = feedbackMessages.excellent[Math.floor(Math.random() * feedbackMessages.excellent.length)];
    feedbackSub = `You scored ${liveScore} points - Amazing performance!`;
  } else if (percentage >= 60) {
    feedback = feedbackMessages.good[Math.floor(Math.random() * feedbackMessages.good.length)];
    feedbackSub = `You scored ${liveScore} points - Good job!`;
  } else if (percentage >= 40) {
    feedback = feedbackMessages.average[Math.floor(Math.random() * feedbackMessages.average.length)];
    feedbackSub = `You scored ${liveScore} points - Keep practicing!`;
  } else {
    feedback = feedbackMessages.poor[Math.floor(Math.random() * feedbackMessages.poor.length)];
    feedbackSub = `You scored ${liveScore} points - Let's review this topic!`;
  }
  
  const scoreValueEl = document.getElementById('scoreValue');
  const scoreTotalEl = document.getElementById('scoreTotal');
  const feedbackMessageEl = document.getElementById('feedbackMessage');
  const feedbackSubEl = document.getElementById('feedbackSub');
  const breakdown = document.getElementById('resultsBreakdown');

  if (scoreValueEl) scoreValueEl.textContent = liveScore;
  if (scoreTotalEl) scoreTotalEl.textContent = `out of ${totalPossibleScore}`;
  if (feedbackMessageEl) feedbackMessageEl.textContent = feedback;
  if (feedbackSubEl) feedbackSubEl.textContent = feedbackSub;
  if (breakdown) {
    breakdown.innerHTML = '';
    Object.values(userAnswers).forEach((answer, index) => {
      const item = document.createElement('div');
      item.className = `result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
      item.innerHTML = `
        <div class="result-status">${answer.isCorrect ? '✓' : '✗'}</div>
        <div class="result-text">
          <div>${answer.question}</div>
          ${!answer.isCorrect ? `<div style="color: var(--gray); font-size: 12px; margin-top: 4px;">Your answer: ${answer.userAnswer || 'No answer'}</div>` : ''}
          <div class="explanation">${answer.isCorrect ? 'Correct!' : `Correct answer: ${answer.correctAnswer}`}</div>
        </div>
      `;
      breakdown.appendChild(item);
    });
  }
  
  updateStreak();
  
  const data = loadData();
  data.totalSessions++;
  
  const subjectKey = `${currentProgram}_${currentSubject}`;
  if (!data.subjectScores[subjectKey]) {
    data.subjectScores[subjectKey] = { correct: 0, total: 0 };
  }
  data.subjectScores[subjectKey].correct += correctAnswers;
  data.subjectScores[subjectKey].total += totalQuestions;
  
  saveData(data);
}

function renderProgress() {
  if (!questionsData || !questionsData.programs) return;
  
  const data = loadData();
  
  const streakElement = document.getElementById('streakValue');
  if (streakElement) streakElement.textContent = `${data.streak} days`;
  
  try {
    const completedTopics = Object.keys(data.subjectScores || {}).length;
    const totalTopics = Object.keys(questionsData.programs).reduce((sum, program) => {
      const programData = questionsData.programs[program];
      if (!programData || !programData.levels) return sum;
      return Object.entries(programData.levels).reduce((levelSum, [levelKey, levelData]) => {
        if (levelData && levelData.subjects) {
          return levelSum + Object.keys(levelData.subjects).length;
        }
        return levelSum;
      }, sum);
    }, 0);
    const progressPercent = totalTopics > 0 ? Math.min(100, Math.round((completedTopics / totalTopics) * 100)) : 0;
    
    const progressValueElement = document.getElementById('progressValue');
    if (progressValueElement) progressValueElement.textContent = `${progressPercent}%`;
    
    const progressBarElement = document.getElementById('progressBar');
    if (progressBarElement) progressBarElement.style.width = `${progressPercent}%`;
  } catch (error) {
    console.error('Error calculating progress:', error);
  }
  
  const weakSubjects = [];
  Object.entries(data.subjectScores || {}).forEach(([subjectKey, scores]) => {
    const percent = (scores.correct / scores.total) * 100;
    if (percent < 60) {
      let program = null;
      let level = '1';
      let subject = null;
      const programKeys = Object.keys(questionsData.programs || {});
      for (const key of programKeys) {
        if (subjectKey.startsWith(`${key}_`)) {
          program = key;
          const remainder = subjectKey.slice(key.length + 1);
          const remainderParts = remainder.split('_');
          if (remainderParts.length >= 2 && ['1', '2', '3'].includes(remainderParts[0])) {
            level = remainderParts[0];
            subject = remainderParts.slice(1).join('_');
          } else {
            subject = remainder;
          }
          break;
        }
      }
      if (!program) {
        const parts = subjectKey.split('_');
        if (parts.length >= 3) {
          program = `${parts[0]}_${parts[1]}`;
          subject = parts.slice(2).join('_');
        }
      }
      const subjectData = getSubjectData(program, subject, level);
      if (subjectData) {
        weakSubjects.push(subjectData.name);
      }
    }
  });
  
  const weakContainer = document.getElementById('weakSubjectsList');
  if (weakContainer) {
    if (weakSubjects.length > 0) {
      weakContainer.innerHTML = weakSubjects.map(s => 
        `<span class="weak-subject-tag">${s}</span>`
      ).join('');
    } else {
      weakContainer.innerHTML = '<p style="color: var(--gray);">No weak subjects yet! Keep studying!</p>';
    }
  }
}

function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
}

function goHome() {
  showPage('homePage');
  renderTodayPlan();
}

async function initApp() {
  try {
    console.log('Starting to load questions.json');
    const response = await fetch('questions.json');
    if (response.ok) {
      questionsData = await response.json();
    } else {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Fetch failed, falling back to local sample data:', error);
    questionsData = {
      dailyPlans: {
        monday: ['general_arts_1_english'],
        tuesday: ['general_arts_1_english'],
        wednesday: ['general_arts_1_english'],
        thursday: ['general_arts_1_english'],
        friday: ['general_arts_1_english'],
        saturday: ['general_arts_1_english'],
        sunday: ['general_arts_1_english']
      },
      programs: {
        general_arts: {
          name: 'General Arts',
          icon: '🎭',
          levels: {
            '1': {
              subjects: {
                english: {
                  name: 'English Language',
                  icon: '📝',
                  description: 'Grammar, comprehension, and literature',
                  topics: ['Parts of Speech', 'Tenses'],
                  questions: [
                    {
                      id: 'en1_1',
                      type: 'mcq',
                      question: 'Which of the following is a noun?',
                      options: ['Run', 'Beautiful', 'Book', 'Quickly'],
                      correct: 2,
                      explanation: 'Book is a noun - a person, place, or thing.',
                      topic: 'Parts of Speech',
                      difficulty: 'easy'
                    }
                  ],
                  readingMaterials: [
                    {
                      title: 'Introduction to English Grammar',
                      content: 'English grammar is the set of rules that govern how words are combined to form sentences.',
                      topic: 'Parts of Speech',
                      timeAllocation: 5
                    }
                  ]
                }
              }
            }
          }
        }
      }
    };
  }

  console.log('Questions data loaded:', questionsData);
  initNavigation();
  renderTodayPlan();
  renderProgress();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', initApp);

window.startStudySession = startStudySession;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.goHome = goHome;
window.showPage = showPage;
window.toggleFocusMode = toggleFocusMode;
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

window.initNavigation = initNavigation;
