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
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
      <span class="ham-bar"></span>
      <span class="ham-unread-dot" id="ham-unread-dot"></span>
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
  <nav class="mob-nav" aria-label="Site navigation">
    <a href="/"                 class="mob-link"><span class="mob-num">01</span><span class="mob-label">Home</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/services/"  class="mob-link"><span class="mob-num">02</span><span class="mob-label">Services</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/portfolio/" class="mob-link"><span class="mob-num">03</span><span class="mob-label">Portfolio</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/about/"     class="mob-link"><span class="mob-num">04</span><span class="mob-label">About</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <a href="/pages/faq/"       class="mob-link"><span class="mob-num">05</span><span class="mob-label">FAQ</span><i class="fas fa-arrow-right mob-arrow"></i></a>
    <div id="mob-auth-section"></div>
  </nav>
  <div class="mob-footer">
    <a href="/pages/quote/" class="btn btn-primary mob-cta" id="mob-auth-cta">
      <i class="fas fa-rocket"></i> Get a Quote
    </a>
    <div class="mob-contacts">
      <a href="mailto:support@nexorealm.org"><i class="fas fa-envelope"></i> support@nexorealm.org</a>
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
          <li><a href="/pages/quote/">Get a Quote</a></li>
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
        <div class="footer-contact-item"><i class="fas fa-envelope"></i><a href="mailto:support@nexorealm.org">support@nexorealm.org</a></div>
        <div class="footer-contact-item"><i class="fas fa-phone"></i><a href="tel:+27816137187">+27 81 613 7187</a></div>
        <div class="footer-contact-item"><i class="fab fa-whatsapp"></i><a href="https://wa.me/27816137187" target="_blank" rel="noopener">WhatsApp Us</a></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="yr"></span> NexoSites. All rights reserved.</span>
      <span style="display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap">
        <a href="/pages/terms/" style="color:var(--text-3)">Terms of Service</a>
        <a href="/pages/privacy/" style="color:var(--text-3)">Privacy Policy</a>
        <span>Serving clients <strong style="color:var(--purple-l)">worldwide</strong> 🌍</span>
      </span>
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

  function open() {
    const links = menu.querySelectorAll('.mob-link');
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
    const links = menu.querySelectorAll('.mob-link');
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    ham.setAttribute('aria-expanded', 'false');
    ham.classList.remove('open');
    menu.setAttribute('inert', '');
    links.forEach(l => { l.classList.remove('in'); l.style.transitionDelay = '0s'; });
    ham.focus();
  }

  window.NexoNavClose = close;

  ham.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  menu.addEventListener('click', e => {
    const target = e.target.closest('.mob-link, .mob-cta');
    if (target) close();
  });
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

  const authSection = document.getElementById('mob-auth-section');
  const mobCta      = document.getElementById('mob-auth-cta');

  function bindClose(el) {
    el.addEventListener('click', () => { if (window.NexoNavClose) window.NexoNavClose(); });
  }

  function renderLoggedOut() {
    if (!authSection) return;
    authSection.innerHTML = `
      <a href="/pages/login/" class="mob-link"><span class="mob-num">06</span><span class="mob-label">Login</span><i class="fas fa-arrow-right mob-arrow"></i></a>
      <a href="/pages/signup/" class="mob-link"><span class="mob-num">07</span><span class="mob-label">Sign Up</span><i class="fas fa-arrow-right mob-arrow"></i></a>`;
    authSection.querySelectorAll('.mob-link').forEach(bindClose);
  }

  function renderLoggedIn(profile) {
    if (!authSection) return;
    const isAdmin = profile && profile.role === 'admin';
    const dashHref = isAdmin ? '/pages/admin/' : '/pages/dashboard/';
    const dashLabel = isAdmin ? 'Admin' : 'Dashboard';
    authSection.innerHTML = `
      <a href="${dashHref}" class="mob-link"><span class="mob-num">06</span><span class="mob-label">${dashLabel}</span><i class="fas fa-arrow-right mob-arrow"></i></a>
      <a href="/pages/messages/" class="mob-link"><span class="mob-num">07</span><span class="mob-label">Messages</span><span id="mob-unread-badge" style="display:none"></span><i class="fas fa-arrow-right mob-arrow"></i></a>
      <a href="/pages/settings/" class="mob-link"><span class="mob-num">08</span><span class="mob-label">Settings</span><i class="fas fa-arrow-right mob-arrow"></i></a>
      <button type="button" id="mob-logout-btn" class="mob-link" style="width:100%;text-align:left;cursor:pointer"><span class="mob-num">09</span><span class="mob-label">Log Out</span><i class="fas fa-arrow-right-from-bracket mob-arrow"></i></button>`;
    authSection.querySelectorAll('.mob-link').forEach(bindClose);
    document.getElementById('mob-logout-btn')?.addEventListener('click', () => Auth.signOut());

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

    const dot = document.getElementById('ham-unread-dot');
    if (dot) dot.classList.toggle('show', !!count);

    const badge = document.getElementById('mob-unread-badge');
    if (badge && count) {
      badge.textContent = count > 9 ? '9+' : String(count);
      badge.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;margin-left:.5rem;background:var(--pink);color:#04121f;font-size:.68rem;font-weight:700;border-radius:99px;font-family:var(--ff-m)';
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
