import { useLayoutEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { gsap, reduceMotion } from "../lib/gsap";
import { PROFILE } from "../data/site";

/** Strong contact statement with mask reveals and an arrow-chasing CTA. */
export default function Contact() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) {
      gsap.set(".contact .mask-in", { yPercent: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact .mask-in", { yPercent: 110 }, {
        yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" data-sec="contact" className="contact wrap" ref={root}>
      <p className="kicker"><b>06</b> — Contact</p>
      <h2 className="giant">
        <span className="mask"><span className="mask-in">Let&apos;s</span></span>
        <span className="mask"><span className="mask-in">Work</span></span>
        <span className="mask"><span className="mask-in"><a href={`mailto:${PROFILE.email}`}>Together.</a></span></span>
      </h2>
      <p className="hero-sub">Have a project in mind? Tell me about it.</p>
      <div className="hero-row">
        <a className="btn btn-solid" href={`mailto:${PROFILE.email}`}>Start a conversation <ArrowRight className="arr" size={16} /></a>
      </div>
      <div className="contact-links">
        <a href={`mailto:${PROFILE.email}`}><Mail size={15} />{PROFILE.email}</a>
        <a href={PROFILE.github} target="_blank" rel="noopener"><ArrowUpRight size={15} />GitHub</a>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener"><ArrowUpRight size={15} />LinkedIn</a>
      </div>
    </section>
  );
}
