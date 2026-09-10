/* Cinematic layer: canvas particle journey (biomass → pellets → fire),
   word-by-word title reveals, 3D card tilt, magnetic buttons. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 1. Particle journey ================= */
  var stage = document.querySelector(".bio-stage");
  var section = document.querySelector(".biofuel");
  if (stage && !reduce) {
    var canvas = document.createElement("canvas");
    canvas.className = "bio-canvas";
    stage.insertBefore(canvas, stage.querySelector(".bio-system"));
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);
    var nodes = [], vertical = false;
    var pointer = { x: -9999, y: -9999 };
    var running = false, raf = 0, lastScroll = scrollY, rush = 0;

    function measure() {
      var r = stage.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      nodes = [].slice.call(stage.querySelectorAll(".bio-object")).map(function (el) {
        var b = el.getBoundingClientRect();
        return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 };
      });
      vertical = nodes.length === 3 && Math.abs(nodes[2].y - nodes[0].y) > Math.abs(nodes[2].x - nodes[0].x);
    }

    /* travellers move along node0 → node1 → node2, then become sparks */
    var COUNT = (innerWidth < 700 ? 130 : 260);
    var parts = [], sparks = [], pulses = [];
    function newPart(t) {
      return { t: t !== undefined ? t : Math.random() * -0.15,
               v: 0.0009 + Math.random() * 0.0011,
               off: (Math.random() - 0.5) * 34,
               s: 1.5 + Math.random() * 2.6,
               seed: Math.random() * 6.28 };
    }
    for (var i = 0; i < COUNT; i++) parts.push(newPart(Math.random()));

    function pathPoint(t, off, seed) {
      var a, b, k;
      if (t < 0.5) { a = nodes[0]; b = nodes[1]; k = t * 2; }
      else { a = nodes[1]; b = nodes[2]; k = (t - 0.5) * 2; }
      var x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
      var sway = Math.sin(t * 14 + seed) * (8 + Math.abs(off) * 0.4);
      if (vertical) x += off * 0.5 + sway; else y += off * 0.5 + sway;
      return { x: x, y: y };
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      var speedMul = 1 + rush; rush *= 0.94;
      var paused = section.classList.contains("bio-paused");

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (!paused) p.t += p.v * speedMul;
        if (p.t > 1) { spawnSpark(); parts[i] = newPart(); continue; }
        if (p.t < 0) continue;
        var pt = pathPoint(p.t, p.off, p.seed);
        /* pointer repulsion */
        var dx = pt.x - pointer.x, dy = pt.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 8100) { var f = (90 - Math.sqrt(d2)) / 90 * 26; var d = Math.sqrt(d2) || 1; pt.x += dx / d * f; pt.y += dy / d * f; }

        if (p.t < 0.5) { /* raw biomass: tumbling chips */
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(p.seed + p.t * 9);
          ctx.fillStyle = ["#9c7a4b", "#87a35d", "#8d8a70"][i % 3]; /* wood, leaf, shell/waste */
          ctx.globalAlpha = Math.min(p.t * 8, 0.85);
          ctx.fillRect(-p.s, -p.s * 0.45, p.s * 2, p.s * 0.9);
          ctx.restore();
        } else { /* densified pellets: tight glowing capsules */
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = "#d9a05b";
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.s * 0.75, 0, 6.28);
          ctx.fill();
        }
      }

      /* fire sparks at the burner */
      ctx.globalCompositeOperation = "lighter";
      for (var j = sparks.length - 1; j >= 0; j--) {
        var s = sparks[j];
        if (!paused) { s.x += s.vx; s.y += s.vy; s.vy -= 0.05; s.life -= 0.016; }
        if (s.life <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.life > 0.55 ? "#ffd27a" : "#f2622e";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life + 0.4, 0, 6.28);
        ctx.fill();
      }
      /* selection pulse rings */
      for (var q = pulses.length - 1; q >= 0; q--) {
        var u = pulses[q]; u.r += 2.4; u.a -= 0.02;
        if (u.a <= 0) { pulses.splice(q, 1); continue; }
        ctx.globalAlpha = u.a;
        ctx.strokeStyle = "#e8c07a";
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(u.x, u.y, u.r, 0, 6.28); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(tick);
    }
    function spawnSpark() {
      if (sparks.length > 90) return;
      var n = nodes[2];
      sparks.push({ x: n.x + (Math.random() - 0.5) * 26, y: n.y + (Math.random() - 0.5) * 14,
                    vx: (Math.random() - 0.5) * 0.7, vy: -0.4 - Math.random() * 0.9,
                    r: 1.2 + Math.random() * 2.2, life: 0.7 + Math.random() * 0.3 });
    }

    /* run only while visible */
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; measure(); raf = requestAnimationFrame(tick); }
        else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
      });
    }, { threshold: 0.05 }).observe(stage);

    addEventListener("resize", function () { if (running) measure(); });
    addEventListener("scroll", function () {
      rush = Math.min(Math.abs(scrollY - lastScroll) * 0.02, 2.2);
      lastScroll = scrollY;
    }, { passive: true });
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    stage.addEventListener("pointerleave", function () { pointer.x = pointer.y = -9999; });
    /* burst ring when a stage is selected (tap or scroll-scrub) */
    document.querySelectorAll("[data-bio]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = nodes[Number(b.dataset.bio)];
        if (n) pulses.push({ x: n.x, y: n.y, r: 10, a: 0.6 });
      });
    });
  }

  /* ================= 2. Word-by-word title reveals ================= */
  if (!reduce) {
    var titles = document.querySelectorAll(".bio-heading h1, .assembly-title, .section__title");
    titles.forEach(function (h) {
      var i = 0;
      h.querySelectorAll(":scope > br").forEach(function () {}); /* keep structure */
      function wrap(node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement("span");
            s.className = "w-reveal"; s.style.setProperty("--wi", i++);
            s.textContent = w;
            frag.appendChild(s);
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === 1 && node.tagName !== "BR") {
          [].slice.call(node.childNodes).forEach(wrap);
        }
      }
      [].slice.call(h.childNodes).forEach(wrap);
    });
    var wio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("words-in"); wio.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    titles.forEach(function (h) { wio.observe(h); });
  }

  /* ================= 3. 3D tilt on product cards + magnetic buttons ================= */
  if (!reduce && matchMedia("(hover:hover)").matches) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest(".pcard");
      if (card) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
        card.style.transform = "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
      }
      var btn = e.target.closest(".btn--primary");
      if (btn) {
        var b = btn.getBoundingClientRect();
        btn.style.translate = ((e.clientX - b.left - b.width / 2) * 0.12) + "px " + ((e.clientY - b.top - b.height / 2) * 0.22) + "px";
      }
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var card = e.target.closest(".pcard");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
      var btn = e.target.closest(".btn--primary");
      if (btn && !btn.contains(e.relatedTarget)) btn.style.translate = "";
    }, { passive: true });
  }
})();

/* ================= 4. Rising embers behind the savings calculator ================= */
(function () {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var host = document.querySelector(".savings");
  if (!host) return;
  var canvas = document.createElement("canvas");
  canvas.className = "ember-canvas";
  host.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = Math.min(devicePixelRatio || 1, 2);
  var N = innerWidth < 700 ? 24 : 46, embers = [], running = false, raf = 0;

  function measure() {
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function reset(e, anywhere) {
    e.x = Math.random() * W;
    e.y = anywhere ? Math.random() * H : H + 10;
    e.vy = 0.25 + Math.random() * 0.55;
    e.r = 0.8 + Math.random() * 1.9;
    e.seed = Math.random() * 6.28;
    e.a = 0.22 + Math.random() * 0.5;
  }
  for (var i = 0; i < N; i++) { var e = {}; reset(e, true); embers.push(e); }

  function tick(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < embers.length; i++) {
      var e = embers[i];
      e.y -= e.vy;
      e.x += Math.sin(t * 0.001 + e.seed) * 0.35;
      if (e.y < -10) reset(e);
      var flick = 0.6 + 0.4 * Math.sin(t * 0.006 + e.seed * 7);
      ctx.globalAlpha = e.a * flick;
      ctx.fillStyle = e.r > 1.8 ? "#f2b76b" : "#ed713b";
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.28); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(tick);
  }
  new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (x.isIntersecting && !running) { running = true; measure(); raf = requestAnimationFrame(tick); }
      else if (!x.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
  }, { threshold: 0.05 }).observe(host);
  addEventListener("resize", function () { if (running) measure(); });
})();

/* ================= 5. Heat-shimmer filter for product renders ================= */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var d = document.createElement("div");
  d.setAttribute("aria-hidden", "true");
  d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><filter id="heatShimmer" x="-10%" y="-10%" width="120%" height="120%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="4" result="n">' +
    '<animate attributeName="baseFrequency" values="0.012 0.045;0.017 0.07;0.012 0.045" dur="2.2s" repeatCount="indefinite"/>' +
    '</feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
  document.body.appendChild(d);
})();
