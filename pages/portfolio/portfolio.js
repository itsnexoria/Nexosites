/* ═══════════════════════════════════════════════════════════════
   portfolio.js — fetches live projects from Supabase, renders
   cards, builds category filters, wires filtering + animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const CAT_LABELS = {
    gaming: 'Gaming', healthcare: 'Healthcare', business: 'Business',
    ecommerce: 'E-commerce', education: 'Education', other: 'Other'
  };
  function catLabel(cat) { return CAT_LABELS[cat] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Other'); }
  function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }

  function cardHTML(p, i) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    return `
      <article class="port-card reveal delay-${Math.min(i, 5)}" data-cat="${escapeHtml(p.category)}" aria-label="${escapeHtml(p.title)} project">
        <div class="port-img-wrap">
          <div class="port-preview">
            <img src="${escapeHtml(p.image_url || '')}" alt="${escapeHtml(p.title)} — website screenshot" loading="lazy" width="1200" height="630" class="port-screenshot"/>
          </div>
          ${p.live_url ? `
          <div class="port-overlay">
            <a href="${escapeHtml(p.live_url)}" class="port-cta-btn" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt" aria-hidden="true"></i> View Live Site
            </a>
          </div>` : ''}
          <div class="port-badge-cat ${escapeHtml(p.category)}">${catLabel(p.category)}</div>
        </div>
        <div class="port-body">
          <div class="port-meta">
            <h2 class="port-title">${escapeHtml(p.title)}</h2>
            <p class="port-desc">${escapeHtml(p.description)}</p>
          </div>
          <div class="port-tags" aria-label="Technologies used">
            ${tags.map(t => `<span class="ptag">${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="port-foot">
            ${p.live_url ? `<a href="${escapeHtml(p.live_url)}" class="btn btn-primary port-btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Live Site</a>` : ''}
            ${p.domain_label ? `<span class="port-domain">${escapeHtml(p.domain_label)}</span>` : ''}
          </div>
        </div>
      </article>`;
  }

  function observeReveals(root) {
    const els = root.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  function wireFilters(categories) {
    const bar = document.getElementById('port-filters');
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'pf-btn';
      btn.dataset.f = cat;
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = catLabel(cat);
      bar.appendChild(btn);
    });

    const btns  = bar.querySelectorAll('.pf-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.f;
        const cards = document.querySelectorAll('.port-card');
        cards.forEach((card, i) => {
          const match = filter === 'all' || card.dataset.cat === filter;
          if (match) { card.classList.remove('hidden'); card.style.animationDelay = `${i * 0.08}s`; }
          else { card.classList.add('hidden'); }
        });
      });

      btn.addEventListener('keydown', e => {
        const arr = [...btns];
        const i = arr.indexOf(btn);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); arr[(i + 1) % arr.length].focus(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); arr[(i - 1 + arr.length) % arr.length].focus(); }
      });
    });
  }

  async function init() {
    const grid = document.getElementById('port-grid');

    const { data, error } = await window.sb
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      grid.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i>Couldn't load projects right now.</div>`;
      return;
    }

    const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
    const countEl = document.getElementById('phs-count');
    const indEl   = document.getElementById('phs-industries');
    if (countEl) countEl.textContent = data.length;
    if (indEl)   indEl.textContent = categories.length;

    if (!data.length) {
      grid.innerHTML = `<div class="empty-state"><i class="fas fa-folder-open"></i>No projects published yet — check back soon.</div>`;
      return;
    }

    grid.innerHTML = data.map((p, i) => cardHTML(p, i)).join('');
    wireFilters(categories);
    observeReveals(grid);
  }

  init();
})();
