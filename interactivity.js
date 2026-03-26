/* ===== JAVASCRIPT INTERACTIVITY - Task Requirements ===== */

//  1. ALERT ON BUTTON CLICK 
function initButtonAlerts() {
  // Apply to all .btn elements that are not form submits or links to other pages
  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const msg = this.getAttribute('data-alert') || 'Thank you for your interest in Bugema University!';
      showToast(msg, 'info');
    });
  });
}

//  2. TOAST NOTIFICATION (replaces plain alert) 
function showToast(message, type = 'info') {
  const existing = document.getElementById('bu-toast');
  if (existing) existing.remove();

  const colors = {
    info:    { bg: '#003366', border: '#C8960C', icon: '' },
    success: { bg: '#1a5c2a', border: '#43e97b', icon: '' },
    error:   { bg: '#7a1a1a', border: '#f5576c', icon: '' },
    warning: { bg: '#7a5a00', border: '#C8960C', icon: '' }
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.id = 'bu-toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position:fixed; bottom:80px; right:28px; z-index:9999;
    background:${c.bg}; border-left:4px solid ${c.border};
    color:white; padding:14px 20px; border-radius:10px;
    box-shadow:0 8px 32px rgba(0,0,0,0.3);
    font-family:Inter,sans-serif; font-size:0.92em;
    max-width:320px; display:flex; align-items:center; gap:10px;
    animation:slideInToast 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
  `;
  toast.innerHTML = `
    <style>
      @keyframes slideInToast { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      @keyframes slideOutToast { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)} }
    </style>
    <span style="font-size:1.3em;">${c.icon}</span>
    <span style="flex:1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1.1em;padding:0 0 0 8px;"></button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOutToast 0.4s ease forwards';
      setTimeout(() => toast.remove(), 400);
    }
  }, 4000);
}

//  3. FORM VALIDATION 
function validateField(input) {
  const val = input.value.trim();
  const name = input.name || input.id;
  let error = '';

  if (input.required && !val) {
    error = 'This field is required.';
  } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    error = 'Please enter a valid email address.';
  } else if (input.type === 'tel' && val && !/^\+?[\d\s\-]{7,15}$/.test(val)) {
    error = 'Please enter a valid phone number.';
  } else if (input.type === 'number' && val) {
    const min = parseInt(input.min), max = parseInt(input.max);
    if (min && parseInt(val) < min) error = `Minimum value is ${min}.`;
    if (max && parseInt(val) > max) error = `Maximum value is ${max}.`;
  }

  showFieldError(input, error);
  return !error;
}

function showFieldError(input, message) {
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
  input.style.borderColor = message ? '#f5576c' : '';
  input.style.boxShadow = message ? '0 0 0 3px rgba(245,87,108,0.15)' : '';
  if (message) {
    const err = document.createElement('div');
    err.className = 'field-error';
    err.style.cssText = 'color:#c0392b;font-size:0.78em;margin-top:4px;display:flex;align-items:center;gap:4px;';
    err.innerHTML = `<span></span> ${message}`;
    input.parentElement.appendChild(err);
  } else if (input.value.trim()) {
    input.style.borderColor = '#43e97b';
    input.style.boxShadow = '0 0 0 3px rgba(67,233,123,0.15)';
  }
}

function initLiveValidation() {
  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.querySelector('.field-error')) validateField(input);
    });
  });
}

//  4. DYNAMIC TEXT CHANGES 
function initDynamicText() {
  // Live clock in top bar
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Dynamic greeting based on time of day
  const greetEl = document.getElementById('dynamic-greeting');
  if (greetEl) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    greetEl.textContent = greeting + ', Welcome to Bugema University';
  }

  // Character counter for textareas
  document.querySelectorAll('textarea[maxlength]').forEach(ta => {
    const counter = document.createElement('div');
    counter.style.cssText = 'font-size:0.75em;color:var(--text-light);text-align:right;margin-top:4px;';
    counter.textContent = `0 / ${ta.maxlength}`;
    ta.parentElement.appendChild(counter);
    ta.addEventListener('input', () => {
      counter.textContent = `${ta.value.length} / ${ta.maxlength}`;
      counter.style.color = ta.value.length > ta.maxlength * 0.9 ? '#f5576c' : 'var(--text-light)';
    });
  });
}

//  5. FETCH API DATA 
async function fetchUniversityNews() {
  const container = document.getElementById('api-news');
  if (!container) return;

  container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px;">Loading latest tech news...</p>';

  try {
    // Using a free public API - no key needed
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await res.json();
    const top5 = ids.slice(0, 5);

    const stories = await Promise.all(
      top5.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()))
    );

    container.innerHTML = stories.map(s => `
      <a href="${s.url || '#'}" target="_blank" rel="noopener noreferrer" class="resource-card" style="margin-bottom:10px;">
        <div class="resource-icon" style="background:linear-gradient(135deg,#003366,#004488);"></div>
        <div>
          <h4>${s.title}</h4>
          <p>By ${s.by || 'Unknown'} &nbsp;|&nbsp; Score: ${s.score || 0} &nbsp;|&nbsp; ${new Date(s.time * 1000).toLocaleDateString()}</p>
        </div>
        <span style="margin-left:auto;color:var(--text-light);"></span>
      </a>
    `).join('');

    showToast('Tech news loaded successfully!', 'success');
  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;color:var(--text-light);">
        <div style="font-size:2em;margin-bottom:10px;"></div>
        <p>Could not load live data. Check your internet connection.</p>
      </div>`;
  }
}

//  EXPORT GLOBALS 
window.showToast = showToast;
window.fetchUniversityNews = fetchUniversityNews;

document.addEventListener('DOMContentLoaded', () => {
  initButtonAlerts();
  initLiveValidation();
  initDynamicText();
});
