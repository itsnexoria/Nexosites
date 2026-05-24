/* ================================================================
   NexoSites — main.js  (lean, optimised — no lag)
   ================================================================ */

/* ── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  if (!l) return;
  setTimeout(() => {
    l.classList.add('out');
    setTimeout(() => l.remove(), 600);
  }, 1400);
});

/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── ACTIVE NAV LINK ────────────────────────────────────────── */
(() => {
  const path = location.pathname.replace(/\/$/, ''); // strip trailing slash
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '');
    if (!href) return;
    // Match by segment: e.g. href="pages/services/" matches pathname ending in /pages/services
    if (path.endsWith(href.replace(/^\.\.\/|^\.\//g, ''))) {
      a.classList.add('active');
    }
  });
})();

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ── 3D TILT (only on non-touch, non-mobile) ────────────────── */
if (window.matchMedia('(hover:hover) and (min-width:768px)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
      card.style.boxShadow = `${-x*20}px ${y*20}px 50px rgba(124,58,237,.3)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ── BACK TO TOP ────────────────────────────────────────────── */
const btt = document.getElementById('back-top');
if (btt) {
  window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── FOOTER YEAR ────────────────────────────────────────────── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
