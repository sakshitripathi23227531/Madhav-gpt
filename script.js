const API = 'http://localhost:3001/api';
let currentLang = 'en';
let chatHistory = [];
let krishnaHistory = [];
let isRecording = false;
let recognition = null;
let currentVoiceText = '';
let speechSynth = window.speechSynthesis;

// ─── NAVIGATION ────────────────────────────────────────────────────────────

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(b => { if (b.textContent.toLowerCase().includes(id.substring(0,4))) b.classList.add('active'); });
  if (id === 'wisdom') loadDailyWisdom();
}

function setLang(lang, event = null) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (event) event.target.classList.add('active');
}

// ─── AI CHAT ───────────────────────────────────────────────────────────────

function handleChatKey(e, type) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (type === 'chat') sendChat();
    else sendKrishna();
  }
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  
  appendMessage('chat-messages', 'user', msg, '🙏');
  chatHistory.push({ role: 'user', content: msg });
  
  const loadId = appendLoading('chat-messages');
  document.getElementById('chat-send-btn').disabled = true;

  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: chatHistory.slice(-10), language: currentLang })
    });
    const data = await res.json();
    removeLoading(loadId);
    appendMessage('chat-messages', 'bot', data.reply, '🕉️');
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    removeLoading(loadId);
    appendMessage('chat-messages', 'bot', 'Connection error. Please ensure the backend server is running on port 3001.', '⚠️');
  }
  document.getElementById('chat-send-btn').disabled = false;
}

async function sendKrishna() {
  const input = document.getElementById('krishna-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  
  appendMessage('krishna-messages', 'user', msg, '🙏');
  krishnaHistory.push({ role: 'user', content: msg });
  
  const loadId = appendLoading('krishna-messages');
  document.getElementById('krishna-send-btn').disabled = true;

  try {
    const res = await fetch(`${API}/krishna`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, history: krishnaHistory.slice(-10) })
    });
    const data = await res.json();
    removeLoading(loadId);
    appendMessage('krishna-messages', 'bot', data.reply, '🦚');
    krishnaHistory.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    removeLoading(loadId);
    appendMessage('krishna-messages', 'bot', 'Connection error. Please ensure the backend server is running.', '⚠️');
  }
  document.getElementById('krishna-send-btn').disabled = false;
}

function appendMessage(containerId, role, text, avatar) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendLoading(containerId) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'loading-' + Date.now();
  div.innerHTML = `
    <div class="msg-avatar">🕉️</div>
    <div class="msg-bubble">
      <div class="loading-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div.id;
}

function removeLoading(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── SHLOKA FINDER ─────────────────────────────────────────────────────────

function quickSearch(topic) {
  document.getElementById('shloka-search').value = topic;
  findShlokas();
}

async function findShlokas() {
  const topic = document.getElementById('shloka-search').value.trim();
  if (!topic) return;
  
  const results = document.getElementById('shloka-results');
  results.innerHTML = '<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div>Searching the Gita...</div>';

  try {
    const res = await fetch(`${API}/shloka-finder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, language: currentLang })
    });
    const data = await res.json();
    
    results.innerHTML = data.shlokas.map(s => `
      <div class="shloka-card">
        <div class="shloka-ref">BHAGAVAD GITA ${s.chapter}.${s.verse}</div>
        <div class="shloka-sanskrit">${s.sanskrit}</div>
        <div class="shloka-transliteration">${s.transliteration}</div>
        <div class="shloka-translation">${currentLang === 'hi' ? s.translation_hi : s.translation_en}</div>
        <div class="shloka-explanation">💡 ${s.explanation}</div>
      </div>
    `).join('');
  } catch (err) {
    results.innerHTML = '<div class="card"><p>Error connecting to server. Please ensure the backend is running.</p></div>';
  }
}

// ─── DAILY WISDOM ──────────────────────────────────────────────────────────

let wisdomLoaded = false;

async function loadDailyWisdom() {
  const content = document.getElementById('wisdom-content');
  content.innerHTML = '<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div>Channeling today\'s wisdom...</div>';

  try {
    const res = await fetch(`${API}/daily-wisdom?language=${currentLang}`);
    const d = await res.json();
    
    const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    
    content.innerHTML = `
      <div class="wisdom-card">
        <div class="wisdom-theme">✦ ${d.theme} ✦</div>
        <div class="wisdom-ref">BHAGAVAD GITA ${d.chapter}.${d.verse} — ${today}</div>
        <div class="wisdom-sanskrit">${d.sanskrit}</div>
        <div style="color:var(--text-muted); font-style:italic; font-size:0.85rem; margin-bottom:1rem;">${d.transliteration || ''}</div>
        <div class="wisdom-translation">"${d.translation}"</div>
        <div class="wisdom-reflection">📿 ${d.reflection}</div>
        <div class="wisdom-affirmation">✨ "${d.affirmation}"</div>
      </div>
    `;
    wisdomLoaded = true;
  } catch (err) {
    content.innerHTML = '<div class="card"><p>Error loading wisdom. Please ensure the backend server is running on port 3001.</p></div>';
  }
}

function shareWisdom() {
  if (navigator.share) {
    navigator.share({ title: 'Daily Gita Wisdom', text: 'Check out today\'s Bhagavad Gita wisdom!', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}

// ─── LIFE GUIDANCE ─────────────────────────────────────────────────────────

function fillGuidance(text) {
  document.getElementById('guidance-input').value = text;
}

async function getGuidance() {
  const situation = document.getElementById('guidance-input').value.trim();
  if (!situation) return;
  
  const result = document.getElementById('guidance-result');
  result.innerHTML = '<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div>Seeking dharmic guidance...</div>';

  try {
    const res = await fetch(`${API}/guidance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation, language: currentLang })
    });
    const data = await res.json();
    result.innerHTML = `
      <div class="simulation-result">🧭 ${data.guidance.replace(/\n/g, '<br>')}</div>
    `;
  } catch (err) {
    result.innerHTML = '<div class="card"><p>Error connecting to server. Please ensure the backend is running.</p></div>';
  }
}

// ─── MOOD DHARMA ───────────────────────────────────────────────────────────

async function analyzeMood() {
  const message = document.getElementById('mood-input').value.trim();
  if (!message) return;
  
  const result = document.getElementById('mood-result');
  result.innerHTML = '<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div>Reading your emotional state...</div>';

  try {
    const res = await fetch(`${API}/mood-dharma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    
    result.innerHTML = `
      <div class="mood-result">
        <div class="mood-detected">
          <span class="mood-emoji">${data.mood_emoji}</span>
          <div>
            <div class="mood-label">${data.detected_mood}</div>
            <div class="mood-sublabel">Detected Emotional State</div>
          </div>
        </div>
        
        <div class="card">
          <h3>🕉️ Gita's Perspective on This State</h3>
          <p>${data.gita_perspective}</p>
        </div>
        
        <div class="card">
          <h3>📿 Dharmic Guidance for You</h3>
          <p>${data.guidance}</p>
          <ul class="steps-list" style="margin-top:1rem;">
            ${data.action_steps.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        
        <div class="shloka-card" style="margin-top:0;">
          <div class="shloka-ref">BHAGAVAD GITA ${data.shloka.chapter}.${data.shloka.verse}</div>
          <div class="shloka-sanskrit">${data.shloka.sanskrit}</div>
          <div class="shloka-translation">${data.shloka.translation}</div>
        </div>
        
        <div class="wisdom-affirmation" style="margin-top:0.5rem;">✨ "${data.affirmation}"</div>
      </div>
    `;
  } catch (err) {
    result.innerHTML = '<div class="card"><p>Error connecting to server. Please ensure the backend is running.</p></div>';
  }
}

// ─── LIFE SIMULATOR ────────────────────────────────────────────────────────

async function runSimulation() {
  const scenario = document.getElementById('simulator-input').value.trim();
  if (!scenario) return;
  
  const result = document.getElementById('simulator-result');
  result.innerHTML = '<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div>Simulating through the Gita\'s wisdom...</div>';

  try {
    const res = await fetch(`${API}/life-simulator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, language: currentLang })
    });
    const data = await res.json();
    result.innerHTML = `<div class="simulation-result">⚖️ ${data.simulation.replace(/\n/g, '<br>')}</div>`;
  } catch (err) {
    result.innerHTML = '<div class="card"><p>Error connecting to server. Please ensure the backend is running.</p></div>';
  }
}

// ─── VOICE GURU ────────────────────────────────────────────────────────────

function toggleVoiceRecording() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser. Please use Chrome or Edge, or type your question below.');
    return;
  }
  
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.interimResults = true;
  recognition.continuous = false;
  
  recognition.onstart = () => {
    isRecording = true;
    document.getElementById('voice-orb').classList.add('recording');
    document.getElementById('voice-orb-icon').textContent = '🔴';
    document.getElementById('voice-status').textContent = 'LISTENING... SPEAK NOW';
    document.getElementById('voice-transcript').style.display = 'block';
    document.getElementById('voice-transcript').textContent = '...';
  };
  
  recognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
    document.getElementById('voice-transcript').textContent = transcript;
    currentVoiceText = transcript;
  };
  
  recognition.onend = () => {
    stopRecording();
    if (currentVoiceText) processVoiceQuery(currentVoiceText);
  };
  
  recognition.onerror = (e) => {
    stopRecording();
    document.getElementById('voice-status').textContent = 'Error: ' + e.error + '. Please try again.';
  };
  
  recognition.start();
}

function stopRecording() {
  isRecording = false;
  if (recognition) recognition.stop();
  document.getElementById('voice-orb').classList.remove('recording');
  document.getElementById('voice-orb-icon').textContent = '🎙️';
  document.getElementById('voice-status').textContent = 'TAP TO SPEAK YOUR QUESTION';
}

async function processVoiceQuery(transcript) {
  document.getElementById('voice-status').textContent = 'PROCESSING YOUR QUESTION...';
  document.getElementById('voice-response-area').style.display = 'none';
  
  try {
    const res = await fetch(`${API}/voice-guru`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language: currentLang })
    });
    const data = await res.json();
    
    document.getElementById('voice-response').innerHTML = data.response.replace(/\n/g, '<br>');
    document.getElementById('voice-response-area').style.display = 'block';
    document.getElementById('voice-status').textContent = 'WISDOM RECEIVED — TAP TO ASK AGAIN';
    currentVoiceText = data.response;
    
    // Auto-play response
    speakText(data.response);
  } catch (err) {
    document.getElementById('voice-status').textContent = 'Error connecting to server.';
  }
}

async function sendTextToVoiceGuru() {
  const input = document.getElementById('voice-text-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('voice-transcript').style.display = 'block';
  document.getElementById('voice-transcript').textContent = text;
  await processVoiceQuery(text);
}

function speakText(text) {
  if (!speechSynth) return;
  speechSynth.cancel();
  const clean = text.replace(/<[^>]*>/g, '').replace(/BG \d+\.\d+/g, '');
  const utter = new SpeechSynthesisUtterance(clean);
  utter.rate = 0.85;
  utter.pitch = 0.9;
  utter.volume = 1;
  if (currentLang === 'hi') utter.lang = 'hi-IN';
  else utter.lang = 'en-IN';
  speechSynth.speak(utter);
}

function playVoiceResponse() {
  const text = document.getElementById('voice-response').innerText;
  speakText(text);
}

// ─── INIT ──────────────────────────────────────────────────────────────────

// Auto-expand textareas
document.querySelectorAll('textarea').forEach(ta => {
  ta.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
  });
});
