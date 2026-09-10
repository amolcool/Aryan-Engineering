/* ===========================================================
   Aryan Engineers - Site interactions
   =========================================================== */
(function () {
  "use strict";

  var WA_NUMBER = "919075416505";
  var CDN = "https://images.hungama.com/008/7D5/001/";

  /* ---------- Product catalogue ---------- */
  var PRODUCTS = [
    { name: "Industrial Boiler", cat: "thermal", ico: "♨", desc: "Reliable steam generation with high thermal efficiency and built-in safety for process plants." },
    { name: "Hot Air Dryer", cat: "thermal", ico: "♉", desc: "Consistent hot-air drying for food, agro and industrial products with precise temperature control." },
    { name: "Printing Machine HAG", cat: "thermal", ico: "🔥", desc: "Hot air generator engineered for printing and textile drying lines, clean and fuel-efficient." },
    { name: "Silica Sand Dryer", cat: "thermal", ico: "⏳", desc: "High-throughput drying of silica sand to exact moisture specifications." },
    { name: "Batch Fryer", cat: "food", ico: "🍟", desc: "Uniform, high-capacity frying for namkeen, snacks and savouries with consistent quality." },
    { name: "Namkeen Bhati", cat: "food", ico: "🍲", desc: "Robust frying range engineered for continuous commercial namkeen production." },
    { name: "Dal Mill Dryer", cat: "food", ico: "🌾", desc: "Efficient moisture control for pulses, boosting mill yield and grain quality." },
    { name: "Wood Pellet Burner", cat: "green", ico: "🔥", desc: "Automatic pellet-fired burner delivering major savings over oil, gas and diesel." },
    { name: "Wood Pellet Machine", cat: "green", ico: "🪵", desc: "Converts wood, agro waste and cashew shells into high-density fuel pellets for clean energy." },
    { name: "Biomass Pellet Machine", cat: "green", ico: "♻", desc: "Turnkey pelletizing of agro residues and cashew shells at scale." },
    { name: "Biomass Stove", cat: "green", ico: "🌿", desc: "Clean, fuel-efficient biomass burning for commercial kitchens and process heat." },
    { name: "Pellet Fired Equipment", cat: "green", ico: "🔥", desc: "Pellet-fired heating systems for clean, low-cost industrial process heat." },
    { name: "Aluminium Melting Furnace", cat: "metal", ico: "🔥", desc: "Fast, fuel-efficient melting with precise temperature control for foundries." },
    { name: "Forging Furnace", cat: "metal", ico: "🔨", desc: "Uniform heating for forging shops with rapid heat-up and tight control." },
    { name: "Storage Tank", cat: "process", ico: "🛢", desc: "Custom-fabricated tanks for liquids, fuels and process media of any capacity." },
    { name: "Pallet Truck", cat: "process", ico: "🚚", desc: "Heavy-duty material handling for smooth in-plant movement of loads." }
  ];

  /* ---------- Gallery videos (real footage) ---------- */
  var VIDEOS = [
    "WhatsApp_Video_2026-06-07_at_10.17.46.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.20.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.21.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.22.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.23.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.24.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.25.mp4",
    "WhatsApp_Video_2026-06-07_at_10.35.05.mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.21_(1).mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.22_(1).mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.23_(1).mp4",
    "WhatsApp_Video_2026-06-07_at_10.34.24_(1).mp4"
  ];

  function enc(file) { return CDN + file.replace(/\(/g, "%28").replace(/\)/g, "%29"); }
  function waLink(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
  function $(s, c) { return (c || document).querySelector(s); }

  /* ---------- Render products ---------- */
  function renderProducts() {
    var grid = $("#productGrid");
    var sel = $("#product");
    if (!grid) return;
    var html = "";
    PRODUCTS.forEach(function (p, index) {
      html += '<article class="pcard reveal" data-cat="' + p.cat + '" data-index="' + index + '">' +
      '<div class="pcard__top"><span class="pcard__tag">' + catLabel(p.cat) + '</span><svg class="machine-icon" viewBox="0 0 120 95" aria-hidden="true"><path d="M25 27L65 7 100 26 61 47ZM25 27v42l36 20V47m0 42 39-20V26M32 40l21 12v23L32 63ZM69 49l23-12m-23 20 23-12m-23 20 23-12m-23 20 23-12M37 75v13m48-11v13"/><path d="M62 17V4l9-3 7 4v18M35 49l14 8"/><circle cx="43" cy="62" r="3"/></svg><span class="pcard__code">AE / ' + String(index + 1).padStart(2,'0') + '</span></div>' +
      '<div class="pcard__body"><h3>' + p.name + '</h3><p>' + p.desc + '</p><div class="product-actions"><button class="details-btn" data-details="' + index + '">Explore machine ↗</button><button class="shortlist-btn" data-shortlist="' + index + '" aria-label="Shortlist ' + p.name + '" aria-pressed="false">+</button></div></div></article>';
      if (sel) { var o = document.createElement("option"); o.value = p.name; o.textContent = p.name; sel.appendChild(o); }
    });
    window.aryanProducts = PRODUCTS;
    grid.innerHTML = html;
    grid.querySelectorAll(".pcard__btn svg path").forEach(function (pth) {
      pth.setAttribute("fill", "none"); pth.setAttribute("stroke", "currentColor");
      pth.setAttribute("stroke-width", "2"); pth.setAttribute("stroke-linecap", "round"); pth.setAttribute("stroke-linejoin", "round");
    });
  }
  function catLabel(c) {
    return { thermal: "Thermal", food: "Food", green: "Green Energy", metal: "Metallurgy", process: "Process" }[c] || c;
  }

  /* ---------- Product filters ---------- */
  function initFilters() {
    var bar = $("#filters");
    if (!bar) return;
    function applyFilters() {
      var active = bar.querySelector('.is-active');
      var filter = active ? active.dataset.filter : 'all';
      var query = document.querySelector('#machineSearch').value.trim().toLowerCase();
      var count = 0;
      document.querySelectorAll('.pcard').forEach(function(card) {
        var show = (filter === 'all' || card.dataset.cat === filter) && card.querySelector('h3').textContent.toLowerCase().includes(query);
        card.hidden = !show; if(show) count++;
      });
      document.querySelector('#resultCount').textContent = count + ' MACHINES';
      document.querySelector('#emptyProducts').hidden = count > 0;
    }
    bar.addEventListener('click',function(e){var b=e.target.closest('.filter');if(!b)return;bar.querySelectorAll('.filter').forEach(function(x){x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b));});applyFilters();});
    document.querySelector('#machineSearch').addEventListener('input',applyFilters);
  }

  /* ---------- Render gallery ---------- */
  function renderGallery() {
    var grid = $("#galleryGrid");
    if (!grid) return;
    var html = "";
    VIDEOS.forEach(function (v, i) {
      var url = enc(v);
      html +=
        '<div class="gtile" role="button" tabindex="0" aria-label="Play workshop film ' + (i+1) + '" data-src="' + url + '">' +
          '<video muted playsinline preload="metadata" src="' + url + '#t=0.5"></video>' +
          '<div class="gtile__ov"><span class="gtile__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>' +
          '<span class="gtile__label">WORKSHOP / ' + String(i + 1).padStart(2,'0') + '</span>' +
        '</div>';
    });
    grid.innerHTML = html;
  }

  /* ---------- Lightbox (with explicit mute toggle) ---------- */
  function initLightbox() {
    var lb = $("#lightbox"), vid = $("#lightboxVideo"), close = $("#lightboxClose"), mute = $("#lightboxMute");
    if (!lb) return;
    function setMuted(state) { vid.muted = state; lb.classList.toggle("is-muted", state); }
    function openFrom(t) {
      vid.src = t.getAttribute("data-src");
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setMuted(false);              /* open with sound on; user can mute */
      vid.play().catch(function () { setMuted(true); vid.play().catch(function () {}); });
    }
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-src]"); if (!t) return;
      openFrom(t);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var t = document.activeElement;
      if (t && t.hasAttribute && t.hasAttribute("data-src")) { e.preventDefault(); openFrom(t); }
    });
    function shut() {
      lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
      vid.pause(); vid.removeAttribute("src"); vid.load();
      document.body.style.overflow = "";
    }
    if (mute) mute.addEventListener("click", function () { setMuted(!vid.muted); });
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) { if (e.target === lb) shut(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") shut();
      if (e.key === "m" || e.key === "M") setMuted(!vid.muted);
    });
  }

  /* ---------- Theme toggle (light / dark) ---------- */
  function initTheme() {
    var btn = $("#themeToggle"), root = document.documentElement;
    if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "light");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ae-theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = $("#navToggle"), nav = $("#nav");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open"); toggle.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); toggle.classList.remove("open"); });
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  function initHeader() {
    var h = $("#header"), top = $("#toTop");
    function onScroll() {
      if (window.scrollY > 30) h.classList.add("scrolled"); else h.classList.remove("scrolled");
      if (top) { if (window.scrollY > 600) top.classList.add("show"); else top.classList.remove("show"); }
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll(".stat__num");
    if (!nums.length) return;
    var done = false;
    function run() {
      if (done) return; done = true;
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        if (target === 2016 || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target + suffix; return; }
        var start = null, dur = 1000;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    var stats = $("#stats");
    if ("IntersectionObserver" in window && stats) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(stats);
    } else { run(); }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".section, .pcard, .gtile, .industry, .why__card, .about__media, .about__text");
    els.forEach(function (e) { e.classList.add("reveal"); });
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Testimonials carousel ---------- */
  function initTesti() {
    var track = $("#testiTrack"), dots = $("#testiDots");
    if (!track) return;
    var cards = track.children, n = cards.length, i = 0, timer;
    for (var k = 0; k < n; k++) {
      var b = document.createElement("button");
      if (k === 0) b.classList.add("active");
      b.addEventListener("click", (function (idx) { return function () { go(idx); reset(); }; })(k));
      dots.appendChild(b);
    }
    function go(idx) {
      i = (idx + n) % n;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      dots.querySelectorAll("button").forEach(function (d, di) { d.classList.toggle("active", di === i); });
    }
    function reset() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 5500); }
    reset();
  }

  /* ---------- Quote form -> WhatsApp ---------- */
  function initForm() {
    var form = $("#quoteForm"); if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#name"), phone = $("#phone");
      var ok = true;
      [name, phone].forEach(function (f) {
        if (!f.value.trim()) { f.classList.add("invalid"); ok = false; } else { f.classList.remove("invalid"); }
      });
      if (!ok) { $("#formNote").textContent = "Please fill in your name and phone number."; return; }
      var msg = "New enquiry from the Aryan Engineers website%0A%0A" +
        "Name: " + encodeURIComponent(name.value) + "%0A" +
        "Phone: " + encodeURIComponent(phone.value) + "%0A" +
        "Email: " + encodeURIComponent($("#email").value || "-") + "%0A" +
        "Product: " + encodeURIComponent($("#product").value || "-") + "%0A" +
        "Requirement: " + encodeURIComponent($("#message").value || "-");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + msg, "_blank");
      $("#formNote").textContent = "Opening WhatsApp... if it does not open, call us at +91 90754 16505.";

    });
  }

  /* ---------- Year ---------- */
  function initYear() { var y = $("#year"); if (y) y.textContent = new Date().getFullYear(); }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    initFilters();
    renderGallery();
    initLightbox();
    initTheme();
    initNav();
    initHeader();
    initCounters();
    initTesti();
    initForm();
    initYear();
    initReveal();
  });
})();
