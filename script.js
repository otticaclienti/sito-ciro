// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  const isOpen = nav.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on nav link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// Contact form → Google Sheet
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyhyWU53-LEXVcmF8Yoh_F-9KzmxCXjSk_4sziHKH6Z4WJwBmV7iUNagMXEaxLjnzONJw/exec';

const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validazione
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#e63946';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  if (!valid) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Invio in corso...';

  const payload = {
    nome:      form.nome.value.trim(),
    azienda:   form.azienda.value.trim(),
    email:     form.email.value.trim(),
    telefono:  form.telefono.value.trim(),
    interesse: form.interesse.value,
    messaggio: form.messaggio.value.trim()
  };

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    form.reset();
    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 6000);
  } catch (err) {
    alert('Errore di rete. Riprova o contattaci direttamente per email.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Invia Richiesta';
  }
});

// Scroll reveal — product cards con entrata sfalsata
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.product-card').forEach((card, i) => {
  // Alterna: pari da sinistra, dispari da destra, centrale dal basso
  const col = i % 3;
  if (col === 0) card.classList.add('anim-left');
  else if (col === 2) card.classList.add('anim-right');
  else card.classList.add('anim-up');
  card.style.setProperty('--delay', `${i * 100}ms`);
  cardObserver.observe(card);
});

// Scroll reveal generico per service-item e testimonial
const genericObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-visible');
      genericObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-item, .testimonial').forEach((el, i) => {
  el.classList.add('anim-up');
  el.style.setProperty('--delay', `${i * 80}ms`);
  genericObserver.observe(el);
});

// Counter animato per le statistiche hero
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat strong').forEach(el => {
        const val = parseInt(el.textContent);
        if (!isNaN(val)) animateCounter(el, val);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
