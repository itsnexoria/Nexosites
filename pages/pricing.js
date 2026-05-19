/* pricing.js — currency toggle + live exchange rate */
(async function () {
  const btnZar  = document.getElementById('btn-zar');
  const btnUsd  = document.getElementById('btn-usd');
  const rateEl  = document.getElementById('rate-display');
  if (!btnZar || !btnUsd) return;

  /* Try to fetch live USD/USD rate — fallback to 18.50 */
  let rate = 18.50;
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data?.rates?.USD) {
      rate = parseFloat(data.rates.USD.toFixed(2));
    }
  } catch (_) { /* use fallback */ }

  if (rateEl) rateEl.textContent = `R${rate.toFixed(2)}`;

  function setCurrency(cur) {
    const isUsd = cur === 'usd';
    document.body.classList.toggle('usd', isUsd);
    btnZar.classList.toggle('active', !isUsd);
    btnUsd.classList.toggle('active', isUsd);
    btnZar.setAttribute('aria-pressed', !isUsd);
    btnUsd.setAttribute('aria-pressed', isUsd);
    localStorage.setItem('nexo-currency', cur);
  }

  btnZar.addEventListener('click', () => setCurrency('zar'));
  btnUsd.addEventListener('click', () => setCurrency('usd'));

  /* Restore last preference */
  const saved = localStorage.getItem('nexo-currency');
  if (saved) setCurrency(saved);
})();
