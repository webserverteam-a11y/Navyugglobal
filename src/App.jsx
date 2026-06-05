import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./components/header.jsx"
import Footer from "./components/footer.jsx"

import Home from "./pages/home.jsx"
import About from "./pages/about.jsx"
import Companies from "./pages/companies.jsx"
import Verticals from "./pages/verticals.jsx"
import Blogs from "./pages/blogs.jsx"
import Contact from "./pages/contact.jsx"
import Lenis from 'lenis';
import BlogTemplate from './blogs/blogtemplate.jsx';
import { HelmetProvider } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);


function SmoothWrapper({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {

    // 👉 Create Lenis instance
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // 👉 RAF loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 👉 Sync with GSAP
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };

  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)

  }, [location.pathname])

  return children;
}


function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <SmoothWrapper>

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/verticals" element={<Verticals />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />



          <Route path="/blogs/:slug" element={<BlogTemplate />} />
        </Routes>

        <Footer />

      </SmoothWrapper>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;