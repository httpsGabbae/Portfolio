import { useEffect, useRef } from "react";
import { finePointer, reduceMotion } from "../lib/gsap";

/** Small dot + trailing ring. Expands to VIEW over project visuals. Touch devices: hidden. */
export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!finePointer() || reduceMotion()) return undefined;
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const view = e.target.closest?.("[data-cursor='view']");
      const link = e.target.closest?.("a,button");
      ring.current?.classList.toggle("is-view", !!view);
      ring.current?.classList.toggle("is-link", !!link && !view);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span>VIEW</span></div>
    </>
  );
}
