import { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, reduceMotion } from "../lib/gsap";
import { SERVICES } from "../data/site";

/** Agency-style service index: rows shift, numbers slide, arrows arrive on hover. */
export default function Services() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) {
      gsap.set(".svc", { opacity: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".svc").forEach((row) => {
        gsap.fromTo(row, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" data-sec="services" className="services wrap" ref={root}>
      <p className="kicker"><b>04</b> — Services</p>
      <div>
        {SERVICES.map((s) => (
          <div className="svc" key={s.index}>
            <a className="svc-row" href="#contact">
              <span className="n">{s.index}</span>
              <h3>{s.title}<small>{s.note}</small></h3>
              <ArrowRight className="go" size={28} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
