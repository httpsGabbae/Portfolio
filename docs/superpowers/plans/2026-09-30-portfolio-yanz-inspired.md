# Portfolio Yanz-Inspired Retrofit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Yanz-like gate, display type, marquee, stickers, slider, and counters to the portfolio with original content in the existing cyan theme.

**Architecture:** Retrofit in place in `index.html`, `style.css`, `script.js`. CSS-first motion, rAF lerp for parallax, IntersectionObserver for reveals/counters, no new deps.

**Tech Stack:** Vanilla HTML/CSS/JS + anime.js CDN (guarded), Space Grotesk display type already loaded.

**Spec:** `docs/superpowers/specs/2026-09-30-portfolio-yanz-inspired-design.md`

## Global Constraints

- Do not copy Yanz text, images, fonts, audio, or branding — original content only.
- Keep existing cyan theme vars (`--canvas #05070b`, `--link #22d3ee`), light-theme overrides, theme toggle, chatbot, contact mailto.
- Gate has no sound and is skippable via click, Enter, and Escape.
- Respect `prefers-reduced-motion` and `(hover:hover) and (pointer:fine)` guards for parallax/magnetic/cursor.
- Touch targets >=44px; mobile 360px must work; no console errors.
- Only touch `index.html`, `style.css`, `script.js` (+ this plan/spec).

---

### Task 1: Enter gate (no sound) + display type + numbered heads

**Files:**
- Modify: `index.html:19-32` (insert gate after `<body>`, add noscript style)
- Modify: `style.css:1-60` (append gate + display styles at end of file)
- Modify: `script.js:1-10` (prepend gate controller)

**Interfaces:**
- Consumes: existing `:root` theme vars, `.btn` styles.
- Produces: `#enterGate` dialog, `body.gate-open` lock, `sessionStorage 'gabbae-entered'`, `.display-xl` class, `.sec-index` labels used by Task 2/3.

- [ ] **Step 1: Manual check gate does not exist yet**

Run: `powershell -Command "Select-String -Pattern 'enterGate' -Path index.html,style.css,script.js"`
Expected: no matches (proves work needed).

- [ ] **Step 2: Add gate markup in index.html**

```html
<body>
<div class="enter-gate" id="enterGate" role="dialog" aria-modal="true" aria-label="Enter portfolio">
  <div class="enter-gate-in">
    <p class="mono enter-kicker">GABBAE · FULL-STACK PORTFOLIO</p>
    <h2 class="display-xl">ENTER THE<br>PORTFOLIO</h2>
    <p class="enter-sub">Original systems work — no sound, no autoplay.</p>
    <button class="btn btn-dark btn-lg" id="enterBtn" type="button">Enter the portfolio →</button>
    <p class="mono enter-hint">Press Enter or click to enter · Esc skips</p>
  </div>
</div>
<noscript><style>.enter-gate{display:none!important}</style></noscript>
```

Placement: immediately after `<body>`, before `.scene`. Keep everything else unchanged.

- [ ] **Step 3: Add gate + display CSS at end of style.css**

```css
.enter-gate{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:radial-gradient(800px 500px at 50% 20%,rgba(34,211,238,.14),transparent 60%),var(--canvas);border-bottom:1px solid var(--hairline)}
.enter-gate[hidden]{display:none}
.enter-gate-in{text-align:center;padding:32px;display:grid;gap:14px;justify-items:center}
.display-xl{font-family:var(--font-display);font-size:clamp(48px,8vw,88px);line-height:.95;letter-spacing:-.05em;margin:0}
.enter-kicker{color:var(--link);margin:0;letter-spacing:.14em}
.enter-sub{color:var(--body);margin:0}
.enter-hint{color:var(--mute);margin:0}
body.gate-open{overflow:hidden}
```

- [ ] **Step 4: Add gate JS at top of script.js IIFE**

```js
try {
  const gate = document.getElementById("enterGate");
  const enterBtn = document.getElementById("enterBtn");
  const seen = sessionStorage.getItem("gabbae-entered");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("gate-open");
  function dismissGate() {
    if (!gate || gate.hidden) return;
    gate.hidden = true;
    document.body.classList.remove("gate-open");
    try { sessionStorage.setItem("gabbae-entered", "1"); } catch {}
    document.getElementById("home")?.scrollIntoView({ behavior: "auto" });
  }
  if (gate && (seen || reduceMotion)) { dismissGate(); }
  enterBtn?.addEventListener("click", dismissGate);
  gate?.addEventListener("click", (e) => { if (e.target === gate) dismissGate(); });
  document.addEventListener("keydown", (e) => {
    if (!gate || gate.hidden) return;
    if (e.key === "Enter" || e.key === "Escape") dismissGate();
  });
  setTimeout(() => enterBtn?.focus(), 50);
} catch {}
```

- [ ] **Step 5: Verify gate works**

Run: `powershell -Command "Select-String -Pattern 'enterGate|display-xl|gabbae-entered' -Path index.html,style.css,script.js | Measure-Object | Select-Object -ExpandProperty Count"`
Expected: >=6 matches. Then open `index.html` in browser: gate shows, Enter/click dismisses, reload remembers, reduced-motion skips.

### Task 2: Marquee + numbered sections + hero pills/meta

**Files:**
- Modify: `index.html` hero strip + each `.sec-head` eyebrow
- Modify: `style.css` (append marquee + sec-index + pill pulse)
- Modify: `script.js` (marquee pause on hover/focus)

**Interfaces:**
- Consumes: `#enterGate` dismissed state, `.strip`, `.eyebrow` from Task 1.
- Produces: `.marquee` loop, `.sec-index` numbering, `.avail-pill` used by Task 3 parallax.

- [ ] **Step 1: Add marquee + renumber heads in index.html**

```html
<div class="marquee" aria-label="Available worldwide">
  <div class="marquee-track">
    <span>PHP 8.x • MYSQL • SUPABASE • LARAVEL BASICS • AVAILABLE WORLDWIDE •&nbsp;</span>
    <span aria-hidden="true">PHP 8.x • MYSQL • SUPABASE • LARAVEL BASICS • AVAILABLE WORLDWIDE •&nbsp;</span>
  </div>
</div>
```

Place marquee directly after hero `</section>`. Change eyebrows to `01 / PROJECTS`, `~/about` → `02 / BEHIND THE WORK`, `~/skills` → `03 / WHAT I DO`, add new How-I-work `04 / HOW I WORK` placeholder section header, achievements → `05 / RESULTS`.

- [ ] **Step 2: Add marquee CSS**

```css
.marquee{overflow:hidden;border-top:1px solid var(--hairline);border-bottom:1px solid var(--hairline);background:color-mix(in srgb,var(--canvas-soft) 82%,transparent)}
.marquee-track{display:flex;width:max-content;animation:mq 22s linear infinite;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;color:var(--body);padding:10px 0}
.marquee-track span{white-space:nowrap}
@keyframes mq{to{transform:translateX(-50%)}}
.marquee:hover .marquee-track,.marquee:focus-within .marquee-track{animation-play-state:paused}
@media(prefers-reduced-motion:reduce){.marquee-track{animation:none}}
.sec-index{color:var(--link);letter-spacing:.14em}
.avail-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 12px rgba(74,222,128,.8);animation:pulse 1.8s infinite}
@keyframes pulse{50%{opacity:.4}}
```

- [ ] **Step 3: Verify marquee**

Open page, confirm strip loops seamlessly, pauses on hover, no horizontal scrollbar at 360px.

### Task 3: Stickers + slider + counters + CTA polish

**Files:**
- Modify: `index.html` (hero sticker layer, achievements → slider, CTA block)
- Modify: `style.css` (sticker, slider, big-cta styles)
- Modify: `script.js` (parallax lerp, slider, counters extension)

**Interfaces:**
- Consumes: `.marquee`, `.sec-index`, gate dismissal from Tasks 1-2.
- Produces: working slider with counter, parallax stickers, big CTA. Nothing downstream.

- [ ] **Step 1: Add hero stickers + slider + CTA markup**

```html
<div class="stickers" aria-hidden="true">
  <span class="sticker sticker-a" data-float>OPEN TO WORK •</span>
  <span class="sticker sticker-b" data-float>PHP • MYSQL •</span>
</div>
<div class="slider" aria-roledescription="carousel" aria-label="Results">
  <div class="slides" id="slides"></div>
  <div class="slider-bar"><button id="prevSlide" aria-label="Previous">←</button><span class="mono" id="slideCount">01 / 03</span><button id="nextSlide" aria-label="Next">→</button></div>
</div>
```

Stickers inside hero (absolute), slider replaces achievements `.grid3` inner (move 3 cards as slides via JS or hardcode), CTA section before footer with `GOT A SYSTEM WORTH SHIPPING?` + mailto button.

- [ ] **Step 2: Add sticker/slider/CTA CSS**

```css
.stickers{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.sticker{position:absolute;font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;border:1px solid var(--hairline-strong);border-radius:999px;padding:8px 14px;background:color-mix(in srgb,var(--canvas-soft) 80%,transparent);backdrop-filter:blur(8px)}
.sticker-a{top:18%;right:8%;transform:rotate(8deg)}
.sticker-b{bottom:16%;left:6%;transform:rotate(-6deg)}
@media(hover:none),(pointer:coarse){.sticker-b{display:none}}
.slider{overflow:hidden}.slides{display:flex;transition:transform .45s cubic-bezier(.21,1.02,.73,1)}.slides .card{min-width:100%}
```

- [ ] **Step 3: Add slider + parallax JS (guarded)**

```js
if (!reduced && matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const floats = [...document.querySelectorAll("[data-float]")];
  addEventListener("pointermove", (e) => {
    floats.forEach((el, i) => {
      const f = (i + 1) * 8;
      const x = (e.clientX / innerWidth - .5) * f;
      const y = (e.clientY / innerHeight - .5) * f;
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
  }, { passive: true });
}
```

Slider: index state, `go(i)` sets `slides.style.transform`, updates `#slideCount`, prev/next click, ArrowLeft/Right keys, touchstart/touchend delta >40px. Counters: reuse existing `.stat-n` observer for new stats.

- [ ] **Step 4: Full verification**

Run: `powershell -Command "node --check script.js" 2>&1; echo CSS-OK`
Expected: no syntax error. Manual: gate → marquee → stickers move on desktop but not mobile → slider clicks/keys/swipe update counter → chatbot/theme/contact still work → 360px + reduced-motion clean → no console errors.
