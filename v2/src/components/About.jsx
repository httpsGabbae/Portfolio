import { useLayoutEffect, useRef } from "react";
import { gsap, reduceMotion } from "../lib/gsap";

const CELLS = [
  ["01 — Design", "Interfaces with clear hierarchy, readable at a glance, intentional in every detail."],
  ["02 — Development", "Full-stack applications with solid data flows, auth, and real deployments."],
  ["03 — Interaction", "Scroll, motion, and feedback that guide attention instead of showing off."],
  ["04 — Experience", "Simple, useful, memorable — software people enjoy returning to."],
];

/** Editorial statement + progressive cell reveals. */
export default function About() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) {
      gsap.set(".about-cell", { opacity: 1, y: 0 });
      gsap.set(".about-big .reveal-line", { opacity: 1 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about-cell").forEach((cell, i) => {
        gsap.fromTo(cell, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 2) * 0.08,
          scrollTrigger: { trigger: cell, start: "top 86%" },
        });
      });
      gsap.fromTo(".about-big .reveal-line", { opacity: 0.12 }, {
        opacity: 1, stagger: 0.25, ease: "none",
        scrollTrigger: { trigger: ".about-big", start: "top 78%", end: "bottom 45%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" data-sec="about" className="about wrap" ref={root}>
      <p className="kicker"><b>03</b> — About</p>
      <h2 className="about-big">
        <span className="reveal-line">I design and build digital experiences </span>
        <span className="reveal-line">that are simple, useful, </span>
        <span className="reveal-line">and memorable.</span>
      </h2>
      <div className="about-grid">
        {CELLS.map(([title, note]) => (
          <div className="about-cell" key={title}>
            <h4>{title}</h4>
            <p>{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
