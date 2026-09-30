import { useEffect, useRef } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { useSmoothScroll } from "./animations/useSmoothScroll";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkHeader from "./components/WorkHeader";
import ProjectShowcase from "./components/ProjectShowcase";
import HorizontalWork from "./components/HorizontalWork";
import About from "./components/About";
import Services from "./components/Services";
import Process from "./components/Process";
import BigType from "./components/BigType";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const scrollTo = useRef(null);
  useSmoothScroll(scrollTo);

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  const toTop = () => {
    if (scrollTo.current) scrollTo.current(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <WorkHeader />
        <ProjectShowcase />
        <HorizontalWork />
        <About />
        <Services />
        <Process />
        <BigType />
        <Contact />
      </main>
      <Footer onTop={toTop} />
    </>
  );
}
