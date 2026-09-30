import { useLayoutEffect, useRef } from "react";
import { gsap, reduceMotion } from "../lib/gsap";
import { PROCESS } from "../data/site";

/** Workflow steps: the active step lights up as scroll passes through. */
export default function Process() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".step").forEach((step) => {
        if (reduceMotion()) {
          gsap.set(step, { opacity: 1 });
          return;
        }
        gsap.fromTo(step, { opacity: 0.22 }, {
          opacity: 1, ease: "none",
          scrollTrigger: { trigger: step, start: "top 78%", end: "top 32%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section data-sec="process" className="process wrap" ref={root} aria-label="Workflow">
      <p className="kicker"><b>05</b> — Process</p>
      <div>
        {PROCESS.map((s) => (
          <div className="step" key={s.index}>
            <span className="n">{s.index}</span>
            <div><h3>{s.title}</h3><p>{s.note}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
