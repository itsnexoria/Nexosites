/* nav-footer.js — injects shared nav HTML and footer HTML on every page */

/* ── Determine root path (are we in /pages/ subfolder?) ────────── */
const ROOT = (() => {
  const p = location.pathname;
  return p.includes('/pages/') ? '../' : './';
})();

/* ── NAV ───────────────────────────────────────────────────────── */
document.getElementById('nav-placeholder').innerHTML = `
<nav class="navbar" id="navbar" role="navigation" aria-label="Main">
  <div class="nav-inner">
    <a href="${ROOT}index.html" class="nav-brand">
      <div class="nav-brand-mark">N</div>
      NEXO<span style="color:var(--cyan)">SITES</span>
    </a>
    <ul class="nav-links">
      <li><a href="${ROOT}index.html"           class="nav-link">Home</a></li>
      <li><a href="${ROOT}pages/about.html"     class="nav-link">About</a></li>
      <li><a href="${ROOT}pages/services.html"  class="nav-link">Services</a></li>
      <li><a href="${ROOT}pages/pricing.html"   class="nav-link">Pricing</a></li>
      <li><a href="${ROOT}pages/portfolio.html" class="nav-link">Portfolio</a></li>
      <li><a href="${ROOT}pages/faq.html"       class="nav-link">FAQ</a></li>
      <li><a href="${ROOT}pages/contact.html"   class="nav-link nav-cta">Contact Us</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mobile-drawer" id="mobile-drawer" role="dialog" aria-label="Mobile navigation">
  <a href="${ROOT}index.html"           class="nav-link">Home</a>
  <a href="${ROOT}pages/about.html"     class="nav-link">About</a>
  <a href="${ROOT}pages/services.html"  class="nav-link">Services</a>
  <a href="${ROOT}pages/pricing.html"   class="nav-link">Pricing</a>
  <a href="${ROOT}pages/portfolio.html" class="nav-link">Portfolio</a>
  <a href="${ROOT}pages/faq.html"       class="nav-link">FAQ</a>
  <a href="${ROOT}pages/contact.html"   class="nav-link nav-cta btn">Contact Us</a>
</div>`;

/* ── FOOTER ────────────────────────────────────────────────────── */
document.getElementById('footer-placeholder').innerHTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${ROOT}index.html" class="nav-brand" style="margin-bottom:.25rem">
          <div class="nav-brand-mark">N</div>
          NEXO<span style="color:var(--cyan)">SITES</span>
        </a>
        <p class="footer-brand-desc">Premium web development for businesses across South Africa. You buy the domain — we handle everything else.</p>
        <div class="footer-socials">
          <a href="#" class="social-btn" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://wa.me/27816137187" class="social-btn" aria-label="WhatsApp" target="_blank"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Pages</h5>
        <ul>
          <li><a href="${ROOT}index.html">Home</a></li>
          <li><a href="${ROOT}pages/about.html">About</a></li>
          <li><a href="${ROOT}pages/services.html">Services</a></li>
          <li><a href="${ROOT}pages/pricing.html">Pricing</a></li>
          <li><a href="${ROOT}pages/portfolio.html">Portfolio</a></li>
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
        <div class="footer-contact-item"><i class="fab fa-whatsapp"></i><a href="https://wa.me/27816137187" target="_blank">WhatsApp Us</a></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="yr"></span> NexoSites. All rights reserved.</span>
      <span>Made with <i class="fas fa-heart" style="color:#ef4444"></i> in South Africa</span>
    </div>
  </div>
</footer>`;

/* ── WA + BACK TO TOP ──────────────────────────────────────────── */
document.body.insertAdjacentHTML('beforeend', `
  <a href="https://wa.me/27816137187?text=Hi%20NexoSites!%20I%27d%20like%20a%20website%20for%20my%20business." class="wa-btn" target="_blank" rel="noopener" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i><span>Chat with us</span>
  </a>
  <button id="back-top" aria-label="Back to top"><i class="fas fa-chevron-up"></i></button>
`);
