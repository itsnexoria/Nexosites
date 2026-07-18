/* ================================================================
   admin.js — NexoSites admin panel
   ================================================================ */
(function () {

  const STATUS_LABELS = {
    pending_review: 'Pending Review', quoted: 'Quoted', accepted: 'Accepted',
    in_progress: 'In Progress', revision: 'Revision', completed: 'Completed', cancelled: 'Cancelled'
  };
  const TYPE_LABELS = { landing: 'Landing Page', business: 'Business Website', ecommerce: 'Online Store', webapp: 'Web Application' };
  const SIZE_LABELS = { solo: 'Solo', small: 'Small Biz', medium: 'Medium Biz', enterprise: 'Enterprise' };
  const FEATURE_LABELS = {
    accounts: 'User Accounts', payments: 'Payments', booking: 'Booking', blog: 'Blog/CMS',
    multilang: 'Multi-language', animations: 'Animations', seo: 'SEO', copy: 'Copywriting'
  };

  let adminProfile = null;
  let orders = [];
  let selectedOrderId = null;
  let activeCustomerId = null;
  let chatChannel = null;

  function money(n) { return (n === null || n === undefined) ? '—' : '$' + Number(n).toLocaleString('en-US'); }
  function fmtDate(iso) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function fmtTime(iso) { return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); }
  function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  function initials(name) { return (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(); }

  /* ── TABS ─────────────────────────────────────────────────── */
  const TAB_IDS = ['orders', 'messages', 'portfolio', 'testimonials', 'faq', 'pricing'];
  let portfolioLoaded = false;
  let pricingLoaded = false;
  let testimonialsLoaded = false;
  let faqLoaded = false;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      TAB_IDS.forEach(id => {
        document.getElementById('tab-' + id).style.display = (btn.dataset.tab === id) ? 'block' : 'none';
      });
      if (btn.dataset.tab === 'portfolio' && !portfolioLoaded) { portfolioLoaded = true; loadPortfolio(); }
      if (btn.dataset.tab === 'pricing' && !pricingLoaded) { pricingLoaded = true; loadPricingConfig(); }
      if (btn.dataset.tab === 'testimonials' && !testimonialsLoaded) { testimonialsLoaded = true; loadTestimonials(); }
      if (btn.dataset.tab === 'faq' && !faqLoaded) { faqLoaded = true; loadFaqItems(); }
    });
  });

  /* ── ORDERS ───────────────────────────────────────────────── */
  async function loadOrders() {
    const { data, error } = await window.sb
      .from('orders')
      .select('*, profiles(id, full_name, email, company_name)')
      .order('created_at', { ascending: false });

    const tbody = document.getElementById('orders-tbody');
    if (error) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-2)">Couldn't load orders.</td></tr>`;
      return;
    }
    orders = data || [];

    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-2)">No orders yet.</td></tr>`;
    } else {
      tbody.innerHTML = orders.map(o => `
        <tr class="clickable" data-id="${o.id}">
          <td><strong>${escapeHtml(o.profiles?.full_name || o.profiles?.email || 'Unknown')}</strong>${o.profiles?.company_name ? `<br><span style="color:var(--text-2);font-size:.8rem">${escapeHtml(o.profiles.company_name)}</span>` : ''}</td>
          <td>${TYPE_LABELS[o.project_type] || o.project_type}</td>
          <td>${SIZE_LABELS[o.business_size] || o.business_size || '—'}</td>
          <td><span class="status-badge status-${o.status}">${STATUS_LABELS[o.status] || o.status}</span></td>
          <td>${money(o.final_price ?? o.estimated_price)}</td>
          <td>${fmtDate(o.created_at)}</td>
        </tr>
      `).join('');
      tbody.querySelectorAll('tr.clickable').forEach(row => {
        row.addEventListener('click', () => openOrderDetail(row.dataset.id));
      });
    }

    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'pending_review').length;
    document.getElementById('stat-inprogress').textContent = orders.filter(o => o.status === 'in_progress').length;

    const completed = orders.filter(o => o.status === 'completed');
    const priced = orders.filter(o => o.final_price != null || o.estimated_price != null);
    const acceptedOrBeyond = orders.filter(o => ['accepted', 'in_progress', 'revision', 'completed'].includes(o.status));

    const revenue = completed.reduce((sum, o) => sum + Number(o.final_price ?? o.estimated_price ?? 0), 0);
    const conversion = orders.length ? Math.round((acceptedOrBeyond.length / orders.length) * 100) : 0;
    const avgOrder = priced.length ? priced.reduce((sum, o) => sum + Number(o.final_price ?? o.estimated_price ?? 0), 0) / priced.length : 0;

    document.getElementById('stat-revenue').textContent = money(revenue);
    document.getElementById('stat-conversion').textContent = conversion + '%';
    document.getElementById('stat-avg-order').textContent = money(avgOrder);
  }

  function openOrderDetail(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    selectedOrderId = orderId;

    const featureTags = (o.features || []).map(f => `<span class="tag">${FEATURE_LABELS[f] || f}</span>`).join('') || '<span style="color:var(--text-2)">None selected</span>';

    document.getElementById('detail-fields').innerHTML = `
      <div class="detail-row"><span>Customer</span><span>${escapeHtml(o.profiles?.full_name || o.profiles?.email || 'Unknown')}</span></div>
      <div class="detail-row"><span>Email</span><span>${escapeHtml(o.profiles?.email || '—')}</span></div>
      <div class="detail-row"><span>Type</span><span>${TYPE_LABELS[o.project_type] || o.project_type}</span></div>
      <div class="detail-row"><span>Business Size</span><span>${SIZE_LABELS[o.business_size] || o.business_size || '—'}</span></div>
      <div class="detail-row"><span>Pages</span><span>${o.pages}</span></div>
      <div class="detail-row"><span>Timeline</span><span>${o.timeline}</span></div>
      <div class="detail-row"><span>Maintenance</span><span>${o.maintenance_plan}</span></div>
      <div class="detail-row"><span>Estimate</span><span>${money(o.estimated_price)}</span></div>
      <div style="margin-top:1rem"><div style="color:var(--text-2);font-size:.88rem;margin-bottom:.5rem">Features</div><div class="tag-row">${featureTags}</div></div>
      ${o.notes ? `<div style="margin-top:1rem"><div style="color:var(--text-2);font-size:.88rem;margin-bottom:.5rem">Notes</div><div style="font-size:.9rem;line-height:1.5">${escapeHtml(o.notes)}</div></div>` : ''}
    `;
    document.getElementById('detail-status').value = o.status;
    document.getElementById('detail-price').value = o.final_price ?? o.estimated_price ?? '';
    document.getElementById('order-detail').style.display = 'block';
    document.getElementById('order-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.getElementById('detail-chat-btn').onclick = () => {
      document.querySelector('.tab-btn[data-tab="messages"]').click();
      openCustomerThread(o.customer_id, o.profiles?.full_name || o.profiles?.email);
    };
  }

  document.getElementById('detail-save-btn').addEventListener('click', async () => {
    if (!selectedOrderId) return;
    const btn = document.getElementById('detail-save-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const status = document.getElementById('detail-status').value;
    const priceVal = document.getElementById('detail-price').value;
    const final_price = priceVal === '' ? null : Number(priceVal);

    const { error } = await window.sb.from('orders').update({ status, final_price }).eq('id', selectedOrderId);

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { alert('Could not save: ' + error.message); return; }
    await loadOrders();
    openOrderDetail(selectedOrderId);
  });

  /* ── CUSTOMER LIST / MESSAGES ─────────────────────────────── */
  async function loadCustomerList() {
    const { data: customers, error: custErr } = await window.sb
      .from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false });
    if (custErr) return;
    document.getElementById('stat-customers').textContent = customers.length;

    const { data: msgs } = await window.sb.from('messages').select('*').order('created_at', { ascending: false });

    const listEl = document.getElementById('admin-chat-list');
    if (!customers.length) {
      listEl.innerHTML = `<div class="empty-state"><i class="fas fa-users"></i>No customers yet.</div>`;
      return;
    }

    const enriched = customers.map(c => {
      const theirMsgs = (msgs || []).filter(m => m.customer_id === c.id);
      const last = theirMsgs[0];
      const unread = theirMsgs.filter(m => m.sender_id !== adminProfile.id && !m.read_by_admin).length;
      return { ...c, lastMsg: last, unread };
    }).sort((a, b) => {
      const ta = a.lastMsg ? new Date(a.lastMsg.created_at).getTime() : 0;
      const tb = b.lastMsg ? new Date(b.lastMsg.created_at).getTime() : 0;
      return tb - ta;
    });

    listEl.innerHTML = enriched.map(c => `
      <div class="chat-list-item ${c.id === activeCustomerId ? 'active' : ''}" data-id="${c.id}" data-name="${escapeHtml(c.full_name || c.email)}">
        <div class="chat-avatar">${initials(c.full_name || c.email)}</div>
        <div style="min-width:0">
          <div class="chat-list-name">${escapeHtml(c.full_name || c.email)}</div>
          <div class="chat-list-preview">${c.lastMsg ? escapeHtml(c.lastMsg.body) : 'No messages yet'}</div>
        </div>
        ${c.unread ? '<span class="unread-dot"></span>' : ''}
      </div>
    `).join('');

    listEl.querySelectorAll('.chat-list-item').forEach(item => {
      item.addEventListener('click', () => openCustomerThread(item.dataset.id, item.dataset.name));
    });
  }

  async function openCustomerThread(customerId, customerName) {
    activeCustomerId = customerId;
    document.getElementById('admin-chat-head').textContent = customerName || 'Customer';
    document.getElementById('admin-chat-input').disabled = false;
    document.getElementById('admin-chat-send-btn').disabled = false;

    document.querySelectorAll('#admin-chat-list .chat-list-item').forEach(i => i.classList.toggle('active', i.dataset.id === customerId));

    await loadThread();

    if (chatChannel) window.sb.removeChannel(chatChannel);
    chatChannel = window.sb
      .channel('admin-chat-' + customerId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `customer_id=eq.${customerId}` }, () => {
        loadThread();
        loadCustomerList();
      })
      .subscribe();
  }

  async function loadThread() {
    if (!activeCustomerId) return;
    const { data, error } = await window.sb
      .from('messages').select('*').eq('customer_id', activeCustomerId).order('created_at', { ascending: true });
    const box = document.getElementById('admin-chat-messages');
    if (error) { box.innerHTML = `<div class="chat-empty"><i class="fas fa-triangle-exclamation"></i><p>Couldn't load messages.</p></div>`; return; }

    if (!data.length) {
      box.innerHTML = `<div class="chat-empty"><i class="fas fa-comments"></i><p>No messages yet — say hello.</p></div>`;
    } else {
      box.innerHTML = data.map(m => `
        <div class="chat-bubble ${m.sender_id === adminProfile.id ? 'mine' : 'theirs'}">
          ${escapeHtml(m.body)}
          <span class="time">${fmtTime(m.created_at)}</span>
        </div>
      `).join('');
      box.scrollTop = box.scrollHeight;
    }

    const unreadIds = data.filter(m => m.sender_id !== adminProfile.id && !m.read_by_admin).map(m => m.id);
    if (unreadIds.length) window.sb.from('messages').update({ read_by_admin: true }).in('id', unreadIds).then(() => {});
  }

  async function sendAdminMessage() {
    const input = document.getElementById('admin-chat-input');
    const body = input.value.trim();
    if (!body || !activeCustomerId) return;
    input.value = ''; input.style.height = 'auto';

    const { error } = await window.sb.from('messages').insert({
      customer_id: activeCustomerId,
      sender_id: adminProfile.id,
      body,
      read_by_admin: true,
      read_by_customer: false
    });
    if (error) alert('Message failed to send: ' + error.message);
  }

  document.getElementById('admin-chat-send-btn').addEventListener('click', sendAdminMessage);
  document.getElementById('admin-chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAdminMessage(); }
  });

  /* ── PORTFOLIO CRUD ───────────────────────────────────────── */
  let portfolioItems = [];
  let editingPortfolioId = null;

  async function loadPortfolio() {
    const tbody = document.getElementById('portfolio-tbody');
    const { data, error } = await window.sb
      .from('portfolio_projects').select('*').order('display_order', { ascending: true });

    if (error) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-2)">Couldn't load projects.</td></tr>`;
      return;
    }
    portfolioItems = data || [];

    if (!portfolioItems.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-2)">No projects yet — add your first one.</td></tr>`;
      return;
    }

    tbody.innerHTML = portfolioItems.map(p => `
      <tr>
        <td>${p.display_order}</td>
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td><span class="tag">${escapeHtml(p.category)}</span></td>
        <td>${p.live_url ? `<a href="${escapeHtml(p.live_url)}" target="_blank" rel="noopener noreferrer" style="color:var(--purple-l)">${escapeHtml(p.domain_label || p.live_url)}</a>` : '—'}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost" data-edit="${p.id}" style="padding:.4em .8em;font-size:.78rem"><i class="fas fa-pen"></i></button>
          <button class="btn btn-ghost" data-del="${p.id}" style="padding:.4em .8em;font-size:.78rem;color:#ef4444"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openPortfolioForm(btn.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deletePortfolioItem(btn.dataset.del)));
  }

  function openPortfolioForm(id) {
    const wrap = document.getElementById('portfolio-form-wrap');
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('pf-image-preview').textContent = '';
    document.getElementById('pf-image-file').value = '';

    if (id) {
      const p = portfolioItems.find(x => x.id === id);
      editingPortfolioId = id;
      document.getElementById('portfolio-form-title').textContent = 'Edit Project';
      document.getElementById('pf-title').value = p.title || '';
      document.getElementById('pf-category').value = p.category || '';
      document.getElementById('pf-description').value = p.description || '';
      document.getElementById('pf-image').value = p.image_url || '';
      document.getElementById('pf-live-url').value = p.live_url || '';
      document.getElementById('pf-domain').value = p.domain_label || '';
      document.getElementById('pf-order').value = p.display_order ?? 0;
      document.getElementById('pf-tags').value = (p.tags || []).join(', ');
    } else {
      editingPortfolioId = null;
      document.getElementById('portfolio-form-title').textContent = 'Add Project';
      ['pf-title','pf-category','pf-description','pf-image','pf-live-url','pf-domain','pf-tags'].forEach(id2 => document.getElementById(id2).value = '');
      document.getElementById('pf-order').value = portfolioItems.length + 1;
    }
  }

  document.getElementById('portfolio-add-btn').addEventListener('click', () => openPortfolioForm(null));
  document.getElementById('portfolio-cancel-btn').addEventListener('click', () => {
    document.getElementById('portfolio-form-wrap').style.display = 'none';
  });

  document.getElementById('pf-image-upload-btn').addEventListener('click', () => {
    document.getElementById('pf-image-file').click();
  });

  document.getElementById('pf-image-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = document.getElementById('pf-image-upload-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await window.sb.storage.from('portfolio-images').upload(path, file, { upsert: false });

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';

    if (error) { alert('Upload failed: ' + error.message); return; }

    const { data } = window.sb.storage.from('portfolio-images').getPublicUrl(path);
    document.getElementById('pf-image').value = data.publicUrl;
    document.getElementById('pf-image-preview').textContent = 'Uploaded ✓';
  });

  document.getElementById('portfolio-save-btn').addEventListener('click', async () => {
    const btn = document.getElementById('portfolio-save-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const payload = {
      title: document.getElementById('pf-title').value.trim(),
      category: document.getElementById('pf-category').value.trim().toLowerCase() || 'business',
      description: document.getElementById('pf-description').value.trim(),
      image_url: document.getElementById('pf-image').value.trim() || null,
      live_url: document.getElementById('pf-live-url').value.trim() || null,
      domain_label: document.getElementById('pf-domain').value.trim() || null,
      display_order: Number(document.getElementById('pf-order').value) || 0,
      tags: document.getElementById('pf-tags').value.split(',').map(t => t.trim()).filter(Boolean)
    };

    const query = editingPortfolioId
      ? window.sb.from('portfolio_projects').update(payload).eq('id', editingPortfolioId)
      : window.sb.from('portfolio_projects').insert(payload);
    const { error } = await query;

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { alert('Could not save: ' + error.message); return; }

    document.getElementById('portfolio-form-wrap').style.display = 'none';
    await loadPortfolio();
  });

  async function deletePortfolioItem(id) {
    if (!confirm('Delete this project from the portfolio? This cannot be undone.')) return;
    const { error } = await window.sb.from('portfolio_projects').delete().eq('id', id);
    if (error) { alert('Could not delete: ' + error.message); return; }
    await loadPortfolio();
  }

  /* ── TESTIMONIALS CRUD ────────────────────────────────────── */
  let testimonialItems = [];
  let editingTestiId = null;

  async function loadTestimonials() {
    const tbody = document.getElementById('testi-tbody');
    const { data, error } = await window.sb.from('testimonials').select('*').order('display_order', { ascending: true });
    if (error) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-2)">Couldn't load testimonials.</td></tr>`; return; }
    testimonialItems = data || [];

    if (!testimonialItems.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-2)">No testimonials yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = testimonialItems.map(t => `
      <tr>
        <td>${t.display_order}</td>
        <td><strong>${escapeHtml(t.author_name)}</strong>${t.author_detail ? `<br><span style="color:var(--text-2);font-size:.8rem">${escapeHtml(t.author_detail)}</span>` : ''}</td>
        <td>${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</td>
        <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(t.quote)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost" data-edit="${t.id}" style="padding:.4em .8em;font-size:.78rem"><i class="fas fa-pen"></i></button>
          <button class="btn btn-ghost" data-del="${t.id}" style="padding:.4em .8em;font-size:.78rem;color:#ef4444"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openTestiForm(btn.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteTesti(btn.dataset.del)));
  }

  function openTestiForm(id) {
    const wrap = document.getElementById('testi-form-wrap');
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (id) {
      const t = testimonialItems.find(x => x.id === id);
      editingTestiId = id;
      document.getElementById('testi-form-title').textContent = 'Edit Testimonial';
      document.getElementById('ts-author').value = t.author_name || '';
      document.getElementById('ts-detail').value = t.author_detail || '';
      document.getElementById('ts-quote').value = t.quote || '';
      document.getElementById('ts-rating').value = t.rating ?? 5;
      document.getElementById('ts-order').value = t.display_order ?? 0;
    } else {
      editingTestiId = null;
      document.getElementById('testi-form-title').textContent = 'Add Testimonial';
      document.getElementById('ts-author').value = '';
      document.getElementById('ts-detail').value = '';
      document.getElementById('ts-quote').value = '';
      document.getElementById('ts-rating').value = 5;
      document.getElementById('ts-order').value = testimonialItems.length + 1;
    }
  }

  document.getElementById('testi-add-btn').addEventListener('click', () => openTestiForm(null));
  document.getElementById('testi-cancel-btn').addEventListener('click', () => {
    document.getElementById('testi-form-wrap').style.display = 'none';
  });

  document.getElementById('testi-save-btn').addEventListener('click', async () => {
    const btn = document.getElementById('testi-save-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const payload = {
      author_name: document.getElementById('ts-author').value.trim(),
      author_detail: document.getElementById('ts-detail').value.trim() || null,
      quote: document.getElementById('ts-quote').value.trim(),
      rating: Math.min(5, Math.max(1, Number(document.getElementById('ts-rating').value) || 5)),
      display_order: Number(document.getElementById('ts-order').value) || 0,
    };

    const query = editingTestiId
      ? window.sb.from('testimonials').update(payload).eq('id', editingTestiId)
      : window.sb.from('testimonials').insert(payload);
    const { error } = await query;

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { alert('Could not save: ' + error.message); return; }

    document.getElementById('testi-form-wrap').style.display = 'none';
    await loadTestimonials();
  });

  async function deleteTesti(id) {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return;
    const { error } = await window.sb.from('testimonials').delete().eq('id', id);
    if (error) { alert('Could not delete: ' + error.message); return; }
    await loadTestimonials();
  }

  /* ── FAQ CRUD ─────────────────────────────────────────────── */
  let faqItemsList = [];
  let editingFaqId = null;

  async function loadFaqItems() {
    const tbody = document.getElementById('faq-tbody');
    const { data, error } = await window.sb.from('faq_items').select('*').order('display_order', { ascending: true });
    if (error) { tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-2)">Couldn't load FAQ items.</td></tr>`; return; }
    faqItemsList = data || [];

    if (!faqItemsList.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-2)">No FAQ items yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = faqItemsList.map(f => `
      <tr>
        <td>${f.display_order}</td>
        <td>${escapeHtml(f.question)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost" data-edit="${f.id}" style="padding:.4em .8em;font-size:.78rem"><i class="fas fa-pen"></i></button>
          <button class="btn btn-ghost" data-del="${f.id}" style="padding:.4em .8em;font-size:.78rem;color:#ef4444"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => openFaqForm(btn.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteFaqItem(btn.dataset.del)));
  }

  function openFaqForm(id) {
    const wrap = document.getElementById('faq-form-wrap');
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (id) {
      const f = faqItemsList.find(x => x.id === id);
      editingFaqId = id;
      document.getElementById('faq-form-title').textContent = 'Edit Question';
      document.getElementById('fq-question').value = f.question || '';
      document.getElementById('fq-answer').value = f.answer || '';
      document.getElementById('fq-order').value = f.display_order ?? 0;
    } else {
      editingFaqId = null;
      document.getElementById('faq-form-title').textContent = 'Add Question';
      document.getElementById('fq-question').value = '';
      document.getElementById('fq-answer').value = '';
      document.getElementById('fq-order').value = faqItemsList.length + 1;
    }
  }

  document.getElementById('faq-add-btn').addEventListener('click', () => openFaqForm(null));
  document.getElementById('faq-cancel-btn').addEventListener('click', () => {
    document.getElementById('faq-form-wrap').style.display = 'none';
  });

  document.getElementById('faq-save-btn').addEventListener('click', async () => {
    const btn = document.getElementById('faq-save-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const payload = {
      question: document.getElementById('fq-question').value.trim(),
      answer: document.getElementById('fq-answer').value.trim(),
      display_order: Number(document.getElementById('fq-order').value) || 0,
    };

    const query = editingFaqId
      ? window.sb.from('faq_items').update(payload).eq('id', editingFaqId)
      : window.sb.from('faq_items').insert(payload);
    const { error } = await query;

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { alert('Could not save: ' + error.message); return; }

    document.getElementById('faq-form-wrap').style.display = 'none';
    await loadFaqItems();
  });

  async function deleteFaqItem(id) {
    if (!confirm('Delete this FAQ item? This cannot be undone.')) return;
    const { error } = await window.sb.from('faq_items').delete().eq('id', id);
    if (error) { alert('Could not delete: ' + error.message); return; }
    await loadFaqItems();
  }

  /* ── PRICING CONFIG EDITOR ────────────────────────────────── */
  let pricingConfig = null;

  const PRICING_GROUPS = {
    'pc-project-types': { key: 'project_types', fields: [{ key: 'base', label: 'Base $', def: 100 }, { key: 'includedPages', label: 'Incl. Pages', def: 5 }] },
    'pc-business-sizes': { key: 'business_sizes', fields: [{ key: 'mult', label: '× Multiplier', def: 1 }] },
    'pc-features': { key: 'features', fields: [{ key: 'price', label: '+ $', def: 25 }] },
    'pc-timelines': { key: 'timelines', fields: [{ key: 'mult', label: '× Multiplier', def: 1 }] },
    'pc-maintenance': { key: 'maintenance_plans', fields: [{ key: 'monthly', label: '$ / month', def: 15 }] },
  };

  async function loadPricingConfig() {
    const wrap = document.getElementById('pricing-editor');
    const { data, error } = await window.sb.from('pricing_config').select('*').eq('id', 1).single();
    if (error || !data) {
      wrap.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i>Couldn't load pricing config.</div>`;
      return;
    }
    pricingConfig = data;
    renderPricingEditor();
  }

  function slugify(label, existingIds) {
    let base = (label || 'item').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
    let slug = base, n = 2;
    while (existingIds.includes(slug)) { slug = `${base}-${n}`; n++; }
    return slug;
  }

  function pricingRowHTML(item, fields) {
    return `
      <tr data-id="${escapeHtml(item.id || '')}">
        <td><input type="text" class="pc-label" value="${escapeHtml(item.label || '')}" style="min-width:120px"/></td>
        <td><input type="text" class="pc-desc" value="${escapeHtml(item.desc || '')}" style="min-width:160px"/></td>
        ${fields.map(f => `<td><input type="number" step="0.01" class="pc-${f.key}" value="${item[f.key] ?? f.def}"/></td>`).join('')}
        <td><button type="button" class="pc-remove-btn" aria-label="Remove row"><i class="fas fa-xmark"></i></button></td>
      </tr>`;
  }

  function pricingGroupTable(containerId, items, fields) {
    const rows = items.map(item => pricingRowHTML(item, fields)).join('');
    return `
      <table class="admin-table" style="margin-bottom:.8rem">
        <thead><tr><th>Label</th><th>Description</th>${fields.map(f => `<th>${f.label}</th>`).join('')}<th></th></tr></thead>
        <tbody id="${containerId}-body">${rows}</tbody>
      </table>
      <button type="button" class="btn btn-ghost pc-add-btn" data-add="${containerId}" style="padding:.5em 1em;font-size:.82rem">
        <i class="fas fa-plus"></i> Add Item
      </button>`;
  }

  function renderPricingEditor() {
    const c = pricingConfig;
    document.getElementById('pricing-editor').innerHTML = `
      <div class="detail-card" style="margin-bottom:1.5rem">
        <h4>Project Types</h4>
        <div id="pc-project-types">${pricingGroupTable('pc-project-types', c.project_types, PRICING_GROUPS['pc-project-types'].fields)}</div>
      </div>
      <div class="detail-card" style="margin-bottom:1.5rem">
        <h4>Business Size Multipliers</h4>
        <div id="pc-business-sizes">${pricingGroupTable('pc-business-sizes', c.business_sizes, PRICING_GROUPS['pc-business-sizes'].fields)}</div>
      </div>
      <div class="detail-card" style="margin-bottom:1.5rem">
        <h4>Features (add-on price)</h4>
        <div id="pc-features">${pricingGroupTable('pc-features', c.features, PRICING_GROUPS['pc-features'].fields)}</div>
      </div>
      <div class="detail-card" style="margin-bottom:1.5rem">
        <h4>Timeline Multipliers</h4>
        <div id="pc-timelines">${pricingGroupTable('pc-timelines', c.timelines, PRICING_GROUPS['pc-timelines'].fields)}</div>
      </div>
      <div class="detail-card">
        <h4>Maintenance Plans (monthly)</h4>
        <div id="pc-maintenance">${pricingGroupTable('pc-maintenance', c.maintenance_plans, PRICING_GROUPS['pc-maintenance'].fields)}</div>
      </div>
    `;
    wirePricingRowButtons();
  }

  function wirePricingRowButtons() {
    document.querySelectorAll('.pc-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tbody = btn.closest('tbody');
        if (tbody.querySelectorAll('tr').length <= 1) { alert("Can't remove the last item in a category."); return; }
        btn.closest('tr').remove();
      });
    });
    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const containerId = btn.dataset.add;
        const group = PRICING_GROUPS[containerId];
        const tbody = document.getElementById(`${containerId}-body`);
        const blank = { label: 'New Item', desc: '' };
        group.fields.forEach(f => { blank[f.key] = f.def; });
        tbody.insertAdjacentHTML('beforeend', pricingRowHTML(blank, group.fields));
        const newRow = tbody.lastElementChild;
        newRow.querySelector('.pc-remove-btn').addEventListener('click', () => {
          if (tbody.querySelectorAll('tr').length <= 1) { alert("Can't remove the last item in a category."); return; }
          newRow.remove();
        });
        newRow.querySelector('.pc-label').focus();
      });
    });
  }

  function readPricingGroup(containerId, fields) {
    const rows = document.querySelectorAll(`#${containerId}-body tr`);
    const existingIds = Array.from(rows).map(r => r.dataset.id).filter(Boolean);
    return Array.from(rows).map(row => {
      const label = row.querySelector('.pc-label').value.trim() || 'Untitled';
      const desc = row.querySelector('.pc-desc').value.trim();
      let id = row.dataset.id;
      if (!id) { id = slugify(label, existingIds); existingIds.push(id); }
      const item = { id, label, desc };
      fields.forEach(f => { item[f.key] = Number(row.querySelector(`.pc-${f.key}`).value) || 0; });
      return item;
    });
  }

  document.getElementById('pricing-save-btn').addEventListener('click', async () => {
    if (!pricingConfig) return;
    const btn = document.getElementById('pricing-save-btn');
    const label = btn.querySelector('.btn-label'), sending = btn.querySelector('.btn-sending');
    btn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const updated = {
      project_types: readPricingGroup('pc-project-types', PRICING_GROUPS['pc-project-types'].fields),
      business_sizes: readPricingGroup('pc-business-sizes', PRICING_GROUPS['pc-business-sizes'].fields),
      features: readPricingGroup('pc-features', PRICING_GROUPS['pc-features'].fields),
      timelines: readPricingGroup('pc-timelines', PRICING_GROUPS['pc-timelines'].fields),
      maintenance_plans: readPricingGroup('pc-maintenance', PRICING_GROUPS['pc-maintenance'].fields),
    };

    const { error } = await window.sb.from('pricing_config').update(updated).eq('id', 1);

    btn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { alert('Could not save pricing: ' + error.message); return; }
    pricingConfig = { ...pricingConfig, ...updated };
    renderPricingEditor();
    alert('Pricing updated — the quote calculator now reflects these changes.');
  });

  /* ── INIT ─────────────────────────────────────────────────── */
  (async function init() {
    adminProfile = await Auth.requireAdmin();
    if (!adminProfile) return;
    await loadOrders();
    await loadCustomerList();
  })();

  window.addEventListener('beforeunload', () => { if (chatChannel) window.sb.removeChannel(chatChannel); });
})();
