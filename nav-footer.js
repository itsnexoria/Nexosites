/* ================================================================
   nav-footer.js — NexoSites
   ================================================================ */

const ROOT = (() => {
  return location.pathname.includes('/pages/') ? '../' : './';
})();

/* ── NAV ──────────────────────────────────────────────────────── */
document.getElementById('nav-placeholder').innerHTML = `
<nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="${ROOT}index.html" class="nav-brand" aria-label="NexoSites Home">
      <div class="nav-brand-mark">N</div>
      NEXO<span style="color:var(--cyan)">SITES</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="${ROOT}index.html"           class="nav-link">Home</a></li>
      <li><a href="${ROOT}pages/services.html"  class="nav-link">Services</a></li>
      <li><a href="${ROOT}pages/portfolio.html" class="nav-link">Portfolio</a></li>
      <li><a href="${ROOT}pages/pricing.html"   class="nav-link">Pricing</a></li>
      <li><a href="${ROOT}pages/about.html"     class="nav-link">About</a></li>
      <li><a href="${ROOT}pages/faq.html"       class="nav-link">FAQ</a></li>
      <li><a href="${ROOT}pages/contact.html"   class="nav-link nav-cta">Get Started</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
    </button>
  </div>
</nav>

<div class="mob-menu" id="mob-menu" role="dialog" aria-modal="true" aria-label="Navigation" inert>
  <div class="mob-top">
    <a href="${ROOT}index.html" class="nav-brand mob-brand">
      <div class="nav-brand-mark">N</div>
      NEXO<span style="color:var(--cyan)">SITES</span>
    </a>
    <button class="mob-close" id="mob-close" aria-label="Close menu">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <nav class="mob-nav" aria-label="Mobile navigation">
    <a href="${ROOT}index.html"           class="mob-link"><span class="mob-num">01</span><span class="mob-label">Home</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="${ROOT}pages/services.html"  class="mob-link"><span class="mob-num">02</span><span class="mob-label">Services</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="${ROOT}pages/portfolio.html" class="mob-link"><span class="mob-num">03</span><span class="mob-label">Portfolio</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="${ROOT}pages/pricing.html"   class="mob-link"><span class="mob-num">04</span><span class="mob-label">Pricing</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="${ROOT}pages/about.html"     class="mob-link"><span class="mob-num">05</span><span class="mob-label">About</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="${ROOT}pages/faq.html"       class="mob-link"><span class="mob-num">06</span><span class="mob-label">FAQ</span><i class="fas fa-arrow-right mob-arrow"></i></a>
  </nav>
  <div class="mob-footer">
    <a href="${ROOT}pages/contact.html" class="btn btn-primary mob-cta">
      <i class="fas fa-rocket"></i> Get Started
    </a>
    <div class="mob-contacts">
      <a href="mailto:griesel050@gmail.com"><i class="fas fa-envelope"></i> griesel050@gmail.com</a>
      <a href="https://wa.me/27816137187" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp Us</a>
    </div>
  </div>
  <div class="mob-orb" aria-hidden="true"></div>
</div>
<div class="mob-backdrop" id="mob-backdrop"></div>
`;

/* ── FOOTER ───────────────────────────────────────────────────── */
document.getElementById('footer-placeholder').innerHTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${ROOT}index.html" class="nav-brand">
          <div class="nav-brand-mark">N</div>
          NEXO<span style="color:var(--cyan)">SITES</span>
        </a>
        <p class="footer-brand-desc">Professional websites for businesses worldwide. Custom design, fast delivery, and ongoing support. You buy the domain — we handle everything else.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://wa.me/27816137187" class="social-btn" aria-label="WhatsApp" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Navigation</h5>
        <ul>
          <li><a href="${ROOT}index.html">Home</a></li>
          <li><a href="${ROOT}pages/services.html">Services</a></li>
          <li><a href="${ROOT}pages/portfolio.html">Portfolio</a></li>
          <li><a href="${ROOT}pages/pricing.html">Pricing</a></li>
          <li><a href="${ROOT}pages/about.html">About</a></li>
          <li><a href="${ROOT}pages/faq.html">FAQ</a></li>
          <li><a href="${ROOT}pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Services</h5>
        <ul>
          <li><a href="${ROOT}pages/services.html">Business Websites</a></li>
          <li><a href="${ROOT}pages/services.html">Portfolio Sites</a></li>
          <li><a href="${ROOT}pages/services.html">Landing Pages</a></li>
          <li><a href="${ROOT}pages/services.html">Updates &amp; Changes</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Contact</h5>
        <div class="footer-contact-item"><i class="fas fa-envelope"></i><a href="mailto:griesel050@gmail.com">griesel050@gmail.com</a></div>
        <div class="footer-contact-item"><i class="fas fa-phone"></i><a href="tel:+27816137187">+27 81 613 7187</a></div>
        <div class="footer-contact-item"><i class="fab fa-whatsapp"></i><a href="https://wa.me/27816137187" target="_blank" rel="noopener">WhatsApp Us</a></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="yr"></span> NexoSites. All rights reserved.</span>
      <span>Serving clients <strong style="color:var(--cyan)">worldwide</strong> 🌍</span>
    </div>
  </div>
</footer>`;

/* ── FLOATING BUTTONS ─────────────────────────────────────────── */
document.body.insertAdjacentHTML('beforeend', `
  <a href="https://wa.me/27816137187?text=Hi%20NexoSites!%20I%27d%20like%20a%20website%20for%20my%20business."
     class="wa-btn" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i><span>Chat with us</span>
  </a>
  <button id="back-top" aria-label="Back to top"><i class="fas fa-chevron-up"></i></button>
`);

/* ── MOBILE MENU LOGIC ────────────────────────────────────────── */
(function () {
  const ham      = document.getElementById('hamburger');
  const menu     = document.getElementById('mob-menu');
  const closeBtn = document.getElementById('mob-close');
  const backdrop = document.getElementById('mob-backdrop');
  if (!ham || !menu) return;

  const links = menu.querySelectorAll('.mob-link');

  function open() {
    menu.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    ham.setAttribute('aria-expanded', 'true');
    ham.classList.add('open');
    menu.removeAttribute('inert');
    links.forEach((l, i) => {
      l.style.transitionDelay = (0.06 + i * 0.055) + 's';
      requestAnimationFrame(() => requestAnimationFrame(() => l.classList.add('in')));
    });
    setTimeout(() => { const f = menu.querySelector('.mob-close'); if (f) f.focus(); }, 120);
  }

  function close() {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    ham.setAttribute('aria-expanded', 'false');
    ham.classList.remove('open');
    menu.setAttribute('inert', '');
    links.forEach(l => { l.classList.remove('in'); l.style.transitionDelay = '0s'; });
    ham.focus();
  }

  ham.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  menu.querySelectorAll('.mob-link, .mob-cta').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) close(); });

  /* Focus trap */
  menu.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
