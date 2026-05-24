/* ═══════════════════════════════════════════════════════════════
   portfolio.js — filter + animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Category filter ──────────────────────────────────────── */
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.port-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state + aria-pressed
      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.f;

      cards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('hidden');
          // Stagger re-entrance
          card.style.animationDelay = `${i * 0.08}s`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── Keyboard nav for filter buttons ─────────────────────── */
  btns.forEach((btn, i) => {
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        btns[(i + 1) % btns.length].focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        btns[(i - 1 + btns.length) % btns.length].focus();
      }
    });
  });

})();
