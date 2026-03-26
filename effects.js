/* ===== BUGEMA UNIVERSITY - WOW EFFECTS ===== */

//  1. PARTICLE CANVAS BACKGROUND 
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2 + 0.5;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,150,12,${this.alpha})`;
      ctx.fill();
    }
    update() {
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connecting lines between nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,150,12,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
}

//  2. TYPEWRITER EFFECT 
function typeWriter(elementId, texts, speed = 80) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let textIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = texts[textIndex];
    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? speed / 2 : speed);
  }
  type();
}

//  3. SCROLL REVEAL 
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

//  4. COUNTER ANIMATION 
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}

//  5. BACK TO TOP BUTTON 
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:999;
    width:46px; height:46px; border-radius:50%; border:none;
    background:linear-gradient(135deg,#003366,#004488);
    color:#C8960C; font-size:1.3em; font-weight:800;
    cursor:pointer; box-shadow:0 4px 20px rgba(0,51,102,0.4);
    opacity:0; transform:translateY(20px);
    transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
    display:flex; align-items:center; justify-content:center;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1'; btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0'; btn.style.transform = 'translateY(20px)';
    }
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => { btn.style.background = 'linear-gradient(135deg,#C8960C,#E8B020)'; btn.style.color = '#003366'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = 'linear-gradient(135deg,#003366,#004488)'; btn.style.color = '#C8960C'; });
}

//  6. NAVBAR SCROLL EFFECT 
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      nav.style.borderBottomWidth = '4px';
    } else {
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      nav.style.borderBottomWidth = '3px';
    }
  });
}

//  7. CARD TILT EFFECT 
function initTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

//  8. GLOWING CURSOR TRAIL 
function initCursorTrail() {
  const trail = [];
  const count = 8;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:${6 + i * 2}px; height:${6 + i * 2}px;
      border-radius:50%;
      background:rgba(200,150,12,${0.6 - i * 0.07});
      transform:translate(-50%,-50%);
      transition:transform 0.1s ease;
      mix-blend-mode:screen;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateTrail() {
    let px = mx, py = my;
    trail.forEach((t, i) => {
      t.x += (px - t.x) * (0.3 - i * 0.02);
      t.y += (py - t.y) * (0.3 - i * 0.02);
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      px = t.x; py = t.y;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

//  9. PAGE LOAD SPLASH 
function initSplash() {
  const splash = document.createElement('div');
  splash.style.cssText = `
    position:fixed; inset:0; z-index:99999;
    background:linear-gradient(135deg,#002244,#003366);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    transition:opacity 0.6s ease, transform 0.6s ease;
  `;
  splash.innerHTML = `
    <img src="badge.png" alt="Bugema University" style="width:90px;height:90px;object-fit:contain;border-radius:50%;border:3px solid #C8960C;background:white;padding:8px;animation:spin 1s ease forwards;box-shadow:0 0 40px rgba(200,150,12,0.4);">
    <div style="color:#C8960C;font-size:1.3em;font-weight:800;margin-top:20px;font-family:Inter,sans-serif;letter-spacing:1px;">Bugema University</div>
    <div style="color:rgba(255,255,255,0.6);font-size:0.85em;margin-top:6px;font-family:Inter,sans-serif;">Department of Computing and Informatics</div>
    <div style="margin-top:24px;display:flex;gap:8px;">
      <div class="splash-dot"></div><div class="splash-dot" style="animation-delay:0.2s"></div><div class="splash-dot" style="animation-delay:0.4s"></div>
    </div>
    <style>
      @keyframes spin { from{transform:rotate(-10deg) scale(0.8)} to{transform:rotate(0) scale(1)} }
      .splash-dot { width:8px;height:8px;border-radius:50%;background:#C8960C;animation:bounce 0.8s ease-in-out infinite alternate; }
      @keyframes bounce { from{transform:translateY(0);opacity:0.4} to{transform:translateY(-10px);opacity:1} }
    </style>
  `;
  document.body.appendChild(splash);

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.05)';
      setTimeout(() => splash.remove(), 600);
    }, 1200);
  });
}

//  INIT ALL 
document.addEventListener('DOMContentLoaded', () => {
  initParticles('hero-canvas');
  initScrollReveal();
  initCounters();
  initBackToTop();
  initNavScroll();
  initTilt();
  initCursorTrail();

  typeWriter('typewriter', [
    'Empowering Technology Leaders',
    'Excellence in Computing Education',
    'Innovation. Integrity. Impact.',
    'Shaping Uganda\'s Digital Future'
  ]);
});

initSplash();
