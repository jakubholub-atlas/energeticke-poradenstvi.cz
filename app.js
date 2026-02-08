// Active nav highlighting
(function(){
  const path = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    // handle relative links
    const full = new URL(href, location.origin).pathname.replace(/\/+$/, "");
    if (full === path) a.classList.add("active");
  });
})();

// Simple calculators
function czk(n){
  return new Intl.NumberFormat("cs-CZ", { style:"currency", currency:"CZK", maximumFractionDigits:0 }).format(n);
}

function calcEnergyCost(){
  const kwh = Number(document.getElementById("kwh")?.value || 0);
  const price = Number(document.getElementById("price")?.value || 0);
  const months = Number(document.getElementById("months")?.value || 12);

  const yearly = kwh * price;
  const monthly = yearly / Math.max(months, 1);

  const out = document.getElementById("calcOut");
  if (!out) return;

  out.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="n">${czk(yearly)}</div><div class="t">Odhad ročních nákladů</div></div>
      <div class="kpi"><div class="n">${czk(monthly)}</div><div class="t">Odhad měsíčních nákladů</div></div>
      <div class="kpi"><div class="n">${kwh.toLocaleString("cs-CZ")}</div><div class="t">Spotřeba (kWh/rok)</div></div>
    </div>
    <p class="small" style="margin-top:10px">
      Pozn.: Jde o orientační výpočet bez stálých plateb, distribučních sazeb a případných poplatků. Pro přesnější výsledek doplníme tarif a region.
    </p>
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calcBtn");
  if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); calcEnergyCost(); });
});
