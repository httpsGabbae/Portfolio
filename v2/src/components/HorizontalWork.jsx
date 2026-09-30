import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, reduceMotion } from "../lib/gsap";
import { PROJECTS } from "../data/site";
import ProjectVisual from "./ProjectVisual";

/**
 * Vertical scroll drives horizontal movement while pinned (desktop).
 * Mobile: the same cards stack vertically, no pinning.
 */
export default function HorizontalWork() {
  const root = useRef(null);
  const track = useRef(null);
  const fill = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      if (reduceMotion()) return undefined;
      const getX = () => -(track.current.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        x: getX, ease: "none",
        scrollTrigger: {
          trigger: root.current, start: "top top",
          end: () => `+=${track.current.scrollWidth - window.innerWidth}`,
          scrub: 1, pin: true, invalidateOnRefresh: true,
          onUpdate: (self) => { if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`; },
        },
      });
      return () => undefined;
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="hwrap" data-sec="archive" ref={root} aria-label="Project archive" style={{ padding: "14vh 0" }}>
      <div className="wrap" style={{ marginBottom: 48 }}>
        <p className="kicker"><b>02</b> — Archive, scroll-driven</p>
      </div>
      <div className="htrack" ref={track}>
        {PROJECTS.map((p) => (
          <article className="hcard" key={p.id}>
            <ProjectVisual project={p} glyph={p.title.charAt(0)} />
            <p className="shot-meta" style={{ marginTop: 18 }}>{p.index} — {p.category} · {p.year}</p>
            <h3 style={{ fontSize: "clamp(1.4rem,2.4vw,2rem)", textTransform: "uppercase", marginTop: 8 }}>{p.title}</h3>
            <a className="btn" style={{ marginTop: 18 }} href="#contact">View <ArrowUpRight className="arr" size={15} /></a>
          </article>
        ))}
      </div>
      <div className="hbar" aria-hidden="true"><i ref={fill} /></div>
    </section>
  );
}
