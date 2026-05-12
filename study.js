const DEFAULT_SESSION_SECONDS = 600;
const XP_BY_DIFFICULTY = {
  beginner: 30,
  intermediate: 50,
  advanced: 80
};
const QUALITY_LEVEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};
const STORAGE_KEY = 'studyCoachAIProgress';

const COURSE_CATALOG = {
  information_technology: {
    name: 'Information Technology',
    description: 'Systems, infrastructure, and workplace productivity for modern IT careers.',
    topics: [
      {
        id: 'cloud_fundamentals',
        title: 'Cloud Fundamentals',
        summary: 'Learn the architecture, benefits, and service models that power modern cloud platforms.',
        notes: [
          'Cloud computing delivers storage, compute, and networking over the internet.',
          'Public, private, and hybrid clouds each provide flexibility in deployment style.',
          'IaaS, PaaS, and SaaS are the three core service models for cloud delivery.'
        ],
        flashcards: [
          { prompt: 'What does IaaS stand for?', answer: 'Infrastructure as a Service' },
          { prompt: 'Name one advantage of cloud computing.', answer: 'Scalability' }
        ],
        challenges: [
          'Sketch an architecture for a cloud-hosted web app using IaaS components.',
          'List three reasons companies migrate to cloud platforms.'
        ],
        questions: [
          {
            id: 'it_cf_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Which cloud model provides complete application platforms for developers?',
            options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'],
            correctIndex: 1,
            explanation: 'PaaS provides application platforms and development tools.'
          },
          {
            id: 'it_cf_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'Hybrid cloud combines private and public cloud resources.',
            correctIndex: 0,
            options: ['True', 'False'],
            explanation: 'Hybrid cloud mixes private and public infrastructure.'
          },
          {
            id: 'it_cf_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'A cloud provider that automatically assigns IP addresses and storage is using _____ services.',
            answer: 'managed',
            explanation: 'Managed services handle infrastructure operations for you.'
          }
        ]
      },
      {
        id: 'networking_basics',
        title: 'Networking Basics',
        summary: 'Understand the foundation of network communication, IP addressing, and routing essentials.',
        notes: [
          'IP addresses identify devices on a network using unique numerical labels.',
          'Routers forward traffic between networks while switches connect devices within the same network.',
          'Subnetting divides a network into smaller, manageable segments.'
        ],
        flashcards: [
          { prompt: 'What does DNS translate?', answer: 'Domain name to IP address' },
          { prompt: 'What device forwards traffic between networks?', answer: 'Router' }
        ],
        challenges: [
          'Draw how a local network connects to the internet through a router.',
          'Explain the difference between an IP address and a subnet mask.'
        ],
        questions: [
          {
            id: 'it_nb_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'What does DNS resolve?',
            options: ['Email address', 'IP address', 'MAC address', 'Subnet mask'],
            correctIndex: 1,
            explanation: 'DNS resolves domain names into IP addresses.'
          },
          {
            id: 'it_nb_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'A switch operates primarily at the network layer.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation: 'Switches operate at the data link layer, not the network layer.'
          },
          {
            id: 'it_nb_3',
            type: 'fill',
            difficulty: 'advanced',
            text: '_____ masks separate a network into smaller groups to improve security and organization.',
            answer: 'subnet',
            explanation: 'Subnet masks are used to segment networks into subnets.'
          }
        ]
      }
    ]
  },
  cybersecurity: {
    name: 'Cybersecurity',
    description: 'Defensive mindset, threat detection, and secure operations for every engineer.',
    topics: [
      {
        id: 'threat_modeling',
        title: 'Threat Modeling',
        summary: 'Learn how to map risks, classify attackers, and design systems that resist common threats.',
        notes: [
          'Threat modeling identifies assets, entry points, and the people who might attack them.',
          'A strong threat model balances risk, impact, and mitigation costs.',
          'Common attacks include phishing, credential theft, and injection attacks.'
        ],
        flashcards: [
          { prompt: 'What is the first step of threat modeling?', answer: 'Identify assets' },
          { prompt: 'Name one common attack type.', answer: 'Phishing' }
        ],
        challenges: [
          'Create a list of assets for a simple login application.',
          'Name three security controls that reduce phishing risk.'
        ],
        questions: [
          {
            id: 'cy_tm_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Which of the following is a threat modeling activity?',
            options: ['Deploying servers', 'Identifying assets', 'Writing UI code', 'Updating DNS'],
            correctIndex: 1,
            explanation: 'Identifying assets is central to threat modeling.'
          },
          {
            id: 'cy_tm_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'Attack surface is the sum of all ways an attacker can access a system.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'The attack surface includes all entry points attackers can use.'
          },
          {
            id: 'cy_tm_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'Reducing the amount of exposed functionality is called minimizing the _____ surface.',
            answer: 'attack',
            explanation: 'Reducing the attack surface lowers exposure to threats.'
          }
        ]
      }
    ]
  },
  web_development: {
    name: 'Web Development',
    description: 'Build interactive web apps with HTML, CSS, and JavaScript fundamentals.',
    topics: [
      {
        id: 'ui_foundations',
        title: 'UI Foundations',
        summary: 'Understand responsive layouts, semantic markup, and polished visual design for web apps.',
        notes: [
          'Semantic HTML improves accessibility and search engine understanding.',
          'CSS variables and flexbox help build adaptive interfaces quickly.',
          'Animations and micro-interactions make apps feel smooth and alive.'
        ],
        flashcards: [
          { prompt: 'What is semantic HTML?', answer: 'HTML that uses meaningful tags' },
          { prompt: 'Name one CSS layout module.', answer: 'Flexbox' }
        ],
        challenges: [
          'Build a responsive card layout using CSS grid.',
          'Choose three semantic HTML tags for a blog post layout.'
        ],
        questions: [
          {
            id: 'wd_ui_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Which tag defines the main content of a page?',
            options: ['<nav>', '<header>', '<main>', '<footer>'],
            correctIndex: 2,
            explanation: '<main> represents the primary content of a page.'
          },
          {
            id: 'wd_ui_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'CSS grid is best for one-dimensional layouts only.',
            options: ['True', 'False'],
            correctIndex: 1,
            explanation: 'CSS grid is ideal for two-dimensional layouts.'
          },
          {
            id: 'wd_ui_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'Use _____ to define reusable styling values in CSS.',
            answer: 'variables',
            explanation: 'CSS variables store reusable styling values.'
          }
        ]
      }
    ]
  },
  mathematics: {
    name: 'Mathematics',
    description: 'Strengthen mathematical thinking with formulas, reasoning, and problem solving.',
    topics: [
      {
        id: 'algebra_basics',
        title: 'Algebra Basics',
        summary: 'Practice equations, variables, and the logic that powers problem solving.',
        notes: [
          'Variables represent unknown values and can be solved with equations.',
          'Balancing both sides of an equation preserves equality.',
          'Formulas let you compute results from known values quickly.'
        ],
        flashcards: [
          { prompt: 'What symbol typically represents an unknown?', answer: 'x' },
          { prompt: 'What does solving an equation mean?', answer: 'Finding the variable value' }
        ],
        challenges: [
          'Solve 2x + 5 = 15 and explain each step.',
          'Rewrite y = 3x + 2 in slope-intercept form.'
        ],
        questions: [
          {
            id: 'math_ab_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'If 3x = 12, what is x?',
            options: ['3', '4', '6', '9'],
            correctIndex: 1,
            explanation: '3x = 12 means x = 4.'
          },
          {
            id: 'math_ab_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'An equation is true only when both sides are equal.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'An equation holds when both expressions evaluate equally.'
          },
          {
            id: 'math_ab_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'The formula for the area of a rectangle is length × _____.',
            answer: 'width',
            explanation: 'Area of a rectangle equals length times width.'
          }
        ]
      }
    ]
  },
  physics: {
    name: 'Physics',
    description: 'Explore motion, energy, and the laws that describe the physical world.',
    topics: [
      {
        id: 'motion_laws',
        title: 'Laws of Motion',
        summary: 'Discover how forces change motion and how inertia keeps objects moving predictably.',
        notes: [
          'Newton’s first law states that objects resist changes to their state of motion.',
          'Force equals mass times acceleration (F = ma).',
          'Every action has an equal and opposite reaction.'
        ],
        flashcards: [
          { prompt: 'What does F = ma represent?', answer: 'Force equals mass times acceleration' },
          { prompt: 'Which law describes inertia?', answer: 'Newton’s first law' }
        ],
        challenges: [
          'Explain why a car continues moving after the brakes are released.',
          'Give an example of action and reaction forces.'
        ],
        questions: [
          {
            id: 'ph_ml_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Newton’s second law relates force to _____ and acceleration.',
            options: ['mass', 'energy', 'power', 'velocity'],
            correctIndex: 0,
            explanation: 'The second law says force equals mass times acceleration.'
          },
          {
            id: 'ph_ml_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'An object at rest will stay at rest unless acted on by a force.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'This is Newton’s first law of motion.'
          },
          {
            id: 'ph_ml_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'A reaction force is always equal and opposite to the _____ force.',
            answer: 'action',
            explanation: 'Action and reaction forces are equal and opposite.'
          }
        ]
      }
    ]
  },
  data_structures: {
    name: 'Data Structures',
    description: 'Organize and optimize data with common structures used in software engineering.',
    topics: [
      {
        id: 'arrays_lists',
        title: 'Arrays & Lists',
        summary: 'Compare sequential containers for storing data and understand lookup behaviors.',
        notes: [
          'Arrays store values at fixed positions and allow quick indexed access.',
          'Lists can grow dynamically and are easier to insert into mid-sequence.',
          'Choosing the right structure affects performance and memory usage.'
        ],
        flashcards: [
          { prompt: 'Which structure has constant-time indexed access?', answer: 'Array' },
          { prompt: 'Which is better for frequent inserts?', answer: 'Linked list' }
        ],
        challenges: [
          'Explain why arrays are faster for reads than linked lists.',
          'Describe when you would choose a list over an array.'
        ],
        questions: [
          {
            id: 'ds_al_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Which structure stores items in contiguous memory?',
            options: ['Tree', 'Array', 'Graph', 'Stack'],
            correctIndex: 1,
            explanation: 'Arrays store elements in contiguous memory locations.'
          },
          {
            id: 'ds_al_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'A linked list allows fast insertion at the beginning.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'Linked lists can insert at the head quickly.'
          },
          {
            id: 'ds_al_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'A _____ list stores elements in nodes connected by pointers.',
            answer: 'linked',
            explanation: 'A linked list uses nodes and pointers to connect elements.'
          }
        ]
      }
    ]
  },
  databases: {
    name: 'Databases',
    description: 'Design data storage, queries, and transactions for scalable applications.',
    topics: [
      {
        id: 'sql_fundamentals',
        title: 'SQL Fundamentals',
        summary: 'Learn the core commands for querying, filtering, and shaping relational data.',
        notes: [
          'SELECT retrieves columns from one or more tables.',
          'WHERE filters rows based on conditions.',
          'JOIN combines related rows from multiple tables.'
        ],
        flashcards: [
          { prompt: 'What does SQL stand for?', answer: 'Structured Query Language' },
          { prompt: 'Which clause filters rows?', answer: 'WHERE' }
        ],
        challenges: [
          'Write a query to select users with age over 18.',
          'Explain the difference between INNER JOIN and LEFT JOIN.'
        ],
        questions: [
          {
            id: 'db_sf_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'Which SQL keyword selects rows from a table?',
            options: ['PUT', 'GET', 'SELECT', 'PUSH'],
            correctIndex: 2,
            explanation: 'SELECT retrieves rows from a table.'
          },
          {
            id: 'db_sf_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'A LEFT JOIN keeps all rows from the left table.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'LEFT JOIN keeps all rows from the left table and matches right rows.'
          },
          {
            id: 'db_sf_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'A _____ key uniquely identifies each row in a table.',
            answer: 'primary',
            explanation: 'A primary key uniquely identifies rows.'
          }
        ]
      }
    ]
  },
  ai_ml: {
    name: 'AI & Machine Learning',
    description: 'Discover models, training, and practical AI techniques for modern systems.',
    topics: [
      {
        id: 'supervised_learning',
        title: 'Supervised Learning',
        summary: 'Explore how models learn from labeled examples to make predictions.',
        notes: [
          'Supervised learning trains on labeled data with inputs and expected outputs.',
          'Common tasks include classification and regression.',
          'Models learn patterns that generalize to new, unseen examples.'
        ],
        flashcards: [
          { prompt: 'What is supervised learning?', answer: 'Training with labeled examples' },
          { prompt: 'Name one supervised task.', answer: 'Classification' }
        ],
        challenges: [
          'Describe how a classification model differs from a regression model.',
          'Name one example of labeled training data.'
        ],
        questions: [
          {
            id: 'ai_sl_1',
            type: 'mcq',
            difficulty: 'beginner',
            text: 'What does supervised learning require?',
            options: ['No labels', 'Labeled data', 'Random sampling', 'Hand tuning'],
            correctIndex: 1,
            explanation: 'Supervised learning requires labeled training examples.'
          },
          {
            id: 'ai_sl_2',
            type: 'truefalse',
            difficulty: 'intermediate',
            text: 'Regression predicts continuous values.',
            options: ['True', 'False'],
            correctIndex: 0,
            explanation: 'Regression is used for continuous value prediction.'
          },
          {
            id: 'ai_sl_3',
            type: 'fill',
            difficulty: 'advanced',
            text: 'The process of adjusting model weights is called _____.',
            answer: 'training',
            explanation: 'Training updates model weights based on examples.'
          }
        ]
      }
    ]
  }
};

const state = {
  courseKey: null,
  topicId: null,
  difficulty: 'beginner',
  sessionItems: [],
  activeStep: 0,
  timer: null,
  secondsLeft: DEFAULT_SESSION_SECONDS,
  sessionActive: false,
  selectedOption: null,
  lastScore: 0,
  liveSummary: null,
  progressData: null,
  assistantOpen: false,
  feedbackTimeout: null
};

const elements = {};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function createElement(tag, attrs = {}, content = '') {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'html') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  if (typeof content === 'string') {
    element.innerHTML = content;
  }
  return element;
}

function loadProgressData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      sessionsCompleted: 0,
      focusMinutes: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      topicsMastered: [],
      weakTopics: []
    };
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to parse progress data:', error);
    return loadProgressData();
  }
}

function saveProgressData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progressData));
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function getSelectedCourse() {
  return COURSE_CATALOG[state.courseKey] || null;
}

function getSelectedTopic() {
  const course = getSelectedCourse();
  return course?.topics.find((topic) => topic.id === state.topicId) || null;
}

function renderCourseCards() {
  const container = $('#courseGrid');
  container.innerHTML = '';

  Object.entries(COURSE_CATALOG).forEach(([key, course]) => {
    const card = createElement('button', {
      className: `course-card ${state.courseKey === key ? 'selected' : ''}`,
      type: 'button',
      'data-course': key
    });

    card.innerHTML = `
      <h3>${course.name}</h3>
      <p>${course.description}</p>
    `;

    card.addEventListener('click', () => {
      state.courseKey = key;
      state.topicId = course.topics[0]?.id || null;
      renderCourseCards();
      renderTopicOptions();
      renderPreviewPanel();
      loadLiveSummary();
    });

    container.appendChild(card);
  });
}

function renderTopicOptions() {
  const topicSelect = $('#topicSelect');
  topicSelect.innerHTML = '';
  const course = getSelectedCourse();

  if (!course) {
    topicSelect.disabled = true;
    return;
  }

  topicSelect.disabled = false;
  course.topics.forEach((topic) => {
    const option = createElement('option', { value: topic.id }, topic.title);
    topicSelect.appendChild(option);
  });

  state.topicId = course.topics.find((topic) => topic.id === state.topicId)?.id || course.topics[0]?.id;
  topicSelect.value = state.topicId;
}

function renderDifficultyOptions() {
  const difficultySelect = $('#difficultySelect');
  difficultySelect.innerHTML = '';

  Object.entries(QUALITY_LEVEL).forEach(([key, label]) => {
    const option = createElement('option', { value: key }, label);
    difficultySelect.appendChild(option);
  });
  difficultySelect.value = state.difficulty;
}

function renderPreviewPanel() {
  const course = getSelectedCourse();
  const topic = getSelectedTopic();
  $('#previewCourseName').textContent = course ? course.name : 'Pick a course';
  $('#previewTopicName').textContent = topic ? topic.title : 'Choose a topic';
  $('#previewDifficulty').textContent = QUALITY_LEVEL[state.difficulty];
  $('#previewSummary').textContent = topic ? topic.summary : 'The session preview will appear here once you choose a course and topic.';
  $('#previewFlashcardCount').textContent = topic ? topic.flashcards.length : 0;
  $('#previewQuestionCount').textContent = topic ? topic.questions.filter(q => q.difficulty === state.difficulty).length : 0;
}

function renderDashboard() {
  const progress = state.progressData;
  const accuracy = progress.totalAnswers ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) : 0;
  $('#metricXP').textContent = progress.xp;
  $('#metricStreak').textContent = `${progress.streak} day${progress.streak === 1 ? '' : 's'}`;
  $('#metricAccuracy').textContent = `${accuracy}%`;
  $('#metricFocus').textContent = `${progress.focusMinutes} min`;
  $('#metricSessions').textContent = `${progress.sessionsCompleted}`;
  $('#metricMastered').textContent = `${progress.topicsMastered.length}`;
  $('#metricWeak').textContent = `${progress.weakTopics.length}`;
  $('#progressBarFill').style.width = `${Math.min(100, accuracy + progress.sessionsCompleted * 3)}%`;
}

function setAssistantStatus(message) {
  $('#assistantStatus').textContent = message;
}

function loadLiveSummary() {
  const topic = getSelectedTopic();
  if (!topic) return;

  const cacheKey = `wiki_${topic.title.replace(/\s+/g, '_').toLowerCase()}`;
  const cachedValue = localStorage.getItem(cacheKey);

  if (cachedValue) {
    state.liveSummary = cachedValue;
    setAssistantStatus('Live topic summary cached locally.');
    return;
  }

  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.title)}`;
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error('No live summary available');
      }
      return response.json();
    })
    .then((payload) => {
      if (payload.extract) {
        state.liveSummary = payload.extract;
        localStorage.setItem(cacheKey, payload.extract);
        setAssistantStatus('Live summary loaded from Wikipedia.');
      }
    })
    .catch(() => {
      state.liveSummary = null;
      setAssistantStatus('Live summary unavailable — using local lesson content.');
    });
}

function buildSessionItems() {
  const topic = getSelectedTopic();
  if (!topic) return [];

  const questions = topic.questions.filter((question) => question.difficulty === state.difficulty);
  const sampleQuestions = questions.length > 0 ? questions : topic.questions.filter((question) => question.difficulty === 'beginner');

  const items = [];
  items.push({ type: 'lesson', title: 'Quick lesson', content: topic.notes.join(' ') });
  items.push({ type: 'summary', title: 'AI summary', content: state.liveSummary || topic.summary });
  items.push({ type: 'flashcards', title: 'Flashcard drill', cards: topic.flashcards.slice(0, 2) });
  items.push({ type: 'quiz', title: 'Quiz challenge', questions: sampleQuestions });
  items.push({ type: 'challenge', title: 'Practice task', tasks: topic.challenges });

  return items;
}

function updateTimerRing() {
  const circle = $('#timerProgress');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, state.secondsLeft / DEFAULT_SESSION_SECONDS));
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
}

function updateSessionPanel() {
  $('#sessionTimer').textContent = formatTime(state.secondsLeft);
  $('#sessionLabel').textContent = state.sessionActive ? 'Live session' : 'Session ready';
  updateTimerRing();
}

function showStepCard() {
  const content = $('#sessionBody');
  const progressLabel = $('#sessionProgressLabel');
  const navText = $('#sessionNavText');
  const step = state.sessionItems[state.activeStep];

  content.innerHTML = '';
  navText.textContent = `Step ${state.activeStep + 1} of ${state.sessionItems.length}`;
  progressLabel.style.width = `${Math.round(((state.activeStep + 1) / state.sessionItems.length) * 100)}%`;

  if (!step) {
    content.innerHTML = '<div class="session-step"><h3>Session complete</h3><p>Finish the session to update your streak and XP.</p></div>';
    return;
  }

  if (step.type === 'lesson') {
    content.innerHTML = `
      <div class="session-step">
        <div class="session-header">
          <h3>${step.title}</h3>
          <span class="session-badge">${QUALITY_LEVEL[state.difficulty]}</span>
        </div>
        <p>${step.content}</p>
        <button class="btn btn-secondary" id="nextStepButton">Continue</button>
      </div>
    `;
    $('#nextStepButton').addEventListener('click', nextSessionStep);
  } else if (step.type === 'summary') {
    content.innerHTML = `
      <div class="session-step">
        <div class="session-header">
          <h3>${step.title}</h3>
          <span class="session-badge">AI powered</span>
        </div>
        <p>${step.content}</p>
        <button class="btn btn-secondary" id="nextStepButton">Next</button>
      </div>
    `;
    $('#nextStepButton').addEventListener('click', nextSessionStep);
  } else if (step.type === 'flashcards') {
    const cardsHtml = step.cards.map((card) => `
      <div class="flashcard">
        <strong>${card.prompt}</strong>
        <p>${card.answer}</p>
      </div>
    `).join('');

    content.innerHTML = `
      <div class="session-step">
        <div class="session-header">
          <h3>${step.title}</h3>
          <span class="session-badge">Memory boost</span>
        </div>
        <div class="flashcard-grid">${cardsHtml}</div>
        <button class="btn btn-secondary" id="nextStepButton">Ready for quiz</button>
      </div>
    `;
    $('#nextStepButton').addEventListener('click', nextSessionStep);
  } else if (step.type === 'quiz') {
    const question = step.questions[state.selectedQuestionIndex || 0];
    renderQuestionStep(question, step.questions.length);
  } else if (step.type === 'challenge') {
    const task = step.tasks[state.challengeIndex || 0];
    content.innerHTML = `
      <div class="session-step">
        <div class="session-header">
          <h3>${step.title}</h3>
          <span class="session-badge">Active practice</span>
        </div>
        <p>${task}</p>
        <button class="btn btn-secondary" id="nextStepButton">Mark complete</button>
      </div>
    `;
    $('#nextStepButton').addEventListener('click', () => {
      state.challengeIndex = (state.challengeIndex || 0) + 1;
      nextSessionStep();
    });
  }
}

function renderQuestionStep(question, totalQuestions) {
  const content = $('#sessionBody');
  const optionsHtml = question.options.map((option, index) => `
    <button type="button" class="option-card" data-index="${index}">${option}</button>
  `).join('');

  content.innerHTML = `
    <div class="session-step">
      <div class="session-header">
        <h3>${question.text}</h3>
        <span class="session-badge">Question ${state.selectedQuestionIndex + 1 || 1} / ${totalQuestions}</span>
      </div>
      <div class="option-grid">${optionsHtml}</div>
      <input id="fillInput" class="input-field" placeholder="Type your answer" style="display:none;" />
      <div class="button-group">
        <button class="btn btn-primary" id="submitAnswerBtn">Submit</button>
        <button class="btn btn-secondary" id="skipQuestionBtn">Skip</button>
      </div>
      <div id="feedbackBanner" class="feedback-banner" style="display:none;"></div>
    </div>
  `;

  state.selectedOption = null;
  if (question.type === 'fill') {
    $('#fillInput').style.display = 'block';
  }

  $all('.option-card').forEach((card) => card.addEventListener('click', () => {
    $all('.option-card').forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
    state.selectedOption = Number(card.dataset.index);
  }));

  $('#submitAnswerBtn').addEventListener('click', () => submitAnswer(question));
  $('#skipQuestionBtn').addEventListener('click', () => {
    showToast('Skipped. Keep moving through the session.', 'neutral');
    nextSessionStep();
  });
}

function submitAnswer(question) {
  const feedbackBanner = $('#feedbackBanner');
  if (!feedbackBanner) return;

  let isCorrect = false;
  let userAnswer = '';

  if (question.type === 'fill') {
    const input = $('#fillInput');
    userAnswer = input.value.trim().toLowerCase();
    isCorrect = userAnswer === question.answer.toLowerCase();
  } else {
    isCorrect = state.selectedOption === question.correctIndex;
    userAnswer = question.options[state.selectedOption] || '';
  }

  if (state.feedbackTimeout) {
    clearTimeout(state.feedbackTimeout);
  }

  if (isCorrect) {
    feedbackBanner.className = 'feedback-banner positive';
    feedbackBanner.textContent = `✅ ${question.explanation}`;
    feedbackBanner.style.display = 'grid';
    state.lastScore += XP_BY_DIFFICULTY[state.difficulty];
    state.progressData.correctAnswers += 1;
  } else {
    feedbackBanner.className = 'feedback-banner negative';
    feedbackBanner.textContent = `❌ ${question.explanation}`;
    feedbackBanner.style.display = 'grid';
    state.progressData.weakTopics = Array.from(new Set([...state.progressData.weakTopics, getSelectedTopic()?.title]));
  }

  state.progressData.totalAnswers += 1;
  state.progressData.topicsMastered = Array.from(new Set([...state.progressData.topicsMastered, getSelectedTopic()?.title]));
  saveProgressData();
  renderDashboard();

  state.feedbackTimeout = setTimeout(() => {
    feedbackBanner.style.display = 'none';
    nextSessionStep();
  }, 1200);
}

function nextSessionStep() {
  const currentStep = state.sessionItems[state.activeStep];

  if (currentStep?.type === 'quiz') {
    const questionList = currentStep.questions;
    const nextIndex = (state.selectedQuestionIndex || 0) + 1;

    if (nextIndex < questionList.length) {
      state.selectedQuestionIndex = nextIndex;
      showStepCard();
      return;
    }

    state.selectedQuestionIndex = 0;
  }

  state.activeStep += 1;
  if (state.activeStep >= state.sessionItems.length) {
    finishSession();
    return;
  }

  showStepCard();
}

function finishSession() {
  clearInterval(state.timer);
  state.sessionActive = false;
  state.progressData.xp += state.lastScore;
  state.progressData.sessionsCompleted += 1;
  state.progressData.focusMinutes += 10;
  updateStreakData();
  saveProgressData();
  renderDashboard();

  $('#sessionBody').innerHTML = `
    <div class="session-step">
      <div class="session-header">
        <h3>Session complete</h3>
        <span class="session-badge">+${state.lastScore} XP earned</span>
      </div>
      <p>You completed the session and unlocked new progress in your dashboard.</p>
      <button class="btn btn-primary" id="restartSessionBtn">Restart with this topic</button>
    </div>
  `;

  $('#restartSessionBtn').addEventListener('click', () => {
    resetSession();
    startSession();
  });
}

function updateStreakData() {
  const today = new Date().toDateString();
  if (state.progressData.lastStudyDate === today) {
    return;
  }

  const last = state.progressData.lastStudyDate ? new Date(state.progressData.lastStudyDate) : null;
  const todayDate = new Date(today);
  const diffDays = last ? Math.round((todayDate - last) / (1000 * 60 * 60 * 24)) : null;

  if (diffDays === 1) {
    state.progressData.streak += 1;
  } else if (!diffDays || diffDays > 1) {
    state.progressData.streak = 1;
  }
  state.progressData.lastStudyDate = today;
}

function startSession() {
  if (!state.courseKey || !state.topicId) {
    showToast('Choose a course and topic before starting.', 'danger');
    return;
  }

  state.sessionItems = buildSessionItems();
  state.activeStep = 0;
  state.selectedQuestionIndex = 0;
  state.challengeIndex = 0;
  state.lastScore = 0;
  state.secondsLeft = DEFAULT_SESSION_SECONDS;
  state.sessionActive = true;

  updateSessionPanel();
  showStepCard();
  $('#sessionCardTitle').textContent = `Live session: ${getSelectedCourse()?.name} • ${getSelectedTopic()?.title}`;

  if (state.timer) {
    clearInterval(state.timer);
  }

  state.timer = setInterval(() => {
    state.secondsLeft -= 1;
    updateSessionPanel();

    if (state.secondsLeft <= 0) {
      finishSession();
    }
  }, 1000);
}

function resetSession() {
  clearInterval(state.timer);
  state.sessionActive = false;
  state.secondsLeft = DEFAULT_SESSION_SECONDS;
  state.activeStep = 0;
  state.selectedQuestionIndex = 0;
  updateSessionPanel();
}

function showToast(message, variant = 'neutral') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast show`;
  if (variant === 'danger') {
    toast.style.background = 'rgba(251, 113, 133, 0.92)';
  } else {
    toast.style.background = 'rgba(9, 11, 23, 0.95)';
  }
  clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => {
    toast.className = 'toast';
  }, 2200);
}

function toggleAssistant() {
  const assistantPanel = $('#assistantPanel');
  state.assistantOpen = !state.assistantOpen;
  assistantPanel.style.display = state.assistantOpen ? 'grid' : 'none';
}

function appendAssistantMessage(role, text) {
  const log = $('#assistantLog');
  const message = createElement('div', { className: `assistant-message ${role}` });
  message.innerHTML = `<strong>${role === 'user' ? 'You' : 'AI Assistant'}</strong><p>${text}</p>`;
  log.appendChild(message);
  log.scrollTop = log.scrollHeight;
}

function resolveAssistantQuery(prompt) {
  const topic = getSelectedTopic();
  const base = topic ? `${topic.title}: ${topic.summary}` : 'Choose a course to ask about a concept.';
  if (!prompt.trim()) {
    return 'Ask me anything about the topic, quiz hints, or study shortcuts.';
  }
  if (prompt.toLowerCase().includes('explain')) {
    return `Here is a simple explanation: ${topic?.notes[0] ?? 'Start a session to see more content.'}`;
  }
  if (prompt.toLowerCase().includes('hint')) {
    return `Try focusing on keywords from the lesson. For example, ${topic?.flashcards[0].prompt ?? 'review the main concept.'}`;
  }
  if (prompt.toLowerCase().includes('summary')) {
    return state.liveSummary ? state.liveSummary : `Summary: ${topic?.summary ?? 'Select a topic to load its summary.'}`;
  }
  if (prompt.toLowerCase().includes('quiz')) {
    return 'I can help you with practice questions. Answer each card and I will give instant feedback.';
  }
  return state.liveSummary ? state.liveSummary : `Let’s explore the topic further: ${topic?.summary ?? 'Select a topic to begin.'}`;
}

function sendAssistantMessage() {
  const input = $('#assistantInput');
  const prompt = input.value.trim();
  if (!prompt) return;
  appendAssistantMessage('user', prompt);
  input.value = '';
  setAssistantStatus('Thinking...');

  setTimeout(() => {
    const response = resolveAssistantQuery(prompt);
    appendAssistantMessage('ai', response);
    setAssistantStatus('Ready for your next question');
  }, 600);
}

function bindEvents() {
  $('#topicSelect').addEventListener('change', (event) => {
    state.topicId = event.target.value;
    renderPreviewPanel();
    loadLiveSummary();
  });

  $('#difficultySelect').addEventListener('change', (event) => {
    state.difficulty = event.target.value;
    renderPreviewPanel();
  });

  $('#startSessionBtn').addEventListener('click', startSession);
  $('#resetSessionBtn').addEventListener('click', resetSession);
  $('#assistantOrb').addEventListener('click', toggleAssistant);
  $('#assistantSend').addEventListener('click', sendAssistantMessage);
}

function restoreProgressUI() {
  state.progressData = loadProgressData();
  renderDashboard();
}

function initPage() {
  elements.main = $('.main-content');

  renderCourseCards();
  renderTopicOptions();
  renderDifficultyOptions();
  restoreProgressUI();
  renderPreviewPanel();
  loadLiveSummary();
  bindEvents();
  updateSessionPanel();
  $('#assistantPanel').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', initPage);
