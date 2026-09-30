import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, reduceMotion } from "../lib/gsap";
import { PROJECTS } from "../data/site";
import ProjectVisual from "./ProjectVisual";

/**
 * Pinned presentation stage (desktop): vertical scroll scrubs through
 * projects — image expands 0.88→1.0, copy staggers in, outgoing project
 * overlaps the incoming one. Mobile/reduced-motion: stacked reveals, no pin.
 */
export default function ProjectShowcase() {
  const root = useRef(null);
  const count = useRef(null);
  const total = `0${PROJECTS.length}`;

  useLayoutEffect(() => {
    if (reduceMotion()) {
      gsap.set(".shot", { autoAlpha: 1 });
      if (count.current) count.current.textContent = `01 / ${total}`;
      return undefined;
    }
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      if (reduceMotion()) return undefined;
      const shots = gsap.utils.toArray(".shot");
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${shots.length * 900}`,
          scrub: 1,
          pin: ".stage-pin",
          onUpdate: (self) => {
            const i = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
            if (count.current) count.current.textContent = `0${i + 1} / ${total}`;
          },
        },
      });
      shots.forEach((shot, i) => {
        const q = gsap.utils.selector(shot);
        tl.fromTo(shot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 });
        tl.fromTo(q(".visual"), { scale: 0.88, y: 40, rotate: -1 }, { scale: 1, y: 0, rotate: 0, duration: 1.1 }, "<");
        tl.fromTo(q(".shot-num"), { opacity: 0.2 }, { opacity: 1, duration: 0.8 }, "<");
        tl.fromTo(q(".shot-copy > *"), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, "<+0.1");
        if (i < shots.length - 1) {
          tl.to(q(".shot-copy > *"), { y: -50, opacity: 0, duration: 0.45, stagger: 0.04 }, "+=0.45");
          tl.to(q(".visual"), { scale: 0.92, y: -30, duration: 0.45 }, "<");
          tl.to(shot, { autoAlpha: 0, duration: 0.45 }, "<+0.1");
        }
      });
      return () => undefined;
    });
    mm.add("(max-width: 900px)", () => {
      gsap.utils.toArray(".shot").forEach((shot) => {
        gsap.fromTo(shot,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: shot, start: "top 82%" } });
        const v = shot.querySelector(".visual");
        if (v && !reduceMotion()) {
          gsap.fromTo(v, { scale: 0.92 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: shot, start: "top bottom", end: "center center", scrub: true },
          });
        }
      });
    });
    return () => mm.revert();
  }, [total]);

  return (
    <section id="work" data-sec="work" ref={root} aria-label="Project showcase">
      <div className="stage-pin">
        <div className="stage">
          {PROJECTS.map((p) => (
            <article className="shot" key={p.id} aria-label={`${p.index} ${p.title}`}>
              <div className="shot-copy">
                <div className="shot-num" aria-hidden="true">{p.index}</div>
                <h3>{p.title}</h3>
                <p className="shot-meta">{p.category} — {p.year}</p>
                <p className="desc">{p.description}</p>
                <div className="tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                <a className="btn" href="#contact">View project <ArrowUpRight className="arr" size={15} /></a>
              </div>
              <ProjectVisual project={p} glyph={p.index} />
            </article>
          ))}
          <div className="stage-count" aria-hidden="true"><span ref={count}>01 / {total}</span></div>
        </div>
      </div>
    </section>
  );
}
