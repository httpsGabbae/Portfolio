import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { reduceMotion } from "../lib/gsap";

/** Lenis on GSAP's ticker (single clock) wired to ScrollTrigger. */
export function useSmoothScroll(ref) {
  useEffect(() => {
    if (reduceMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    ScrollTrigger.config({ ignoreMobileResize: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (ref) ref.current = (target) => lenis.scrollTo(target, { offset: 0 });
    const onAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href"));
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el);
      }
    };
    document.addEventListener("click", onAnchor);
    let refreshFonts = null;
    if (document.fonts?.ready) {
      refreshFonts = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refreshFonts).catch(() => {});
    }
    return () => {
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [ref]);
}
