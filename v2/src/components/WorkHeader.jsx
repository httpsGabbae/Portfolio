import { useLayoutEffect, useRef } from "react";
import { gsap, reduceMotion } from "../lib/gsap";

/** Oversized SELECTED / WORK lines drifting horizontally with scroll. */
export default function WorkHeader() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".drift").forEach((el, i) => {
        gsap.fromTo(el, { xPercent: i % 2 ? 4 : -12 }, {
          xPercent: i % 2 ? -12 : 4, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="work-head wrap" data-sec="work-head" ref={root} aria-label="Selected work">
      <p className="kicker"><b>01</b> — Selected work</p>
      <h2 className="giant drift">Selected</h2>
      <h2 className="giant drift" style={{ color: "transparent", WebkitTextStroke: "1px var(--muted)" }}>Work</h2>
    </section>
  );
}
