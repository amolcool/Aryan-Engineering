/* Machine finder wizard + fuel savings calculator */
(function () {
  "use strict";
  var WA = "https://wa.me/919075416505?text=";

  /* ---------- Machine finder ---------- */
  var wiz = document.getElementById("machineWizard");
  if (wiz) {
    var JOBS = {
      fuel:  { machines: ["Wood Pellet Machine", "Biomass Pellet Machine"], filter: "green" },
      heat:  { machines: ["Wood Pellet Burner", "Pellet Fired Equipment", "Biomass Stove"], filter: "green" },
      dry:   { machines: ["Hot Air Dryer", "Silica Sand Dryer", "Dal Mill Dryer"], filter: "thermal" },
      fry:   { machines: ["Batch Fryer", "Namkeen Bhati"], filter: "food" },
      steam: { machines: ["Industrial Boiler"], filter: "thermal" },
      metal: { machines: ["Aluminium Melting Furnace", "Forging Furnace"], filter: "metal" }
    };
    var pick = { job: null, scale: null, fuel: null };

    function goStep(n) {
      wiz.dataset.wstep = n;
      wiz.querySelectorAll(".wstep").forEach(function (s) {
        s.classList.toggle("is-on", Number(s.dataset.step) === n);
      });
    }
    function showResult() {
      var job = JOBS[pick.job];
      var all = window.aryanProducts || [];
      var html = "";
      job.machines.forEach(function (name) {
        var p = all.filter(function (x) { return x.name === name; })[0];
        html += '<div class="wreco"><b>' + name + "</b><p>" + (p ? p.desc : "") + "</p></div>";
      });
      document.getElementById("wizardResult").innerHTML = html;
      var msg = "Hi Aryan Engineers, based on my requirement I am interested in: " +
        job.machines.join(", ") + ". Operation size: " + pick.scale +
        ". Current fuel: " + pick.fuel + ". Please share specifications and pricing.";
      document.getElementById("wizardWA").href = WA + encodeURIComponent(msg);
      goStep(3);
    }
    wiz.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.job)   { pick.job = b.dataset.job;     goStep(1); }
      if (b.dataset.scale) { pick.scale = b.dataset.scale; goStep(2); }
      if (b.dataset.fuel)  { pick.fuel = b.dataset.fuel;   showResult(); }
      if (b.id === "wizardRestart") goStep(0);
      if (b.id === "wizardView") {
        var f = document.querySelector('[data-filter="' + JOBS[pick.job].filter + '"]');
        if (f) f.click();
        document.getElementById("productGrid").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* ---------- Savings calculator (figures in Lakhs / Crores) ---------- */
  var spend = document.getElementById("calcSpend");
  if (spend) {
    /* ponytail: flat savings ratios vs biomass pellets from typical fuel prices;
       refine with a per-fuel calorific model if the client wants exact numbers */
    var SAVE = { "Diesel": 0.50, "LPG": 0.45, "Furnace Oil": 0.40, "Coal": 0.15 };
    var fuel = document.getElementById("calcFuel"),
        out = document.getElementById("calcSpendOut"),
        res = document.getElementById("calcResult"),
        wa = document.getElementById("calcWA");
    var shown = 0, raf;

    function fmtLakh(v) {
      return v >= 1e7 ? "₹ " + (v / 1e7).toFixed(2) + " Cr" : "₹ " + (v / 1e5).toFixed(1) + " Lakh";
    }
    function animateTo(target) {
      cancelAnimationFrame(raf);
      var from = shown, t0 = performance.now();
      (function step(t) {
        var k = Math.min((t - t0) / 450, 1);
        shown = from + (target - from) * (1 - Math.pow(1 - k, 3));
        res.textContent = fmtLakh(shown) + " / year";
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    function update() {
      var m = Number(spend.value);
      out.textContent = "₹ " + m.toLocaleString("en-IN");
      var annual = m * 12 * SAVE[fuel.value];
      animateTo(annual);
      wa.href = WA + encodeURIComponent(
        "Hi Aryan Engineers, I currently spend about ₹" + m.toLocaleString("en-IN") +
        " per month on " + fuel.value +
        ". Please assess my exact savings with a pellet-fired system and share options.");
    }
    spend.addEventListener("input", update);
    fuel.addEventListener("change", update);
    update();
  }
})();

/* ---------- Exploded machine diagram (hero) ---------- */
(function () {
  var drawing = document.querySelector(".machine-drawing");
  if (!drawing) return;
  var PARTS = {
    "part-frame":   ["Support frame", "Carries the whole machine and takes the structural load off the shell."],
    "part-roof":    ["Top enclosure", "Closes the casing and guides flue gases toward the exhaust."],
    "part-core":    ["Thermal core", "Where fuel burns. This is the heart that generates your process heat."],
    "part-panel":   ["Heat-transfer panel", "Moves heat from the core into your air, water or product line."],
    "part-exhaust": ["Exhaust stack", "Vents cooled flue gases safely above the plant."],
    "part-blower":  ["Air blower", "Feeds controlled combustion air so the flame burns clean and efficient."]
  };
  var hint = document.createElement("span");
  hint.className = "explode-hint";
  hint.textContent = "◈ TAP A PART TO EXPLORE";
  drawing.appendChild(hint);
  var panel = document.createElement("div");
  panel.className = "part-info";
  drawing.appendChild(panel);

  var current = null;
  function clear() {
    current = null;
    drawing.classList.remove("exploring");
    panel.classList.remove("show");
    drawing.querySelectorAll(".assembly-part").forEach(function (g) { g.classList.remove("sel"); });
  }
  function selectPart(g, key) {
    if (current === key) { clear(); return; }
    current = key;
    drawing.classList.add("exploring");
    drawing.querySelectorAll(".assembly-part").forEach(function (x) { x.classList.toggle("sel", x === g); });
    panel.innerHTML = "<b>" + PARTS[key][0] + "</b><p>" + PARTS[key][1] + "</p><span>TAP AGAIN TO CLOSE ×</span>";
    panel.classList.add("show");
  }
  Object.keys(PARTS).forEach(function (key) {
    var g = drawing.querySelector("." + key);
    if (!g) return;
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", PARTS[key][0]);
    g.addEventListener("click", function (e) { e.stopPropagation(); selectPart(g, key); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectPart(g, key); } });
  });
  drawing.addEventListener("click", function (e) { if (!e.target.closest(".assembly-part")) clear(); });
})();

/* ---------- Smart CTA bar after 60% scroll ---------- */
(function () {
  var wizard = document.getElementById("machineWizard");
  if (!wizard) return;
  var engaged = false, shown = false;
  try { engaged = sessionStorage.getItem("ae-cta-done") === "1"; } catch (e) {}
  wizard.addEventListener("click", function () { engaged = true; dismiss(); });

  var bar = document.createElement("div");
  bar.className = "smart-cta";
  bar.innerHTML = '<button type="button" class="smart-cta__go">Not sure which machine? <b>Answer 3 quick questions →</b></button><button type="button" class="smart-cta__x" aria-label="Dismiss">×</button>';
  document.body.appendChild(bar);

  function dismiss() {
    bar.classList.remove("show");
    try { sessionStorage.setItem("ae-cta-done", "1"); } catch (e) {}
  }
  bar.querySelector(".smart-cta__x").addEventListener("click", function () { engaged = true; dismiss(); });
  bar.querySelector(".smart-cta__go").addEventListener("click", function () {
    engaged = true; dismiss();
    var r = document.getElementById("wizardRestart"); if (r) r.click();
    wizard.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  addEventListener("scroll", function () {
    if (shown || engaged) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0 && scrollY / max > 0.6) { shown = true; bar.classList.add("show"); }
  }, { passive: true });
})();
