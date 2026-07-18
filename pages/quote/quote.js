/* ================================================================
   quote.js — NexoSites dynamic quote calculator
   Pricing is loaded from Supabase (pricing_config) so it can be
   edited from the admin panel without a code change.
   ================================================================ */
(function () {

  let PROJECT_TYPES = [];
  let BUSINESS_SIZES = [];
  let FEATURES = [];
  let TIMELINES = [];
  let MAINTENANCE = [];

  const state = {
    project_type: 'business',
    business_size: 'solo',
    pages: 6,
    features: [],
    timeline: 'standard',
    maintenance_plan: 'none',
  };

  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function renderSingleGrid(containerId, options, selectedId, group) {
    const el = document.getElementById(containerId);
    el.innerHTML = options.map(o => `
      <label class="opt-card ${o.id === selectedId ? 'selected' : ''}" data-group="${group}" data-id="${o.id}">
        <input type="radio" name="${group}" value="${o.id}" ${o.id === selectedId ? 'checked' : ''}/>
        <div class="opt-title">${o.label}</div>
        <div class="opt-desc">${o.desc}</div>
        ${o.base !== undefined ? `<span class="opt-price">from ${money(o.base)}</span>` : ''}
        ${o.monthly !== undefined && o.monthly > 0 ? `<span class="opt-price">${money(o.monthly)}/mo</span>` : ''}
      </label>
    `).join('');
    el.querySelectorAll('.opt-card').forEach(card => {
      const input = card.querySelector('input');
      input.addEventListener('change', () => {
        state[group] = card.dataset.id;
        if (group === 'project_type') {
          const type = PROJECT_TYPES.find(t => t.id === card.dataset.id);
          state.pages = type.includedPages;
        }
        renderAll();
      });
    });
  }

  function renderFeaturesGrid() {
    const el = document.getElementById('features-grid');
    el.innerHTML = FEATURES.map(f => `
      <label class="opt-card ${state.features.includes(f.id) ? 'selected' : ''}" data-id="${f.id}">
        <input type="checkbox" value="${f.id}" ${state.features.includes(f.id) ? 'checked' : ''}/>
        <div class="opt-title">${f.label}</div>
        <div class="opt-desc">${f.desc}</div>
        <span class="opt-price">+${money(f.price)}</span>
      </label>
    `).join('');
    el.querySelectorAll('.opt-card').forEach(card => {
      const input = card.querySelector('input');
      input.addEventListener('change', () => {
        const id = card.dataset.id;
        const idx = state.features.indexOf(id);
        if (input.checked && idx < 0) state.features.push(id);
        if (!input.checked && idx >= 0) state.features.splice(idx, 1);
        renderAll();
      });
    });
  }

  function calc() {
    const type = PROJECT_TYPES.find(t => t.id === state.project_type);
    const size = BUSINESS_SIZES.find(s => s.id === state.business_size);
    const timeline = TIMELINES.find(t => t.id === state.timeline);
    const maint = MAINTENANCE.find(m => m.id === state.maintenance_plan);

    const extraPages = Math.max(0, state.pages - type.includedPages);
    const extraPagesCost = extraPages * 8;
    const featuresCost = state.features.reduce((sum, id) => sum + FEATURES.find(f => f.id === id).price, 0);

    const subtotal = type.base + extraPagesCost + featuresCost;
    const afterSize = subtotal * size.mult;
    const total = afterSize * timeline.mult;

    return {
      type, size, timeline, maint, extraPages, extraPagesCost, featuresCost,
      subtotal, total: Math.round(total / 5) * 5,
      monthly: maint.monthly
    };
  }

  function renderSummary() {
    const c = calc();
    const lines = [];
    lines.push(`<div class="qs-line"><span>${c.type.label}</span><span>${money(c.type.base)}</span></div>`);
    if (c.extraPages > 0) lines.push(`<div class="qs-line"><span>+${c.extraPages} extra pages</span><span>${money(c.extraPagesCost)}</span></div>`);
    state.features.forEach(id => {
      const f = FEATURES.find(x => x.id === id);
      lines.push(`<div class="qs-line"><span>${f.label}</span><span>+${money(f.price)}</span></div>`);
    });
    if (c.size.mult !== 1) lines.push(`<div class="qs-line"><span>${c.size.label} size</span><span>×${c.size.mult}</span></div>`);
    if (c.timeline.mult !== 1) lines.push(`<div class="qs-line"><span>${c.timeline.label} timeline</span><span>×${c.timeline.mult}</span></div>`);

    document.getElementById('qs-lines').innerHTML = lines.join('');
    document.getElementById('qs-total-amt').textContent = money(c.total);

    const maintLine = document.getElementById('qs-maintenance-line');
    if (c.monthly > 0) {
      maintLine.style.display = 'flex';
      document.getElementById('qs-maintenance-amt').textContent = money(c.monthly) + '/mo';
    } else {
      maintLine.style.display = 'none';
    }
  }

  function renderAll() {
    renderSingleGrid('project-type-grid', PROJECT_TYPES, state.project_type, 'project_type');
    renderSingleGrid('business-size-grid', BUSINESS_SIZES, state.business_size, 'business_size');
    renderFeaturesGrid();
    renderSingleGrid('timeline-grid', TIMELINES, state.timeline, 'timeline');
    renderSingleGrid('maintenance-grid', MAINTENANCE, state.maintenance_plan, 'maintenance_plan');
    document.getElementById('pages-count').textContent = state.pages;
    renderSummary();
  }

  document.getElementById('pages-minus').addEventListener('click', () => {
    state.pages = Math.max(1, state.pages - 1);
    renderAll();
  });
  document.getElementById('pages-plus').addEventListener('click', () => {
    state.pages = Math.min(60, state.pages + 1);
    renderAll();
  });

  /* ── SUBMIT ─────────────────────────────────────────────────── */
  const submitBtn   = document.getElementById('quote-submit-btn');
  const btnLabel    = submitBtn.querySelector('.btn-label');
  const btnSending  = submitBtn.querySelector('.btn-sending');
  const errBox      = document.getElementById('quote-error');
  const errMsg      = document.getElementById('quote-error-msg');
  const STORAGE_KEY = 'nexosites_pending_quote';

  const PAGE_LOADED_AT = Date.now();

  async function submitQuote() {
    errBox.style.display = 'none';

    // Spam guards: honeypot field filled, or submitted implausibly fast
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value.trim()) {
      // Silently "succeed" for bots without actually submitting anything
      window.location.href = '/pages/dashboard/?submitted=1';
      return;
    }
    if (Date.now() - PAGE_LOADED_AT < 2500) {
      errMsg.textContent = 'Please take a moment to review your quote before submitting.';
      errBox.style.display = 'flex';
      return;
    }

    const session = await Auth.getSession();

    if (!session) {
      // Save the quote and send them to sign up; they'll resume automatically.
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, notes: document.getElementById('notes').value }));
      window.location.href = '/pages/signup/?next=' + encodeURIComponent('/pages/quote/');
      return;
    }

    submitBtn.disabled = true;
    btnLabel.style.display = 'none';
    btnSending.style.display = 'inline-flex';

    const c = calc();
    const payload = {
      customer_id: session.user.id,
      project_type: state.project_type,
      business_size: state.business_size,
      pages: state.pages,
      features: state.features,
      timeline: state.timeline,
      maintenance_plan: state.maintenance_plan,
      notes: document.getElementById('notes').value.trim() || null,
      estimated_price: c.total,
      currency: 'USD',
      status: 'pending_review'
    };

    const { error } = await window.sb.from('orders').insert(payload);

    submitBtn.disabled = false;
    btnLabel.style.display = 'inline';
    btnSending.style.display = 'none';

    if (error) {
      const isRateLimited = error.message && error.message.includes('rate_limit_exceeded');
      errMsg.textContent = isRateLimited
        ? "You've submitted several quotes recently — please wait a bit before submitting another, or message us directly if you need to make more changes."
        : (error.message || 'Could not submit your quote. Please try again.');
      errBox.style.display = 'flex';
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = '/pages/dashboard/?submitted=1';
  }

  submitBtn.addEventListener('click', submitQuote);

  // Resume a quote that was started before signing up
  function resumePendingQuote() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      if (parsed.notes) document.getElementById('notes').value = parsed.notes;
      renderAll();
    } catch (_) { /* ignore malformed saved state */ }
  }

  /* ── LOAD PRICING CONFIG, THEN START ──────────────────────────── */
  async function loadPricingConfigAndStart() {
    const loadingEl = document.getElementById('quote-loading');
    const layoutEl  = document.getElementById('quote-layout');

    const { data, error } = await window.sb
      .from('pricing_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      loadingEl.innerHTML = '<i class="fas fa-triangle-exclamation"></i><br>Couldn\'t load pricing. Please refresh the page.';
      return;
    }

    PROJECT_TYPES = data.project_types;
    BUSINESS_SIZES = data.business_sizes;
    FEATURES = data.features;
    TIMELINES = data.timelines;
    MAINTENANCE = data.maintenance_plans;

    state.project_type = PROJECT_TYPES[1]?.id || PROJECT_TYPES[0]?.id;
    state.pages = PROJECT_TYPES.find(t => t.id === state.project_type)?.includedPages || 1;
    state.business_size = BUSINESS_SIZES[0]?.id;
    state.timeline = TIMELINES[0]?.id;
    state.maintenance_plan = MAINTENANCE[0]?.id;

    loadingEl.style.display = 'none';
    layoutEl.style.display = '';
    renderAll();
    resumePendingQuote();
  }

  loadPricingConfigAndStart();

})();
