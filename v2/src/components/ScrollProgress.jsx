import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** Fixed right-side progress: thin bar + section counter. */
export default function ScrollProgress() {
  const bar = useRef(null);
  const label = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bar.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: 0, end: "max", scrub: 0.3 },
      });
      const sections = gsap.utils.toArray("main [data-sec]");
      sections.forEach((sec, i) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive && label.current)
              label.current.textContent = `${String(i + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <small ref={label}>01 / 01</small>
      <div className="bar"><i ref={bar} /></div>
    </div>
  );
}
