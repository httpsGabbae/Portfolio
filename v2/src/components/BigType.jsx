import { useLayoutEffect, useRef } from "react";
import { gsap, reduceMotion } from "../lib/gsap";

/** Oversized DESIGN / BUILD / CREATE words alternating direction on scroll. */
export default function BigType() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".drift").forEach((el, i) => {
        gsap.fromTo(el, { xPercent: i % 2 ? 6 : -14 }, {
          xPercent: i % 2 ? -14 : 6, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section data-sec="words" ref={root} aria-hidden="true" style={{ padding: "10vh 0", overflow: "clip" }}>
      <div className="wrap">
        <div className="giant drift">Design</div>
        <div className="giant drift" style={{ color: "transparent", WebkitTextStroke: "1px var(--muted)" }}>Build</div>
        <div className="giant drift">Create</div>
      </div>
    </section>
  );
}
