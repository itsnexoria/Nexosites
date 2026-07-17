/* dashboard.js — NexoSites */
(function () {

  const STATUS_LABELS = {
    pending_review: 'Pending Review',
    quoted: 'Quoted',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    revision: 'Revision',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  const TYPE_LABELS = {
    landing: 'Landing Page',
    business: 'Business Website',
    ecommerce: 'Online Store',
    webapp: 'Web Application'
  };

  function money(n) {
    if (n === null || n === undefined) return '—';
    return '$' + Number(n).toLocaleString('en-US');
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderOrders(orders) {
    const list = document.getElementById('order-list');
    if (!orders.length) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>You don't have any projects yet.</p>
          <a href="/pages/quote/" class="btn btn-primary" style="margin-top:1rem;display:inline-flex">
            <i class="fas fa-plus"></i> Get Your First Quote
          </a>
        </div>`;
      return;
    }

    list.innerHTML = orders.map(o => `
      <div class="order-card">
        <div>
          <h4>${TYPE_LABELS[o.project_type] || o.project_type}</h4>
          <div class="order-meta">${o.pages} pages · Submitted ${fmtDate(o.created_at)}</div>
        </div>
        <span class="status-badge status-${o.status}">${STATUS_LABELS[o.status] || o.status}</span>
        <div class="order-price">${money(o.final_price ?? o.estimated_price)}${o.final_price ? '' : ' (est.)'}</div>
      </div>
    `).join('');

    document.getElementById('stat-total').textContent = orders.length;
    document.getElementById('stat-active').textContent = orders.filter(o => ['accepted', 'in_progress', 'revision'].includes(o.status)).length;
    document.getElementById('stat-completed').textContent = orders.filter(o => o.status === 'completed').length;
  }

  (async function init() {
    const session = await Auth.requireAuth();
    if (!session) return;

    const profile = await Auth.getProfile();
    document.getElementById('dash-name').textContent = (profile && (profile.full_name || profile.email.split('@')[0])) || 'there';

    if (profile && profile.role === 'admin') {
      window.location.href = '/pages/admin/';
      return;
    }

    if (new URLSearchParams(window.location.search).get('submitted') === '1') {
      document.getElementById('submitted-banner').style.display = 'flex';
    }

    const { data, error } = await window.sb
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      document.getElementById('order-list').innerHTML =
        `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><p>Couldn't load your projects. Please refresh.</p></div>`;
      return;
    }

    renderOrders(data || []);
  })();
})();
