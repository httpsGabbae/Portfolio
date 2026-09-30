import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { PROFILE } from "../data/site";

/** Fixed nav: transparent → blurred on scroll. Fullscreen staggered menu on mobile. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    ["Work", "#work"],
    ["About", "#about"],
    ["Services", "#services"],
    ["Contact", "#contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="wrap nav-in">
          <a className="brand" href="#top">{PROFILE.name}<em>.</em></a>
          <nav className="nav-links" aria-label="Primary">
            {links.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
            <a className="btn" href="#contact">Start a project <ArrowUpRight size={15} /></a>
          </nav>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>
      {open && (
        <nav className="mobile-menu" aria-label="Mobile">
          {links.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ animation: `menuIn 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both` }}
            >
              {label}
            </a>
          ))}
          <style>{`@keyframes menuIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}`}</style>
        </nav>
      )}
    </>
  );
}
