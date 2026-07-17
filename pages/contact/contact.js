/* ================================================================
   contact.js — NexoSites
   Handles UI enhancements on top of Formspree SDK
   ================================================================ */

(function () {
  const form      = document.getElementById('contact-form');
  const submitBtn = form?.querySelector('[data-fs-submit-btn]');
  const successEl = form?.parentElement?.querySelector('[data-fs-success]');
  const errorEl   = form?.parentElement?.querySelector('[data-fs-error]');

  if (!form || !submitBtn) return;

  const btnLabel   = submitBtn.querySelector('.btn-label');
  const btnSending = submitBtn.querySelector('.btn-sending');

  /* ── Show spinner while submitting ─────────────────────────── */
  form.addEventListener('submit', () => {
    if (btnLabel)   btnLabel.style.display   = 'none';
    if (btnSending) btnSending.style.display = 'inline-flex';
  });

  /* ── Watch for SDK state changes via DOM mutations ──────────── */
  const observer = new MutationObserver(() => {

    /* Success: SDK sets display:block on [data-fs-success] */
    if (successEl && successEl.style.display !== 'none') {
      form.style.display = 'none';           // hide the form
      successEl.style.display = 'flex';      // ensure flex layout
      if (btnLabel)   btnLabel.style.display   = 'inline';
      if (btnSending) btnSending.style.display = 'none';
    }

    /* Error: SDK sets display:block on [data-fs-error] */
    if (errorEl && errorEl.style.display !== 'none') {
      errorEl.style.display = 'flex';
      if (btnLabel)   btnLabel.style.display   = 'inline';
      if (btnSending) btnSending.style.display = 'none';
      submitBtn.disabled = false;
    }

    /* Field errors: highlight red border on aria-invalid inputs */
    form.querySelectorAll('[data-fs-field]').forEach(field => {
      const invalid = field.getAttribute('aria-invalid') === 'true';
      field.style.borderColor = invalid ? 'var(--pink)' : '';
      field.style.boxShadow   = invalid ? '0 0 0 3px rgba(239,68,68,.22)' : '';
    });
  });

  /* Observe the whole form wrapper for any DOM/style changes */
  const wrapper = form.closest('.contact-form-wrap') || form.parentElement;
  observer.observe(wrapper, {
    attributes: true,
    attributeFilter: ['style'],
    childList: true,
    subtree: true
  });

  /* ── Clear field error styles on user input ─────────────────── */
  form.querySelectorAll('[data-fs-field]').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      field.removeAttribute('aria-invalid');
    });
  });

})();
