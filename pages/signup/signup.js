/* signup.js — NexoSites */
(function () {
  const form       = document.getElementById('signup-form');
  const btn        = document.getElementById('signup-btn');
  const btnLabel   = btn.querySelector('.btn-label');
  const btnSending = btn.querySelector('.btn-sending');
  const errBox     = document.getElementById('signup-error');
  const errMsg     = document.getElementById('signup-error-msg');
  const successBox = document.getElementById('signup-success');

  function showError(msg) {
    errMsg.textContent = msg;
    errBox.style.display = 'flex';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.style.display = 'none';
    successBox.style.display = 'none';
    btn.disabled = true;
    btnLabel.style.display = 'none';
    btnSending.style.display = 'inline-flex';

    const full_name = document.getElementById('full_name').value.trim();
    const company_name = document.getElementById('company_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { data, error } = await window.sb.auth.signUp({
      email, password,
      options: { data: { full_name } }
    });

    if (error) {
      showError(error.message || 'Could not create your account.');
      btn.disabled = false;
      btnLabel.style.display = 'inline';
      btnSending.style.display = 'none';
      return;
    }

    // If a company name was provided, save it to the profile once the row exists.
    if (company_name && data.user) {
      try {
        await window.sb.from('profiles').update({ company_name }).eq('id', data.user.id);
      } catch (_) { /* profile trigger may not have run yet — non-critical */ }
    }

    // If Supabase has email confirmation ON, there's no session yet.
    if (!data.session) {
      successBox.style.display = 'flex';
      form.reset();
      btn.disabled = false;
      btnLabel.style.display = 'inline';
      btnSending.style.display = 'none';
      return;
    }

    window.location.href = '/pages/dashboard/';
  });
})();
