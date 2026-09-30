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
    $$(".step").forEach((el) => { el.style.opacity = "1"; });
    if (label) label.textContent = "09 / 09";
    return;
  }

  if (reduced) {
    gsap.set(".mask-in", { yPercent: 0 });
    gsap.set(".hero-fade", { opacity: 1, y: 0 });
    gsap.set(".shot", { autoAlpha: 1 });
    gsap.set(".about-cell,.svc,.reveal-line", { opacity: 1, y: 0 });
    gsap.set(".step", { opacity: 1 });
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
  $$(".svc").forEach((row) => {
    gsap.fromTo(row, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 88%" },
    });
  });
  $$(".step").forEach((step) => {
    gsap.fromTo(step, { opacity: 0.22 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: step, start: "top 78%", end: "top 32%", scrub: true },
    });
  });
  gsap.fromTo(".contact .mask-in", { yPercent: 110 }, {
    yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12,
    scrollTrigger: { trigger: ".contact", start: "top 72%" },
  });
})();
