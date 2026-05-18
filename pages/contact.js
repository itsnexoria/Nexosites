/* contact.js — form validation + submission */
const form    = document.getElementById('contact-form');
const btn     = document.getElementById('submit-btn');
const success = document.getElementById('form-success');
if (!form) return;

/* Clear red border on input */
form.querySelectorAll('input,select,textarea').forEach(f => {
  f.addEventListener('input', () => f.style.borderColor = '');
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;

  /* Basic required check */
  form.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim()) { f.style.borderColor = '#ef4444'; valid = false; }
  });

  /* Email format */
  const em = form.querySelector('#email');
  if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) {
    em.style.borderColor = '#ef4444'; valid = false;
  }

  if (!valid) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';

  /* ── TO ENABLE REAL EMAIL DELIVERY ────────────────────────
     Option A — Formspree (free & easy):
       1. Sign up at formspree.io
       2. Create a form, copy your endpoint ID
       3. Uncomment the fetch block below and replace YOUR_ID

     Option B — EmailJS:
       Follow emailjs.com setup and call their SDK here.
  ─────────────────────────────────────────────────────────── */

  // Simulated success (remove timeout and use real fetch below)
  await new Promise(r => setTimeout(r, 1500));

  /*
  // Real Formspree example:
  const res = await fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    alert('Something went wrong. Email us directly at griesel050@gmail.com');
    return;
  }
  */

  form.style.display = 'none';
  success.style.display = 'flex';
});
