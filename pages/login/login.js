/* login.js — NexoSites */
(function () {
  const form      = document.getElementById('login-form');
  const btn       = document.getElementById('login-btn');
  const btnLabel  = btn.querySelector('.btn-label');
  const btnSending= btn.querySelector('.btn-sending');
  const errBox    = document.getElementById('login-error');
  const errMsg    = document.getElementById('login-error-msg');

  function showError(msg) {
    errMsg.textContent = msg;
    errBox.style.display = 'flex';
  }

  async function redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    const profile = await Auth.getProfile(true);
    if (next && next.startsWith('/')) { window.location.href = next; return; }
    window.location.href = (profile && profile.role === 'admin') ? '/pages/admin/' : '/pages/dashboard/';
  }

  // If already logged in, skip straight to dashboard
  (async () => {
    const session = await Auth.getSession();
    if (session) redirectAfterLogin();
  })();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.style.display = 'none';
    btn.disabled = true;
    btnLabel.style.display = 'none';
    btnSending.style.display = 'inline-flex';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { error } = await window.sb.auth.signInWithPassword({ email, password });

    if (error) {
      showError(error.message || 'Could not log in. Check your email and password.');
      btn.disabled = false;
      btnLabel.style.display = 'inline';
      btnSending.style.display = 'none';
      return;
    }

    await redirectAfterLogin();
  });
})();
