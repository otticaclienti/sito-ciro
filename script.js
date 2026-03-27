// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

// CURSOR
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  }, 80);
});
document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursor.style.background = 'transparent'; cursor.style.border = '1px solid var(--cyan)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--cyan)'; cursor.style.border = 'none'; });
});

// HEADER
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// MOBILE MENU
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// PARTICLE CANVAS
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 120)})`;
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

// TYPEWRITER
const words = ['FERRO', 'ACCIAIO', 'METALLO', 'PRECISIONE'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function typeLoop() {
  const word = words[wi];
  if (!deleting) {
    tw.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    tw.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// COUNTERS
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count').forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.nextSibling?.textContent || '';
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    countObs.unobserve(entry.target);
  });
}, { threshold: 0.6 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) countObs.observe(heroStats);

// PRODUCT CARDS REVEAL with stagger
const cardObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const i = +entry.target.dataset.index;
    setTimeout(() => entry.target.classList.add('visible'), i * 120);
    cardObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.product-card').forEach(c => cardObs.observe(c));

// GENERIC REVEAL
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('visible'), 80 * i);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-item').forEach(el => revealObs.observe(el));

// SKILL BARS
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    skillObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });
const skillsEl = document.querySelector('.about-skills');
if (skillsEl) skillObs.observe(skillsEl);

// CONTACT FORM → Google Sheet
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyhyWU53-LEXVcmF8Yoh_F-9KzmxCXjSk_4sziHKH6Z4WJwBmV7iUNagMXEaxLjnzONJw/exec';
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(f => { if (!f.value.trim() && f.type !== 'checkbox' || f.type === 'checkbox' && !f.checked) { f.style.outline = '1px solid #ff3b5c'; valid = false; } else { f.style.outline = ''; } });
  if (!valid) return;
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('.submit-text').textContent = 'Invio in corso...';
  const payload = { nome: form.nome.value.trim(), azienda: form.azienda.value.trim(), email: form.email.value.trim(), telefono: form.telefono.value.trim(), interesse: form.interesse.value, messaggio: form.messaggio.value.trim() };
  try {
    await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    form.reset();
    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 6000);
  } catch {
    alert('Errore di rete. Riprova o contattaci direttamente.');
  } finally {
    btn.disabled = false;
    btn.querySelector('.submit-text').textContent = 'Invia Richiesta';
  }
});
