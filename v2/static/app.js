/* Static v2 portfolio engine. GSAP + ScrollTrigger + Lenis via CDN.
   If a CDN fails, content stays visible and anchors work natively. */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";
  if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (single clock on GSAP ticker) ---------- */
  let scrollTo = (t) => {
    if (typeof t === "number") window.scrollTo({ top: t, behavior: reduced ? "auto" : "smooth" });
    else if (t instanceof Element) t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  if (hasGsap && hasST && hasLenis && !reduced) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    ScrollTrigger.config({ ignoreMobileResize: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    scrollTo = (target) => lenis.scrollTo(target, { offset: 0 });
    window.__lenisTo = (el) => lenis.scrollTo(el);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href"));
      if (el) { e.preventDefault(); lenis.scrollTo(el); }
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }
    setTimeout(() => ScrollTrigger.refresh(), 400);
  }

  /* ---------- Theme (dark default, persisted) ---------- */
  const themeBtn = $("#themeBtn");
  const paintTheme = () => {
    const light = document.documentElement.dataset.theme === "light";
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
      $("#iconSun").style.display = light ? "none" : "";
      $("#iconMoon").style.display = light ? "" : "none";
    }
  };
  try {
    if (localStorage.getItem("v2-theme") === "light") document.documentElement.dataset.theme = "light";
  } catch (_) {}
  paintTheme();
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const light = document.documentElement.dataset.theme !== "light";
    if (light) document.documentElement.dataset.theme = "light";
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("v2-theme", light ? "light" : "dark"); } catch (_) {}
    paintTheme();
  });

  /* ---------- Nav state + mobile menu ---------- */
  const nav = $("#nav");
  const onScrollPos = (y) => nav && nav.classList.toggle("scrolled", y > 40);
  window.addEventListener("scroll", () => onScrollPos(window.scrollY), { passive: true });
  onScrollPos(window.scrollY);
  const burger = $("#burger"), menu = $("#mobileMenu");
  const bOpen = $("#burgerOpen"), bClose = $("#burgerClose");
  const setMenu = (open) => {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    bOpen.style.display = open ? "none" : "";
    bClose.style.display = open ? "" : "none";
  };
  burger.addEventListener("click", () => setMenu(menu.hidden));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Custom cursor ---------- */
  if (fine && !reduced) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    let x = -100, y = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", (e) => {
      document.body.classList.add("cursor-on");
      x = e.clientX; y = e.clientY;
      const view = e.target.closest && e.target.closest("[data-cursor='view']");
      const link = e.target.closest && e.target.closest("a,button");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-link", !!link && !view);
    }, { passive: true });
    (function loop() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  } else {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  /* ---------- Footer / progress helpers ---------- */
  $("#toTop").addEventListener("click", () => scrollTo(0));
  const label = $("#progressLabel"), fill = $("#progressFill");

  if (!hasGsap || !hasST) {
    // CDN fallback: everything visible, native scroll.
    $$(".mask-in").forEach((el) => { el.style.transform = "none"; });
    $$(".shot").forEach((el) => { el.style.opacity = "1"; el.style.visibility = "visible"; });
    $$(".meter i").forEach((el) => { el.style.width = el.dataset.w + "%"; });
    if (label) label.textContent = "09 / 09";
    return;
  }

  if (reduced) {
    gsap.set(".mask-in", { yPercent: 0 });
    gsap.set(".hero-fade", { opacity: 1, y: 0 });
    gsap.set(".shot", { autoAlpha: 1 });
    gsap.set(".about-cell,.skill,.phase,.reveal-line", { opacity: 1, y: 0 });
    gsap.set(".meter i", { width: (i, el) => el.dataset.w + "%" });
    if (label) label.textContent = "09 / 09";
    return;
  }

  /* ---------- Progress rail ---------- */
  gsap.to(fill, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: 0, end: "max", scrub: 0.3 },
  });
  const secs = $$("main [data-sec]");
  secs.forEach((sec, i) => {
    ScrollTrigger.create({
      trigger: sec, start: "top center", end: "bottom center",
      onToggle: (self) => {
        if (self.isActive && label) {
          const p = (n) => String(n).padStart(2, "0");
          label.textContent = p(i + 1) + " / " + p(secs.length);
        }
      },
    });
  });

  /* ---------- Hero entrance + parallax exit ---------- */
  gsap.fromTo(".hero .mask-in", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12, delay: 0.15 });
  gsap.fromTo(".hero-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.7 });
  gsap.to(".hero-core", {
    yPercent: -14, opacity: 0.15, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-bg", {
    yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* ---------- Drifting display type ---------- */
  $$(".drift").forEach((el, i) => {
    gsap.fromTo(el, { xPercent: i % 2 ? 6 : -14 }, {
      xPercent: i % 2 ? -14 : 6, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- Pinned showcase (desktop) / stacked (mobile) ---------- */
  const mm = gsap.matchMedia();
  const count = $("#stageCount");
  mm.add("(min-width: 901px)", () => {
    const shots = $$("[data-shot]");
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: "#work", start: "top top", end: "+=" + shots.length * 900,
        scrub: 1, pin: "#stagePin",
        onUpdate: (self) => {
          const k = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
          if (count) count.textContent = "0" + (k + 1) + " / 0" + shots.length;
        },
      },
    });
    shots.forEach((shot, i) => {
      const visual = $(".visual", shot);
      const num = $(".shot-num", shot);
      const lines = $$(".shot-copy > *", shot);
      tl.fromTo(shot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 });
      tl.fromTo(visual, { scale: 0.88, y: 40, rotate: -1 }, { scale: 1, y: 0, rotate: 0, duration: 1.1 }, "<");
      tl.fromTo(num, { opacity: 0.2 }, { opacity: 1, duration: 0.8 }, "<");
      tl.fromTo(lines, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, "<+0.1");
      if (i < shots.length - 1) {
        tl.to(lines, { y: -50, opacity: 0, duration: 0.45, stagger: 0.04 }, "+=0.45");
        tl.to(visual, { scale: 0.92, y: -30, duration: 0.45 }, "<");
        tl.to(shot, { autoAlpha: 0, duration: 0.45 }, "<+0.1");
      }
    });
  });
  mm.add("(max-width: 900px)", () => {
    $$("[data-shot]").forEach((shot) => {
      gsap.fromTo(shot, { opacity: 0, y: 48 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: shot, start: "top 82%" },
      });
      gsap.fromTo($(".visual", shot), { scale: 0.92 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: shot, start: "top bottom", end: "center center", scrub: true },
      });
    });
  });

  /* ---------- Horizontal archive (desktop pin) ---------- */
  mm.add("(min-width: 901px)", () => {
    const track = $("#htrack"), hfill = $("#hfill");
    const dist = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: "#archive", start: "top top", end: () => "+=" + dist(),
        scrub: 1, pin: true, invalidateOnRefresh: true,
        onUpdate: (self) => { if (hfill) hfill.style.transform = "scaleX(" + self.progress + ")"; },
      },
    });
  });

  /* ---------- About / services / process / contact reveals ---------- */
  $$(".about-cell").forEach((cell, i) => {
    gsap.fromTo(cell, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 2) * 0.08,
      scrollTrigger: { trigger: cell, start: "top 86%" },
    });
  });
  gsap.fromTo(".about-big .reveal-line", { opacity: 0.12 }, {
    opacity: 1, stagger: 0.25, ease: "none",
    scrollTrigger: { trigger: ".about-big", start: "top 78%", end: "bottom 45%", scrub: true },
  });
  $$(".skill").forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: (i % 2) * 0.08,
      scrollTrigger: { trigger: card, start: "top 88%" },
    });
    const bar = $(".meter i", card);
    gsap.fromTo(bar, { width: "0%" }, {
      width: bar.dataset.w + "%", duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 85%" },
    });
  });
  $$(".phase").forEach((card, i) => {
    gsap.fromTo(card, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: card, start: "top 88%" },
    });
  });
  gsap.fromTo(".contact .mask-in", { yPercent: 110 }, {
    yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".contact", start: "top 72%" },
  });
})();

/* ---------- Gabbae Bot (same answers as the main portfolio; runs always) ---------- */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.prototype.slice.call(document.querySelectorAll(s));
  const A_STACK = "PHP, Front End, I excel in Github and Supabase. Mostly Full Stack.";
  const A_RATE = "Send me a message and lets talk about it! Scrolling you to the contact section now.";
  const A_WHO = "I am John Aldrin Doruca, a student at Lipa City Colleges studying computer science and aspiring as part of cybersecurity and full stack developer.";
  const msgs = $("#chatMsgs"), form = $("#chatForm"), input = $("#chatInput");
  const widget = $("#chatWidget"), fab = $("#chatFab");
  function addMsg(text, who) {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function answer(q) {
    const t = (q || "").toLowerCase();
    if (/stack|tech|tools|language|supabase|php|frontend|front-end/.test(t)) return { type: "text", text: A_STACK };
    if (/rate|price|cost|magkano|bayad|fee|salary|how much/.test(t)) return { type: "rate", text: A_RATE };
    if (/who are you|sino|your name|yourself|about you|who is/.test(t)) return { type: "text", text: A_WHO };
    if (/educ|school|college|lipa|course|study|bscs/.test(t)) return { type: "text", text: "2nd-year BSCS at Lipa City Colleges, Lipa City PH. Focus: full-stack systems + cybersecurity track." };
    if (/skill/.test(t)) return { type: "text", text: "Top skills: " + A_STACK + " Also MySQL, Bootstrap, Git, Laravel basics." };
    if (/project|work|portfolio|github|repo/.test(t)) return { type: "text", text: "Featured: Final LCC Payroll, FitnessHub gym, LMS Code Compiler (Monaco+Judge0), LearnEngage frontend. See #work — all on github.com/httpsGabbae." };
    if (/hackathon|achiev|award|lead/.test(t)) return { type: "text", text: "3rd placer — department hackathon. Plus shipped 4 school systems end-to-end." };
    if (/contact|email|hire|message|messenger|linkedin/.test(t)) return { type: "contact", text: "Email me at j.doruca109@gmail.com or use the links below — taking you there." };
    if (/hi|hello|hey|kumusta/.test(t)) return { type: "text", text: "Hello! Ask me: What is your stack? / How much is your rate? / Who are you?" };
    return { type: "text", text: "I answer best about stack, rate, or who I am — tap a preset above or type those keywords." };
  }
  function ask(q) {
    if (!q.trim()) return;
    addMsg(q, "user");
    setTimeout(() => {
      const r = answer(q);
      addMsg(r.text, "bot");
      if (r.type === "rate" || r.type === "contact") {
        setTimeout(() => {
          const c = $("#contact");
          if (!c) return;
          if (window.__lenisTo) window.__lenisTo(c);
          else c.scrollIntoView({ behavior: "smooth" });
        }, 900);
      }
    }, 350);
  }
  function openChat() { widget.hidden = false; fab.setAttribute("aria-expanded", "true"); }
  function closeChat() { widget.hidden = true; fab.setAttribute("aria-expanded", "false"); }
  fab.addEventListener("click", () => {
    widget.hidden ? openChat() : closeChat();
    if (!widget.hidden) setTimeout(() => input.focus(), 50);
  });
  $("#chatClose").addEventListener("click", () => { closeChat(); fab.focus(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !widget.hidden) { closeChat(); fab.focus(); }
  });
  $$("[data-q]").forEach((b) => b.addEventListener("click", () => {
    openChat();
    ask(b.dataset.q || "");
    setTimeout(() => input.focus(), 50);
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    ask(q);
  });

  /* ---------- Contact form (demo + mailto fallback) ---------- */
  const cf = $("#contactForm");
  if (cf) cf.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cf.checkValidity()) { cf.reportValidity(); return; }
    const n = $("#cfName").value, m = $("#cfEmail").value, t = $("#cfMsg").value;
    const subject = encodeURIComponent("Portfolio inquiry from " + (n || "visitor"));
    const body = encodeURIComponent((t || "") + "\n\n— " + n + " (" + m + ")");
    $("#cfOk").hidden = false;
    cf.reset();
    window.location.href = "mailto:j.doruca109@gmail.com?subject=" + subject + "&body=" + body;
  });
  const copyBtn = $("#copyEmail");
  if (copyBtn) copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("j.doruca109@gmail.com");
      copyBtn.textContent = "Copied ✓";
      setTimeout(() => { copyBtn.textContent = "Copy email"; }, 1500);
    } catch (_) {}
  });
})();
