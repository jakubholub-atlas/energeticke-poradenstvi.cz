const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

const fmtCZK = (n) => {
  if (!isFinite(n)) return "—";
  const rounded = Math.round(n);
  return rounded.toLocaleString("cs-CZ") + " Kč/rok";
};

const setHero = () => {
  // pleasant “living” number
  const base = 12500 + Math.round(Math.random()*8500);
  $("#heroSavings").textContent = fmtCZK(base);
};

const toggleMobile = () => {
  const btn = $(".burger");
  const panel = $(".mobileNav");
  const open = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!open));
  panel.hidden = open;
};

const initMobileNav = () => {
  const btn = $(".burger");
  const panel = $(".mobileNav");
  btn.addEventListener("click", toggleMobile);
  $$(".mobileNav a").forEach(a => a.addEventListener("click", () => {
    // close after click
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }));
};

let commodity = "electricity";

const applyCommodity = (c) => {
  commodity = c;
  $$(".seg__btn").forEach(b => b.classList.toggle("is-active", b.dataset.commodity === c));
  $("#unit").textContent = "MWh";
  // Slightly different placeholder suggestions
  if (c === "electricity") {
    $("#consumption").placeholder = "např. 3.2";
    $("#priceNow").placeholder = "např. 3500";
    $("#priceTarget").placeholder = "např. 3000";
  } else {
    $("#consumption").placeholder = "např. 20";
    $("#priceNow").placeholder = "např. 1600";
    $("#priceTarget").placeholder = "např. 1400";
  }
};

const calc = () => {
  const consumption = parseFloat($("#consumption").value);
  const priceNow = parseFloat($("#priceNow").value);
  const priceTarget = parseFloat($("#priceTarget").value);
  const pref = $("#preference").value;

  if (![consumption, priceNow, priceTarget].every(v => isFinite(v) && v >= 0)) {
    $("#savings").textContent = "Zadej prosím spotřebu i ceny.";
    $("#approach").textContent = "—";
    $("#checklist").textContent = "—";
    return;
  }

  const delta = priceNow - priceTarget;
  const savings = consumption * delta;

  // Recommendation logic (simple but sensible)
  let approach = "";
  if (pref === "stability") approach = "Jistota: fixní cena + kontrola podmínek (indexace, výpovědi).";
  if (pref === "balanced") approach = "Vyváženě: kombinace jistoty a flexibility + hlídání rizik.";
  if (pref === "flex") approach = "Flex: průběžná optimalizace (typicky spot) + limity rizika.";

  let checks = [
    "fixace a výpovědní lhůty",
    "indexace a smluvní pokuty",
    "správná sazba / tarif",
    "rezervovaný příkon a jistič",
  ];

  if (commodity === "gas") checks = [
    "výše spotřeby a odhad",
    "fixace a výpovědní lhůty",
    "indexace a podmínky",
    "platební kalendář a zálohy",
  ];

  $("#savings").textContent = fmtCZK(savings);
  $("#approach").textContent = approach;
  $("#checklist").textContent = checks.join(", ") + ".";

  // Keep hero in sync (nice touch)
  $("#heroSavings").textContent = fmtCZK(Math.max(0, savings));
};

const resetCalc = () => {
  $("#consumption").value = "";
  $("#priceNow").value = "";
  $("#priceTarget").value = "";
  $("#preference").value = "stability";
  $("#savings").textContent = "—";
  $("#approach").textContent = "—";
  $("#checklist").textContent = "—";
  setHero();
};

const initCalc = () => {
  $$(".seg__btn").forEach(btn => {
    btn.addEventListener("click", () => applyCommodity(btn.dataset.commodity));
  });
  $("#btnCalc").addEventListener("click", (e) => { e.preventDefault(); calc(); });
  $("#btnReset").addEventListener("click", (e) => { e.preventDefault(); resetCalc(); });
  applyCommodity("electricity");
};

const initContactForm = () => {
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const type = (data.get("type") || "").toString().trim();
    const msg = (data.get("message") || "").toString().trim();

    const subject = encodeURIComponent("Poptávka – Energetické poradenství");
    const body = encodeURIComponent(
`Dobrý den,

mám zájem o vyhodnocení:

Jméno / firma: ${name}
Email: ${email}
Telefon: ${phone}
Typ: ${type}

Zpráva:
${msg}

Děkuji.`
    );

    // TODO: replace email below with real one
    const to = $("#contactEmail").textContent.trim() || "info@energeticke-poradenstvi.cz";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });

  $("#premiumBtn").addEventListener("click", () => {
    const ta = $("#contactForm textarea");
    if (ta && !ta.value.includes("Premium")) {
      ta.value = (ta.value ? ta.value + "\n\n" : "") + "Premium: ";
      ta.focus();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = String(new Date().getFullYear());
  setHero();
  initMobileNav();
  initCalc();
  initContactForm();
});
