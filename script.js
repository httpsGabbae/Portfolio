// Gabbae portfolio — vanilla JS, no deps
(function () {
  "use strict";
  /* ENTER GATE — no sound, session remember, reduced-motion skip */
  try {
    const gate = document.getElementById("enterGate");
    const enterBtn = document.getElementById("enterBtn");
    if (gate && enterBtn) {
      const seen = sessionStorage.getItem("gabbae-entered");
      const reduceGate = matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.body.classList.add("gate-open");
      const dismissGate = () => {
        if (gate.hidden) return;
        gate.hidden = true;
        document.body.classList.remove("gate-open");
        try { sessionStorage.setItem("gabbae-entered", "1"); } catch {}
      };
      if (seen || reduceGate) dismissGate();
      enterBtn.addEventListener("click", dismissGate);
      gate.addEventListener("click", (e) => { if (e.target === gate) dismissGate(); });
      document.addEventListener("keydown", (e) => {
        if (gate.hidden) return;
        if (e.key === "Enter" || e.key === "Escape") dismissGate();
      });
      setTimeout(() => { if (!gate.hidden) enterBtn.focus(); }, 60);
    }
  } catch {}
  const $ = (s, c = document) => c.querySelector(s),
    $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("#year").textContent = new Date().getFullYear();

  /* THEME — light default, persist, follow OS first visit */
  const root = document.documentElement,
    toggle = $("#themeToggle"),
    iconUse = $("#themeIcon use");
  function paintIcon() {
    const dark = root.dataset.theme === "dark";
    if (iconUse) iconUse.setAttribute("href", dark ? "#i-sun" : "#i-moon");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }
  function setTheme(t) {
    root.dataset.theme = t;
    try {
      localStorage.setItem("gabbae-theme", t);
    } catch {}
    paintIcon();
  }
  try {
    const saved = localStorage.getItem("gabbae-theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
    else
      root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  } catch {
    root.dataset.theme = "light";
  }
  paintIcon();
  toggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    if (navigator.vibrate) navigator.vibrate(8);
  });

  /* MOBILE MENU */
  const menuBtn = $("#menuBtn"),
    mobileMenu = $("#mobileMenu");
  menuBtn?.addEventListener("click", () => {
    const open = mobileMenu.hidden;
    mobileMenu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "✕" : "☰";
  });
  $$("#mobileMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileMenu.hidden = true;
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }),
  );

  /* NAV ACTIVE + BACK-TOP */
  const links = $$(".nav-links a"),
    secs = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const nio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting)
          links.forEach((a) =>
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + e.target.id,
            ),
          );
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  secs.forEach((s) => nio.observe(s));
  const topBtn = $("#backTop");
  addEventListener(
    "scroll",
    () => {
      topBtn.classList.toggle("show", scrollY > 600);
    },
    { passive: true },
  );
  topBtn?.addEventListener("click", () =>
    scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }),
  );

  /* REVEAL */
  const rio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          rio.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".reveal").forEach((el) => rio.observe(el));

  /* SKILL BARS + STATS */
  $$(".fill").forEach((f) => {
    const w = parseFloat(f.dataset.w || "0") / 100;
    f.style.setProperty(
      "--w",
      String(Math.max(0, Math.min(1, isFinite(w) ? w : 0))),
    );
  });
  const stacks = $("#skills");
  const bio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          $$(".fill", e.target).forEach((f) =>
            requestAnimationFrame(() => f.classList.add("is-on")),
          );
          bio.unobserve(e.target);
        }
      }),
    { threshold: 0.3 },
  );
  if (stacks) bio.observe(stacks);
  $$(".stat-n[data-target]").forEach((el) => {
    const target = parseInt(el.dataset.target || "0", 10) || 0,
      suffix = el.dataset.suffix || "";
    if (reduced) {
      el.textContent = target + suffix;
      return;
    }
    const sio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          sio.unobserve(el);
          const t0 = performance.now();
          (function tick(t) {
            const p = Math.min(1, (t - t0) / 900),
              eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
        }),
      { threshold: 0.6 },
    );
    sio.observe(el);
  });

  /* CHATBOT — 3 predefined answers (user verbatim) + helpful fallbacks */
  const A_STACK =
    "PHP, Front End, I excel in Github and Supabase. Mostly Full Stack.";
  const A_RATE =
    "Send me a message and lets talk about it! Scrolling you to the contact section now.";
  const A_WHO =
    "I am John Aldrin Doruca, a student at Lipa City Colleges studying computer science and aspiring as part of cybersecurity and full stack developer.";
  const msgs = $("#chatMsgs"),
    form = $("#chatForm"),
    input = $("#chatInput");
  function addMsg(text, who) {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function answer(q) {
    const t = (q || "").toLowerCase();
    if (/stack|tech|tools|language|supabase|php|frontend|front-end/.test(t))
      return { type: "text", text: A_STACK };
    if (/rate|price|cost|magkano|bayad|fee|salary|how much/.test(t))
      return { type: "rate", text: A_RATE };
    if (/who are you|sino|your name|yourself|about you|who is/.test(t))
      return { type: "text", text: A_WHO };
    if (/educ|school|college|lipa|course|study|bscs/.test(t))
      return {
        type: "text",
        text: "2nd-year BSCS at Lipa City Colleges, Lipa City PH. Focus: full-stack systems + cybersecurity track.",
      };
    if (/skill/.test(t))
      return {
        type: "text",
        text:
          "Top skills: " +
          A_STACK +
          " Also MySQL, Bootstrap, Git, Laravel basics.",
      };
    if (/project|work|portfolio|github|repo/.test(t))
      return {
        type: "text",
        text: "Featured: Final LCC Payroll, FitnessHub gym, LMS Code Compiler (Monaco+Judge0), LearnEngage frontend. See #projects — all on github.com/httpsGabbae.",
      };
    if (/hackathon|achiev|award|lead/.test(t))
      return {
        type: "text",
        text: "3rd placer — department hackathon. Plus shipped 4 school systems end-to-end.",
      };
    if (/contact|email|hire|message|messenger|linkedin/.test(t))
      return {
        type: "contact",
        text: "Email me at j.doruca109@gmail.com or use the form below — taking you there.",
      };
    if (/hi|hello|hey|kumusta/.test(t))
      return {
        type: "text",
        text: "Hello! Ask me: What is your stack? / How much is your rate? / Who are you?",
      };
    return {
      type: "text",
      text: "I answer best about stack, rate, or who I am — tap a preset above or type those keywords.",
    };
  }
  function ask(q) {
    if (!q.trim()) return;
    addMsg(q, "user");
    setTimeout(() => {
      const r = answer(q),
        b = addMsg(r.text, "bot");
      if (r.type === "rate" || r.type === "contact")
        setTimeout(() => {
          document
            .querySelector("#contact")
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        }, 900);
      if (navigator.vibrate) navigator.vibrate(10);
    }, 350);
  }
  const widget = $("#chatWidget"),
    fab = $("#chatFab");
  function openChat() {
    if (!widget) return;
    widget.hidden = false;
    fab?.setAttribute("aria-expanded", "true");
  }
  function closeChat() {
    if (!widget) return;
    widget.hidden = true;
    fab?.setAttribute("aria-expanded", "false");
  }
  fab?.addEventListener("click", () => {
    if (!widget) return;
    widget.hidden ? openChat() : closeChat();
    if (!widget.hidden) setTimeout(() => input?.focus(), 50);
  });
  $("#chatClose")?.addEventListener("click", () => {
    closeChat();
    fab?.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget && !widget.hidden) {
      closeChat();
      fab?.focus();
    }
  });
  $$("[data-q]").forEach((b) =>
    b.addEventListener("click", () => {
      openChat();
      ask(b.dataset.q || "");
      setTimeout(() => input?.focus(), 50);
    }),
  );
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    ask(q);
  });

  /* CONTACT FORM — draft + demo send + mailto */
  const n = $("#senderName"),
    m = $("#senderEmail"),
    t = $("#senderMessage");
  try {
    if (n) n.value = localStorage.getItem("g-name") || "";
    if (m) m.value = localStorage.getItem("g-email") || "";
    if (t) t.value = localStorage.getItem("g-msg") || "";
  } catch {}
  $("#contactForm")?.addEventListener("input", (e) => {
    try {
      if (e.target.id === "senderName")
        localStorage.setItem("g-name", e.target.value);
      if (e.target.id === "senderEmail")
        localStorage.setItem("g-email", e.target.value);
      if (e.target.id === "senderMessage")
        localStorage.setItem("g-msg", e.target.value);
    } catch {}
  });
  $("#contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.checkValidity()) {
      f.reportValidity();
      return;
    }
    const b = $("#sendBtn");
    b.disabled = true;
    const prev = b.textContent;
    b.textContent = "Sending…";
    const subject = encodeURIComponent(
      "Portfolio inquiry from " + (n.value || "visitor"),
    );
    const body = encodeURIComponent(
      (t.value || "") +
        "\n\n— " +
        (n.value || "") +
        " (" +
        (m.value || "") +
        ")",
    );
    setTimeout(() => {
      b.textContent = "Message sent ✓";
      $("#formMsg").hidden = false;
      f.reset();
      try {
        localStorage.removeItem("g-name");
        localStorage.removeItem("g-email");
        localStorage.removeItem("g-msg");
      } catch {}
      try {
        location.href =
          "mailto:j.doruca109@gmail.com?subject=" + subject + "&body=" + body;
      } catch {}
      setTimeout(() => {
        b.disabled = false;
        b.textContent = prev;
      }, 3000);
    }, 700);
  });

  /* COPY EMAIL */
  $("#copyEmail")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(
        $("#emailText")?.textContent.trim() || "j.doruca109@gmail.com",
      );
      const p = btn.innerHTML;
      btn.innerHTML = "Copied ✓";
      setTimeout(() => (btn.innerHTML = p), 1500);
      if (navigator.vibrate) navigator.vibrate(10);
    } catch {}
  });
  /* ANIME.JS — hero entrance (animejs.com v4: animate + stagger + outExpo) */
  if (!reduced && window.anime) {
    try {
      const { animate, stagger } = window.anime;
      const heroEls = $$(".hero [data-hero]");
      if (heroEls.length)
        animate(heroEls, {
          y: [24, 0],
          opacity: [0, 1],
          duration: 800,
          ease: "outExpo",
          delay: stagger(80),
        });
    } catch {}
  }
  /* MOUSE-FOLLOW SCENE — cursor via anime.js, glow/grid via rAF lerp */
  if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const dot = $("#cursorDot"),
      ring = $("#cursorRing"),
      spot = $("#sceneSpot"),
      bA = $("#blobA"),
      bB = $("#blobB"),
      bC = $("#blobC"),
      docEl = document.documentElement;
    let sx = 0,
      sy = 0,
      tx = 0,
      ty = 0,
      bxx = 85,
      byy = 30,
      btx = 85,
      bty = 30,
      raf = 0;
    function sLoop() {
      sx += (tx - sx) * 0.1;
      sy += (ty - sy) * 0.1;
      if (spot) {
        spot.style.setProperty("--sx", sx.toFixed(1) + "px");
        spot.style.setProperty("--sy", sy.toFixed(1) + "px");
      }
      if (bA) {
        bA.style.setProperty("--sx", (sx * 0.35).toFixed(1) + "px");
        bA.style.setProperty("--sy", (sy * 0.35).toFixed(1) + "px");
      }
      if (bB) {
        bB.style.setProperty("--sx", (sx * -0.3).toFixed(1) + "px");
        bB.style.setProperty("--sy", (sy * -0.3).toFixed(1) + "px");
      }
      if (bC) {
        bC.style.setProperty("--sx", (sx * 0.22).toFixed(1) + "px");
        bC.style.setProperty("--sy", (sy * -0.22).toFixed(1) + "px");
      }
      bxx += (btx - bxx) * 0.08;
      byy += (bty - byy) * 0.08;
      docEl.style.setProperty("--bx", bxx.toFixed(1) + "%");
      docEl.style.setProperty("--by", byy.toFixed(1) + "%");
      if (
        Math.abs(tx - sx) > 0.1 ||
        Math.abs(ty - sy) > 0.1 ||
        Math.abs(btx - bxx) > 0.05 ||
        Math.abs(bty - byy) > 0.05
      )
        raf = requestAnimationFrame(sLoop);
      else raf = 0;
    }
    addEventListener(
      "pointermove",
      (e) => {
        tx = e.clientX - innerWidth / 2;
        ty = e.clientY - innerHeight / 2;
        docEl.style.setProperty(
          "--mx",
          ((e.clientX / innerWidth) * 100).toFixed(1) + "%",
        );
        docEl.style.setProperty(
          "--my",
          ((e.clientY / innerHeight) * 100).toFixed(1) + "%",
        );
        btx = Math.max(0, Math.min(100, (e.clientX / innerWidth) * 100));
        bty = Math.max(0, Math.min(100, (e.clientY / innerHeight) * 100));
        if (!raf) raf = requestAnimationFrame(sLoop);
        if (window.anime) {
          try {
            const { animate } = window.anime;
            if (dot)
              animate(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 150,
                ease: "outExpo",
              });
            if (ring)
              animate(ring, {
                x: e.clientX,
                y: e.clientY,
                duration: 450,
                ease: "outExpo",
              });
          } catch {}
        }
        if (window.anime)
          document.body.classList.add("has-cursor", "cursor-live");
      },
      { passive: true },
    );
    docEl.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-live"),
    );
    document.addEventListener("mouseover", (e) => {
      document.body.classList.toggle(
        "cursor-hot",
        !!e.target.closest("a,button"),
      );
    });
  }

  /* YANZ-INSPIRED — sticker parallax + results slider + magnetic buttons */
  try {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduced && fine) {
      const floats = [...document.querySelectorAll("[data-float]")];
      if (floats.length) {
        addEventListener("pointermove", (e) => {
          floats.forEach((el, i) => {
            const f = (i + 1) * 10;
            const x = (e.clientX / innerWidth - 0.5) * f;
            const y = (e.clientY / innerHeight - 0.5) * f;
            el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
          });
        }, { passive: true });
      }
      $$(".btn-dark").forEach((b) => {
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.08;
          const y = (e.clientY - r.top - r.height / 2) * 0.12;
          b.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
        });
        b.addEventListener("pointerleave", () => { b.style.translate = "0px 0px"; });
      });
    }
  } catch {}
  try {
    const slides = $("#slides");
    const count = $("#slideCount");
    const prev = $("#prevSlide");
    const next = $("#nextSlide");
    if (slides && count) {
      const total = slides.children.length;
      let idx = 0;
      const pad = (n) => String(n).padStart(2, "0");
      const go = (i) => {
        idx = (i + total) % total;
        slides.style.transform = `translateX(-${idx * 100}%)`;
        count.textContent = `${pad(idx + 1)} / ${pad(total)}`;
      };
      prev?.addEventListener("click", () => go(idx - 1));
      next?.addEventListener("click", () => go(idx + 1));
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") go(idx - 1);
        if (e.key === "ArrowRight") go(idx + 1);
      });
      let tx0 = 0;
      slides.addEventListener("touchstart", (e) => { tx0 = e.touches[0].clientX; }, { passive: true });
      slides.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - tx0;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
      go(0);
    }
  } catch {}
})();
