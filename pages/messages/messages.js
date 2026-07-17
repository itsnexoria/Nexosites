/* messages.js — NexoSites customer chat (realtime) */
(function () {
  const messagesEl = document.getElementById('chat-messages');
  const input       = document.getElementById('chat-input');
  const sendBtn     = document.getElementById('chat-send-btn');

  let profile = null;
  let channel = null;

  function fmtTime(iso) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function renderMessages(rows) {
    if (!rows.length) {
      messagesEl.innerHTML = `
        <div class="chat-empty">
          <i class="fas fa-comments"></i>
          <p>Say hello! Ask about your project, timelines, or anything else.</p>
        </div>`;
      return;
    }
    messagesEl.innerHTML = rows.map(m => `
      <div class="chat-bubble ${m.sender_id === profile.id ? 'mine' : 'theirs'}">
        ${escapeHtml(m.body)}
        <span class="time">${fmtTime(m.created_at)}</span>
      </div>
    `).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadMessages() {
    const { data, error } = await window.sb
      .from('messages')
      .select('*')
      .eq('customer_id', profile.id)
      .order('created_at', { ascending: true });
    if (error) {
      messagesEl.innerHTML = `<div class="chat-empty"><i class="fas fa-triangle-exclamation"></i><p>Couldn't load messages.</p></div>`;
      return;
    }
    renderMessages(data || []);
    // mark admin's messages as read by customer
    const unreadIds = (data || []).filter(m => m.sender_id !== profile.id && !m.read_by_customer).map(m => m.id);
    if (unreadIds.length) {
      window.sb.from('messages').update({ read_by_customer: true }).in('id', unreadIds).then(() => {});
    }
  }

  async function sendMessage() {
    const body = input.value.trim();
    if (!body) return;
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    const { error } = await window.sb.from('messages').insert({
      customer_id: profile.id,
      sender_id: profile.id,
      body,
      read_by_customer: true,
      read_by_admin: false
    });

    sendBtn.disabled = false;
    if (error) {
      alert('Message failed to send: ' + error.message);
      input.value = body;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  });

  (async function init() {
    const session = await Auth.requireAuth();
    if (!session) return;
    profile = await Auth.getProfile();

    await loadMessages();

    channel = window.sb
      .channel('chat-' + profile.id)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages', filter: `customer_id=eq.${profile.id}`
      }, () => loadMessages())
      .subscribe();
  })();

  window.addEventListener('beforeunload', () => { if (channel) window.sb.removeChannel(channel); });
})();
