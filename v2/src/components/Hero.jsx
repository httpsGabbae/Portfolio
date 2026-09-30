import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, reduceMotion } from "../lib/gsap";
import { PROFILE } from "../data/site";

/** Full-screen hero: mask-reveal headline, parallax exit into the work section. */
export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion()) {
      gsap.set(".mask-in", { yPercent: 0 });
      gsap.set(".hero-fade", { opacity: 1, y: 0 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(".mask-in", { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.12, delay: 0.15 });
      gsap.fromTo(".hero-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.7 });
      if (!reduceMotion()) {
        gsap.to(".hero-core", {
          yPercent: -14, opacity: 0.15, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-bg", {
          yPercent: 18, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero wrap" id="top" data-sec="hero" ref={root}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-core">
        <p className="status hero-fade"><i />AVAILABLE FOR PROJECTS</p>
        <h1 className="giant" aria-label={`${PROFILE.role}`}>
          <span className="mask"><span className="mask-in">Creative</span></span>
          <span className="mask"><span className="mask-in">Developer</span></span>
          <span className="mask"><span className="mask-in outline">&amp; Designer</span></span>
        </h1>
        <p className="hero-sub hero-fade">
          I build digital experiences that combine thoughtful design,
          interactive technology, and meaningful user experiences.
        </p>
        <div className="hero-row hero-fade">
          <a className="btn btn-solid" href="#work">View my work <ArrowUpRight className="arr" size={16} /></a>
          <a className="btn" href="#about">More about me</a>
        </div>
        <div className="scroll-hint hero-fade"><span>Scroll to explore</span><ArrowDown size={15} /></div>
      </div>
    </section>
  );
}
