/* home.js — counter animation only, no heavy particle loops */
(() => {
  const counters = document.querySelectorAll('.counter[data-to]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.to;
      let cur = 0;
      const step = target / (1400 / 16);
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
})();

/* ── TESTIMONIALS (loaded from Supabase) ──────────────────────── */
(async () => {
  const grid = document.getElementById('testi-grid');
  if (!grid || !window.sb) return;

  function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }
  function initials(name) { return (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(); }

  const { data, error } = await window.sb
    .from('testimonials').select('*').order('display_order', { ascending: true });

  if (error || !data || !data.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = data.map((t, i) => `
    <article class="testi-card card tilt-card reveal delay-${Math.min(i, 5)}" itemprop="itemListElement" itemscope itemtype="https://schema.org/Review">
      <div class="testi-stars" aria-label="${t.rating} out of 5 stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <blockquote class="testi-quote" itemprop="reviewBody">"${escapeHtml(t.quote)}"</blockquote>
      <div class="testi-author" itemprop="author" itemscope itemtype="https://schema.org/Person">
        <div class="testi-av" aria-hidden="true">${initials(t.author_name)}</div>
        <div><strong itemprop="name">${escapeHtml(t.author_name)}</strong><small>${escapeHtml(t.author_detail || '')}</small></div>
      </div>
    </article>
  `).join('');

  const els = grid.querySelectorAll('.reveal');
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io2.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io2.observe(el));

  // Structured data: reviews + aggregate rating, built from the same live data
  const avgRating = (data.reduce((sum, t) => sum + t.rating, 0) / data.length).toFixed(1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "NexoSites",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": data.length
    },
    "review": data.map(t => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": t.author_name },
      "reviewRating": { "@type": "Rating", "ratingValue": t.rating, "bestRating": 5 },
      "reviewBody": t.quote
    }))
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
})();
