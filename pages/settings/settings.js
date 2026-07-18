/* settings.js — NexoSites customer account settings */
(function () {

  function showMsg(id, msgId, text) {
    const box = document.getElementById(id);
    if (msgId && text) document.getElementById(msgId).textContent = text;
    box.style.display = 'flex';
  }
  function hideMsg(id) { document.getElementById(id).style.display = 'none'; }

  /* ── PROFILE ────────────────────────────────────────────────── */
  const profileForm = document.getElementById('profile-form');
  const profileBtn = document.getElementById('profile-save-btn');

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg('profile-error'); hideMsg('profile-success');
    const label = profileBtn.querySelector('.btn-label'), sending = profileBtn.querySelector('.btn-sending');
    profileBtn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const session = await Auth.getSession();
    const payload = {
      full_name: document.getElementById('full_name').value.trim() || null,
      company_name: document.getElementById('company_name').value.trim() || null,
      phone: document.getElementById('phone').value.trim() || null,
    };

    const { error } = await window.sb.from('profiles').update(payload).eq('id', session.user.id);

    profileBtn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { showMsg('profile-error', 'profile-error-msg', error.message); return; }
    await Auth.getProfile(true);
    showMsg('profile-success');
  });

  /* ── EMAIL ──────────────────────────────────────────────────── */
  const emailForm = document.getElementById('email-form');
  const emailBtn = document.getElementById('email-save-btn');

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg('email-error'); hideMsg('email-success');
    const label = emailBtn.querySelector('.btn-label'), sending = emailBtn.querySelector('.btn-sending');
    emailBtn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const newEmail = document.getElementById('new-email').value.trim();
    const { error } = await window.sb.auth.updateUser({ email: newEmail });

    emailBtn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { showMsg('email-error', 'email-error-msg', error.message); return; }
    showMsg('email-success');
  });

  /* ── PASSWORD ───────────────────────────────────────────────── */
  const passwordForm = document.getElementById('password-form');
  const passwordBtn = document.getElementById('password-save-btn');

  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMsg('password-error'); hideMsg('password-success');

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (newPassword !== confirmPassword) {
      showMsg('password-error', 'password-error-msg', "Passwords don't match.");
      return;
    }

    const label = passwordBtn.querySelector('.btn-label'), sending = passwordBtn.querySelector('.btn-sending');
    passwordBtn.disabled = true; label.style.display = 'none'; sending.style.display = 'inline-flex';

    const { error } = await window.sb.auth.updateUser({ password: newPassword });

    passwordBtn.disabled = false; label.style.display = 'inline'; sending.style.display = 'none';
    if (error) { showMsg('password-error', 'password-error-msg', error.message); return; }
    passwordForm.reset();
    showMsg('password-success');
  });

  /* ── INIT ───────────────────────────────────────────────────── */
  (async function init() {
    const session = await Auth.requireAuth();
    if (!session) return;

    const profile = await Auth.getProfile();
    if (profile) {
      document.getElementById('full_name').value = profile.full_name || '';
      document.getElementById('company_name').value = profile.company_name || '';
      document.getElementById('phone').value = profile.phone || '';
    }
    document.getElementById('new-email').value = session.user.email || '';
  })();
})();
