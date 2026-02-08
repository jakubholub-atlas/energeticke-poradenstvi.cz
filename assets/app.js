// Aktivní položka menu
(function(){
  const path = location.pathname.replace(/\/+$/, "");
  document.querySelectorAll("[data-nav]").forEach(a=>{
    const href = new URL(a.getAttribute("href"),location.origin)
      .pathname.replace(/\/+$/,"");
    if(href===path){a.classList.add("active");}
  });
})();

// Formát CZK
function czk(n){
  return new Intl.NumberFormat("cs-CZ",{
    style:"currency",currency:"CZK",maximumFractionDigits:0
  }).format(n);
}

// Kalkulačka elektřiny
function calcEnergyCost(){
  const kwh=+document.getElementById("kwh").value||0;
  const price=+document.getElementById("price").value||0;
  const months=+document.getElementById("months").value||12;

  const yearly=kwh*price;
  const monthly=yearly/Math.max(months,1);

  document.getElementById("calcOut").innerHTML=`
    <div class="kpis">
      <div class="kpi"><div class="n">${czk(yearly)}</div><div class="t">Ročně</div></div>
      <div class="kpi"><div class="n">${czk(monthly)}</div><div class="t">Měsíčně</div></div>
      <div class="kpi"><div class="n">${kwh}</div><div class="t">kWh / rok</div></div>
    </div>
    <p style="color:#b8c3e6;margin-top:10px">
      Orientační výpočet bez stálých plateb a distribuce.
    </p>
  `;
}

document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("calcBtn");
  if(btn)btn.addEventListener("click",e=>{
    e.preventDefault();calcEnergyCost();
  });
});
