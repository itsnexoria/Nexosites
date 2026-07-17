/* ================================================================
   nav-footer.js — NexoSites
   ================================================================ */

/* ── NAV ──────────────────────────────────────────────────────── */
document.getElementById('nav-placeholder').innerHTML = `
<nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="NexoSites Home">
      <img src="/assets/icons/logo.png" alt="NexoSites Logo" class="nav-brand-img"/>
      NEXO<span style="color:var(--purple-l)">SITES</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="/"                    class="nav-link">Home</a></li>
      <li><a href="/pages/services/"     class="nav-link">Services</a></li>
      <li><a href="/pages/portfolio/"    class="nav-link">Portfolio</a></li>
      <li><a href="/pages/pricing/"      class="nav-link">Pricing</a></li>
      <li><a href="/pages/about/"        class="nav-link">About</a></li>
      <li><a href="/pages/faq/"          class="nav-link">FAQ</a></li>
      <li id="nav-auth-slot"><a href="/pages/quote/" class="nav-link nav-cta">Get a Quote</a></li>
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
    <a href="/" class="nav-brand mob-brand">
      <img src="/assets/icons/logo.png" alt="NexoSites Logo" class="nav-brand-img"/>
      NEXO<span style="color:var(--purple-l)">SITES</span>
    </a>
    <button class="mob-close" id="mob-close" aria-label="Close menu">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <nav class="mob-nav" aria-label="Mobile navigation">
    <a href="/"                 class="mob-link"><span class="mob-num">01</span><span class="mob-label">Home</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/services/"  class="mob-link"><span class="mob-num">02</span><span class="mob-label">Services</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/portfolio/" class="mob-link"><span class="mob-num">03</span><span class="mob-label">Portfolio</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/pricing/"   class="mob-link"><span class="mob-num">04</span><span class="mob-label">Pricing</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/about/"     class="mob-link"><span class="mob-num">05</span><span class="mob-label">About</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/faq/"       class="mob-link"><span class="mob-num">06</span><span class="mob-label">FAQ</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/login/"     class="mob-link" id="mob-auth-link"><span class="mob-num">07</span><span class="mob-label" id="mob-auth-label">Login</span><i class="fas fa-arrow-right mob-arrow"></i></a>
  </nav>
  <div class="mob-footer">
    <a href="/pages/quote/" class="btn btn-primary mob-cta" id="mob-auth-cta">
      <i class="fas fa-rocket"></i> Get a Quote
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
        <a href="/" class="nav-brand">
          <img src="/assets/icons/logo.png" alt="NexoSites Logo" class="nav-brand-img"/>
          NEXO<span style="color:var(--purple-l)">SITES</span>
        </a>
        <p class="footer-brand-desc">Professional websites for businesses worldwide. Custom design, fast delivery, and ongoing support. You buy the domain — we handle everything else.</p>
        <div class="footer-socials">
          <a href="https://discord.gg/fFQfgK3gqQ" class="social-btn" aria-label="Discord"><i class="fab fa-discord"></i></a>
          <a href="https://www.instagram.com/nxrealm08/" class="social-btn" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.linkedin.com/in/NexoSites/" class="social-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="https://wa.me/27816137187" class="social-btn" aria-label="WhatsApp" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Navigation</h5>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/pages/services/">Services</a></li>
          <li><a href="/pages/portfolio/">Portfolio</a></li>
          <li><a href="/pages/pricing/">Pricing</a></li>
          <li><a href="/pages/about/">About</a></li>
          <li><a href="/pages/faq/">FAQ</a></li>
          <li><a href="/pages/contact/">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Services</h5>
        <ul>
          <li><a href="/pages/services/">Business Websites</a></li>
          <li><a href="/pages/services/">Portfolio Sites</a></li>
          <li><a href="/pages/services/">Landing Pages</a></li>
          <li><a href="/pages/services/">Updates &amp; Changes</a></li>
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
      <span>Serving clients <strong style="color:var(--purple-l)">worldwide</strong> 🌍</span>
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

/* ── AUTH-AWARE NAV ───────────────────────────────────────────── */
(async function () {
  if (!window.sb || !window.Auth) return; // supabase-client.js / auth.js not loaded on this page

  const slot        = document.getElementById('nav-auth-slot');
  const mobLink      = document.getElementById('mob-auth-link');
  const mobLabel     = document.getElementById('mob-auth-label');
  const mobCta       = document.getElementById('mob-auth-cta');

  function renderLoggedOut() {
    if (slot)      slot.innerHTML = '<a href="/pages/login/" class="nav-link">Login</a>';
    if (mobLink)    mobLink.href = '/pages/login/';
    if (mobLabel)   mobLabel.textContent = 'Login';
  }

  function renderLoggedIn(profile) {
    const isAdmin = profile && profile.role === 'admin';
    const dashHref = isAdmin ? '/pages/admin/' : '/pages/dashboard/';
    const dashLabel = isAdmin ? 'Admin' : 'Dashboard';
    if (slot) {
      slot.innerHTML = `
        <div class="nav-account" style="display:flex;align-items:center;gap:1rem">
          <a href="${dashHref}" class="nav-link">${dashLabel}</a>
          <a href="/pages/messages/" class="nav-link" style="position:relative">
            Messages<span id="nav-unread-badge" style="display:none"></span>
          </a>
          <button id="nav-logout-btn" class="nav-link nav-cta" style="padding:.5em 1.2em">Log Out</button>
        </div>`;
      document.getElementById('nav-logout-btn')?.addEventListener('click', () => Auth.signOut());
    }
    if (mobLink)  mobLink.href = dashHref;
    if (mobLabel) mobLabel.textContent = dashLabel;
    if (mobCta) {
      mobCta.href = '/pages/messages/';
      mobCta.innerHTML = '<i class="fas fa-comments"></i> Messages';
    }
  }

  async function refreshUnreadBadge(profile) {
    const isAdmin = profile.role === 'admin';
    const col = isAdmin ? 'read_by_admin' : 'read_by_customer';
    let query = window.sb.from('messages').select('id', { count: 'exact', head: true }).eq(col, false);
    if (!isAdmin) {
      query = query.eq('customer_id', profile.id).neq('sender_id', profile.id);
    } else {
      query = query.neq('sender_id', profile.id);
    }
    const { count } = await query;
    const badge = document.getElementById('nav-unread-badge');
    if (badge && count) {
      badge.textContent = count > 9 ? '9+' : String(count);
      badge.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 4px;margin-left:5px;background:var(--pink);color:#fff;font-size:.65rem;border-radius:99px;font-family:var(--ff-m)';
    }
  }

  try {
    const session = await Auth.getSession();
    if (!session) { renderLoggedOut(); return; }
    const profile = await Auth.getProfile();
    if (!profile) { renderLoggedOut(); return; }
    renderLoggedIn(profile);
    refreshUnreadBadge(profile);

    // Live-update the badge as new messages arrive
    window.sb
      .channel('nav-unread-' + profile.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => refreshUnreadBadge(profile))
      .subscribe();
  } catch (e) {
    renderLoggedOut();
  }
})();
