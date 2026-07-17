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
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-orders').style.display = btn.dataset.tab === 'orders' ? 'block' : 'none';
      document.getElementById('tab-messages').style.display = btn.dataset.tab === 'messages' ? 'block' : 'none';
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

  /* ── INIT ─────────────────────────────────────────────────── */
  (async function init() {
    adminProfile = await Auth.requireAdmin();
    if (!adminProfile) return;
    await loadOrders();
    await loadCustomerList();
  })();

  window.addEventListener('beforeunload', () => { if (chatChannel) window.sb.removeChannel(chatChannel); });
})();
