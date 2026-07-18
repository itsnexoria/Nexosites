/* faq.js — fetches FAQ items from Supabase and renders an accordion */
(function () {
  function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }

  function wireAccordion() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  function observeReveals(root) {
    const els = root.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  async function init() {
    const list = document.getElementById('faq-list');
    if (!list || !window.sb) return;

    const { data, error } = await window.sb
      .from('faq_items').select('*').order('display_order', { ascending: true });

    if (error) {
      list.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i>Couldn't load FAQs right now.</div>`;
      return;
    }
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><i class="fas fa-circle-question"></i>No FAQs yet.</div>`;
      return;
    }

    list.innerHTML = data.map((item, i) => `
      <div class="faq-item reveal delay-${Math.min(i, 5)}">
        <button class="faq-q" aria-expanded="false">${escapeHtml(item.question)}<i class="fas fa-plus faq-icon"></i></button>
        <div class="faq-a"><p>${escapeHtml(item.answer)}</p></div>
      </div>
    `).join('');

    wireAccordion();
    observeReveals(list);
  }

  init();
})();
