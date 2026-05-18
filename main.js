/* ================================================================
   NexoSites — main.js  (loaded on every page)
   ================================================================ */

/* ── LOADER ────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (!l) return;
  setTimeout(() => {
    l.classList.add('out');
    l.addEventListener('transitionend', () => l.remove(), { once: true });
  }, 1700);
});

/* ── NAVBAR SCROLL ─────────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ── MOBILE DRAWER ─────────────────────────────────────────────── */
const ham    = document.querySelector('.hamburger');
const drawer = document.querySelector('.mobile-drawer');
if (ham && drawer) {
  ham.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    ham.setAttribute('aria-expanded', open);
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── ACTIVE NAV LINK ───────────────────────────────────────────── */
(() => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page) a.classList.add('active');
  });
})();

/* ── SCROLL REVEAL ─────────────────────────────────────────────── */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── BACK TO TOP ───────────────────────────────────────────────── */
const btt = document.getElementById('back-top');
if (btt) {
  window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── FOOTER YEAR ───────────────────────────────────────────────── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ── PARTICLES ─────────────────────────────────────────────────── */
function spawnParticles(containerId, count = 28) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const colors = ['#2563eb','#06d6f5','#7c3aed','#3b82f6'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      background: colors[i % colors.length],
      borderRadius: '50%',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: 0,
      animation: `particleFloat ${Math.random()*14+10}s linear ${Math.random()*8}s infinite`,
      pointerEvents: 'none',
    });
    c.appendChild(p);
  }
}

/* Inject the particle keyframe once */
if (!document.getElementById('particle-style')) {
  const s = document.createElement('style');
  s.id = 'particle-style';
  s.textContent = `
    @keyframes particleFloat {
      0%   { transform: translateY(0) scale(1);   opacity: 0; }
      10%  { opacity: .5; }
      90%  { opacity: .15; }
      100% { transform: translateY(-120px) scale(0); opacity: 0; }
    }
    .particle { position: absolute; border-radius: 50%; pointer-events: none; }
  `;
  document.head.appendChild(s);
}
 