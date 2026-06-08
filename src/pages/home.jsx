import { useEffect, useState, useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HV from "../assets/homeherov.mp4"
import HL from "../assets/logos.png"
import HA from "../assets/homeabout.mp4"
import V1 from "../assets/v1.png"
import V2 from "../assets/v2.png"
import V3 from "../assets/v3.png"
import V4 from "../assets/v4.png"
import PDRL from "../assets/pdrl.png"
import Blog from "../assets/blogtemp.png"
import SC from "../assets/shrinithi-capital.png"
import SM from "../assets/savemom.png"
import JM from "../assets/jupiter-meta.png"
import CC from "../assets/circlecontent.svg"
import CR from "../assets/rotator.svg"
import SE from "../assets/homesectorsextra.png"
import PortfolioCard from "../components/portfoliocard"
import SlickSlider from "react-slick"
import BlogCards from "../components/blogcards"

import useFetch from "../services/useFetch";
import { getHomepageData, getCompaniesPageData, getVerticalsPageData, getBlogsData, getAboutPageData } from "../services/api"
import Loader from "../components/loader";
import { Helmet } from "react-helmet-async"

gsap.registerPlugin(ScrollTrigger)

const Slider = SlickSlider.default || SlickSlider

function Home() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")

  const {
    data: homeData,
    loading,
    error,
  } = useFetch(getHomepageData);

  const {
    data: aboutData,
  } = useFetch(getAboutPageData);

  const {
    data: companiesData,
  } = useFetch(getCompaniesPageData);

  const {
    data: verticalsData,
  } = useFetch(getVerticalsPageData);

  const {
    data: blogsData,
  } = useFetch(getBlogsData);


  const sortedBlogs = useMemo(() => {
    const blogs = blogsData?.blogs;
    if (!blogs || !Array.isArray(blogs)) return [];
    return [...blogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [blogsData]);
  /* =========================================
     FEATURED BLOG
     (NOT FILTERED)
  ========================================= */
  const featuredBlog = sortedBlogs[0];

  /* =========================================
     REMAINING BLOGS
  ========================================= */
  const remainingBlogs = sortedBlogs.slice(1);

  const filterTags = useMemo(() => {
    const uniqueTags = [];

    remainingBlogs.forEach((blog) => {
      if (blog.hero_section?.tags?.length) {
        blog.hero_section.tags.forEach((item) => {
          if (
            item?.tags &&
            !uniqueTags.includes(item.tags)
          ) {
            uniqueTags.push(item.tags);
          }
        });
      }
    });

    return ["All", ...uniqueTags];
  }, [remainingBlogs]);

  /* =========================================
     FILTER ONLY REMAINING BLOGS
  ========================================= */
  const filteredRemainingBlogs = useMemo(() => {
    if (activeFilter === "All") {
      return remainingBlogs;
    }

    return remainingBlogs.filter((blog) =>
      blog.hero_section?.tags?.some(
        (item) => item.tags === activeFilter
      )
    );
  }, [remainingBlogs, activeFilter]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  }

  const settingsM = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  }


  const logoSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
    ],
  }

  const logoSettingsM = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    centerMode: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
    ],
  }


  function splitReveal(selector, triggerConfig) {
    if (!mainRef.current) return

    const el = mainRef.current.querySelector(selector)

    if (!el) return

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()

        node.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
          } else if (part.length) {
            const s = document.createElement("span")
            s.className = "word"
            s.style.cssText =
              "display:inline-block; white-space:pre"

            s.textContent = part
            frag.appendChild(s)
          }
        })

        node.parentNode.replaceChild(frag, node)

      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk)
      }
    }

    walk(el)

    gsap.fromTo(
      el.querySelectorAll(".word"),
      { opacity: 0.3 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          scrub: 1.5,
          ...triggerConfig,
        },
      }
    )
  }

  useEffect(() => {
    if (loading || error || !homeData || !aboutData || !mainRef.current) return

    const ctx = gsap.context(() => {

      gsap.to(".loader", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => setShowLoader(false)
      })

      /* ─────────────────────────────────────────
         HERO — entrance (no scroll needed)
      ───────────────────────────────────────── */
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } })
      heroTl
        .from(".homeHero .videoCover", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(".homeHero .content h1", {
          y: 70,
          opacity: 0,
          duration: 1.1,
        }, "-=1.0")
        .from(".homeHero .content p", {
          y: 40,
          opacity: 0,
          duration: 0.9,
        }, "-=0.75")
        .from(".homeHero .content .btn", {
          y: 28,
          opacity: 0,
          duration: 0.7,
        }, "-=0.6")

      /* Hero video — parallax on scroll */
      gsap.to(".homeHero video", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".homeHero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      })

      /* Hero content — subtle lift as user scrolls away */
      gsap.to(".homeHero .content", {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".homeHero",
          start: "top top",
          end: "50% top",
          scrub: 1,
        },
      })

      /* ─────────────────────────────────────────
         LOGOS
      ───────────────────────────────────────── */
      gsap.from(".homeLogos p", {
        y: 35,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeLogos",
          start: "top 88%",
          end: "top 55%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeLogos img", {
        y: 55,
        opacity: 0,
        scale: 0.93,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".homeLogos",
          start: "top 85%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      /* ─────────────────────────────────────────
         ABOUT
      ───────────────────────────────────────── */
      gsap.from(".homeAbout .caption", {
        y: 30,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeAbout",
          start: "top 88%",
          end: "top 60%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeAbout video", {
        scale: 0.78,
        opacity: 0,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".homeAbout",
          start: "top 82%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      splitReveal(".homeAbout h2", {
        start: "top 78%",
        end: "top 25%",
      })


      gsap.from(".homeAbout .btn", {
        y: 35,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeAbout",
          start: "top 65%",
          end: "top 20%",
          scrub: 1.5,
        },
      })

      /* ─────────────────────────────────────────
         IMPACT
      ───────────────────────────────────────── */

      /* Background subtle scale */
      gsap.from(".homeImpact", {
        scale: 0.97,
        transformOrigin: "center top",
        scrollTrigger: {
          trigger: ".homeImpact",
          start: "top 90%",
          end: "top 50%",
          scrub: 2,
        },
      })

      gsap.from(".homeImpact .impactRow .captionDiv", {
        x: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeImpact",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeImpact .impactRow .content h2", {
        x: 80,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeImpact",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeImpact .impactRow .content .btn", {
        x: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeImpact",
          start: "top 70%",
          end: "top 30%",
          scrub: 1.5,
        },
      })

      /* Number widgets — staggered rise */
      gsap.from(".homeImpact .numberWidget", {
        y: 90,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".homeImpact .numbersRow",
          start: "top 88%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      /* Number counter animation */

      mainRef.current
        .querySelectorAll(".numberWidget h5")
        .forEach((el, i) => {

          const item = aboutData?.impact?.impact_card?.[i]

          if (!item) return

          const target = Number(item?.impact_card_count) || 0

          const suffix =
            i === 2 ? "+ Crore" : "+"

          const counter = { value: 0 }

          gsap.to(counter, {
            value: target,
            duration: 2,
            ease: "power1.out",
            snap: { value: 1 },

            onUpdate() {

              const value = String(
                Math.floor(counter.value)
              ).padStart(2, "0")

              el.innerHTML = `${value}<span class="smallAsterisk">*</span>${suffix}`
            },

            scrollTrigger: {
              trigger: ".homeImpact .numbersRow",
              start: "top 80%",
              toggleActions: "play none none reset",
            },
          })
        })

      /* ─────────────────────────────────────────
         VERTICALS
      ───────────────────────────────────────── */
      gsap.from(".homeVerticals .caption", {
        y: 30,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeVerticals",
          start: "top 88%",
          end: "top 62%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeVerticals > h2", {
        y: 55,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeVerticals",
          start: "top 85%",
          end: "top 50%",
          scrub: 1.5,
        },
      })

      /* Each vertical card slides in from alternating sides */
      mainRef.current.querySelectorAll(".allVertices .vertical").forEach((el, i) => {
        const fromX = i % 2 === 0 ? -100 : 100

        gsap.from(el, {
          x: fromX,
          opacity: 0,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 50%",
            scrub: 1.5,
          },
        })

        /* Image inside each card — parallax depth */
        const img = el.querySelector("img")
        if (img) {
          gsap.fromTo(
            img,
            { y: 20 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            }
          )
        }
      })

      /* ─────────────────────────────────────────
         ECO (PORTFOLIO)
      ───────────────────────────────────────── */
      gsap.from(".homeEco .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeEco",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeEco .headingSide", {
        x: -90,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeEco",
          start: "top 82%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      gsap.from(".homeEco .contentSide", {
        x: 90,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeEco",
          start: "top 82%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      /* Portfolio cards — staggered rise */
      gsap.from(".homeEco .portfolioCard", {
        y: 80,
        opacity: 0,
        stagger: {
          each: 0.1,
          from: "start",
        },
        scrollTrigger: {
          trigger: ".homeEco .allCards",
          start: "top 90%",
          end: "top 50%",
          scrub: 1.5,
        },
      })

      /* ─────────────────────────────────────────
         SECTORS
      ───────────────────────────────────────── */
      gsap.from(".homeSectors .heading .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeSectors",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      splitReveal(".homeSectors .heading h2", {
        start: "top 82%",
        end: "top 35%",
      })

      /* Decorative images drift in from their respective sides */
      gsap.from(".homeSectors .top", {
        x: 120,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeSectors",
          start: "top 80%",
          end: "center 50%",
          scrub: 2,
        },
      })

      gsap.from(".homeSectors .bottom", {
        x: -120,
        opacity: 0,
        scrollTrigger: {
          trigger: ".homeSectors",
          start: "30% 80%",
          end: "bottom 60%",
          scrub: 2,
        },
      })

      /* Circle graphic — scale + fade in */
      gsap.from(".homeSectors .circleContent", {
        scale: 0.65,
        opacity: 0,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".homeSectors .circleContent",
          start: "top 90%",
          end: "top 45%",
          scrub: 1.8,
        },
      })

      /* Rotator image — additional subtle scale as user scrolls through */
      gsap.fromTo(
        ".homeSectors .circleContent .content",
        { scale: 0.9 },
        {
          scale: 1.05,
          scrollTrigger: {
            trigger: ".homeSectors .circleContent",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 2,
          },
        }
      )

    }, mainRef)
    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [loading, error, homeData, aboutData])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        setShowLoader(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading) {

      gsap.to(".loader", {
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        onComplete: () => {
          setShowLoader(false)
        }
      })

    }
  }, [loading])


  if (error) return <div>{error}</div>;

  return (
    <>
      <Helmet>
        <title>{homeData?.seo?.meta_title}</title>
        <meta name="description" content={homeData?.seo?.meta_description}></meta>
        <link rel="canonical" href={homeData?.seo?.meta_canonical} />
      </Helmet>
      {showLoader && <Loader />}
      <main ref={mainRef}>
        <section className="homeHero">
          <div className="content">
            <h1 dangerouslySetInnerHTML={{
              __html:
                homeData?.hero_section?.hero_title ||
                "Navyug Powers the <br /> Businesses of <i>Tomorrow</i>",
            }}></h1>
            <p>{homeData?.hero_section?.hero_subtitle}</p>
            <a className="btn btn1" href={homeData?.hero_section?.hero_button_link?.url || "/contact"}>{homeData?.hero_section?.hero_button_text}
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#142035" />
              </svg>
            </a>
          </div>
          <div className="videoCover">
            <video autoPlay loop playsInline muted>
              <source src="https://lightgray-magpie-707312.hostingersite.com/wp-content/uploads/2026/05/homeherov.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section className="homeLogos desktop">
          <p>{homeData?.partner_logo?.partnership_title}</p>
          <Slider {...logoSettings}>
            {companiesData?.portfolio?.portfolio_card?.map((item, index) => (
              <div key={index} className="logo-slide">
                <a target="_blank" href={item?.website_link || "#"}>
                  <img
                    src={item?.logo?.url}
                    alt={item?.logo?.alt}
                    className="company-logo"
                  />
                </a>
              </div>
            ))}
          </Slider>
        </section>

        <section className="homeLogos mobile">
          <p>{homeData?.partner_logo?.partnership_title}</p>
          <Slider {...logoSettingsM}>
            {companiesData?.portfolio?.portfolio_card?.map((item, index) => (
              <div key={index} className="logo-slide">
                <a target="_blank" href={item?.website_link || "#"}>
                  <img
                    src={item?.logo?.url}
                    alt={item?.logo?.alt}
                    className="company-logo"
                  />
                </a>
              </div>
            ))}
          </Slider>
        </section>

        <section className="homeAbout">
          <span className="caption">
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
              <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
              <defs>
                <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#368CFC" />
                  <stop offset="1" stopColor="#2BDDD7" />
                </linearGradient>
                <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#368CFC" />
                  <stop offset="1" stopColor="#2BDDD7" />
                </linearGradient>
              </defs>
            </svg>
            ABOUT US
          </span>
          <video autoPlay loop playsInline muted>
            <source src="https://lightgray-magpie-707312.hostingersite.com/wp-content/uploads/2026/05/homeabout.mp4" type="video/mp4" />
          </video>
          <h2>{homeData?.about_us?.aboutus_description}</h2>
          <a className="btn btn2" href={homeData?.about_us?.aboutus_link?.url || "/about-us"}>{homeData?.about_us?.aboutus_link?.title}
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#fff" />
            </svg>
          </a>
        </section>

        <section className="homeImpact">
          <div className="impactRow">
            <div className="captionDiv">
              <span className="caption">
                <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                  <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                  <defs>
                    <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                  </defs>
                </svg>
                IMPACT OVERVIEW
              </span>
            </div>
            <div className="content">
              <h2 dangerouslySetInnerHTML={{
                __html:
                  homeData?.impact_overview?.impact_title ||
                  "Built on <i>Ecosystems. </i><br />Driven by the Future.",
              }}></h2>
              <a className="btn btn1" href={homeData?.impact_overview?.impact_link?.url || "/contact"}>{homeData?.impact_overview?.impact_link?.title}
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#142035" />
                </svg>
              </a>
            </div>
          </div>
          <div className="numbersRow">
            {aboutData?.impact?.impact_card?.map((item, index) => (
              <div className="numberWidget" key={index}>
                <div className="heading">
                  <img
                    src={item?.impact_card_logo?.url}
                    alt={item?.impact_card_logo?.alt}
                  />

                  <p>{item?.impact_card_title}</p>
                </div>

                <h5>{item?.impact_card_count}</h5>
              </div>
            ))}
          </div>
          <p className="disc">*The numbers provided are subject to change.</p>
        </section>

        <section className="homeVerticals">
          <span className="caption">
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
              <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
              <defs>
                <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#368CFC" />
                  <stop offset="1" stopColor="#2BDDD7" />
                </linearGradient>
                <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#368CFC" />
                  <stop offset="1" stopColor="#2BDDD7" />
                </linearGradient>
              </defs>
            </svg>
            NAVYUG FOCUS VERTICALS
          </span>
          <h2>A <i>diversified</i> new-age company
            driving growth across multiple industries</h2>
          <div className="allVertices">
            {verticalsData?.what_we_do?.cards?.map((card, i) => (
              <div className="vertical" key={i}>
                <div className="content">
                  <h3>{card.card_title}</h3>

                  <p>{card.card_description}</p>

                  <p className="example" dangerouslySetInnerHTML={{
                    __html:
                      card.card_description_sub
                  }}>
                  </p>
                  <a className="btn btn2" href="/verticals">Learn More
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#fff" />
                    </svg>
                  </a>
                </div>

                <img src={card.card_image?.url} alt={card.card_image?.alt} />
              </div>
            ))}
          </div>
        </section>

        <section className="homeEco">
          <div className="heading">
            <div className="headingCover">
              <span className="caption">
                <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                  <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                  <defs>
                    <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                  </defs>
                </svg>
                OUR BUSINESS ECOSYSTEM
              </span>
              <div className="headingSide">
                <h2>{homeData?.portfolio?.portfolio_title}</h2>
              </div>
            </div>

            <div className="contentSide">
              <p>{homeData?.portfolio?.portfolio_description}</p>
              <a className="btn btn2" href={homeData?.portfolio?.portfolio_link?.url || "/companies"}>{homeData?.portfolio?.portfolio_link?.title}
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>
          <div className="allCards desktop">
            <Slider {...settings}>

              {companiesData?.portfolio?.portfolio_card?.map((item, index) => (
                <div>
                  <PortfolioCard
                    key={index}
                    companyName={item?.title}
                    thumbnail={item?.image?.url}
                    description={item?.description}
                    industry={item?.tag?.[0]?.tag_value || ""}
                    year={item?.tag?.[1]?.tag_value || ""}
                    website={item?.website_link || "/"}
                    buttonText="Visit Website"
                  />
                </div>
              ))}

            </Slider>
          </div>
          <div className="allCards mobile">
            <Slider {...settingsM}>

              {companiesData?.portfolio?.portfolio_card?.map((item, index) => (
                <div>
                  <PortfolioCard
                    key={index}
                    companyName={item?.title}
                    thumbnail={item?.image?.url}
                    description={item?.description}
                    industry={item?.tag?.[0]?.tag_value || ""}
                    year={item?.tag?.[1]?.tag_value || ""}
                    website={item?.website_link || "/"}
                    buttonText="Visit Website"
                  />
                </div>
              ))}

            </Slider>
          </div>
        </section>

        <section className="homeSectors">
          <div className="heading">
            <span className="caption">
              <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                <defs>
                  <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#368CFC" />
                    <stop offset="1" stopColor="#2BDDD7" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#368CFC" />
                    <stop offset="1" stopColor="#2BDDD7" />
                  </linearGradient>
                </defs>
              </svg>
              NAVYUG FOCUS VERTICALS
            </span>
            <h2 dangerouslySetInnerHTML={{
              __html:
                homeData?.navyug_focus?.focus_description
            }}></h2>
          </div>
          <img src={SE} className="top" />
          <img src={SE} className="bottom" />
          <div className="circleContent">
            <img src={homeData?.navyug_focus?.focus_image?.url} alt={homeData?.navyug_focus?.focus_image?.alt} className="content" />
            <img src={CR} className="scanner" />
          </div>
        </section>

        <section className="homeBlogs">
          <div className="heading">
            <div className="headingCover">
              <span className="caption">
                <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                  <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                  <defs>
                    <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#368CFC" />
                      <stop offset="1" stopColor="#2BDDD7" />
                    </linearGradient>
                  </defs>
                </svg>
                BLOGS
              </span>
              <div className="headingSide">
                <h2>Media Releases <br />and Blogs</h2>
              </div>
            </div>

            <div className="contentSide">
              <p>Insights, announcements, and perspectives from across the Navyug ecosystem. Explore official media releases, partnership updates, sector-led commentary, and thought leadership that reflect how we collaborate with founders, operators, and institutions to build future-ready businesses</p>
              <a className="btn btn2" href="/blogs">Show All
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>
          <div className="allCards desktop">

            {/* FEATURED BLOG */}
            {featuredBlog && (
              <BlogCards
                className="featured"
                title={
                  featuredBlog.hero_section?.title ||
                  featuredBlog.title
                }
                banner={
                  featuredBlog.hero_section?.image?.url ||
                  FallbackImage
                }
                description={
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        featuredBlog.hero_section?.description ||
                        featuredBlog.excerpt,
                    }}
                  />
                }
                tag={
                  featuredBlog.hero_section?.tags?.[0]?.tags || ""
                }
                date={featuredBlog.date}
                link={`/blogs/${featuredBlog.slug}`}
              />
            )}

            {/* ONLY 3 BLOGS IN SLIDER */}
            <Slider {...settings}>
              {filteredRemainingBlogs
                .slice(0, 3)
                .map((blog) => (
                  <div key={blog.id}>
                    <BlogCards
                      className="normalCard"
                      title={
                        blog.hero_section?.title ||
                        blog.title
                      }
                      banner={
                        blog.hero_section?.image?.url ||
                        FallbackImage
                      }
                      description={
                        <div
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              blog.hero_section?.description ||
                              blog.excerpt,
                          }}
                        />
                      }
                      tag={
                        blog.hero_section?.tags?.[0]?.tags || ""
                      }
                      date={blog.date}
                      link={`/blogs/${blog.slug}`}
                    />
                  </div>
                ))}
            </Slider>

          </div>
          <div className="allCards mobile">

            {/* FEATURED BLOG */}
            {featuredBlog && (
              <BlogCards
                className="featured"
                title={
                  featuredBlog.hero_section?.title ||
                  featuredBlog.title
                }
                banner={
                  featuredBlog.hero_section?.image?.url ||
                  FallbackImage
                }
                description={
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        featuredBlog.hero_section?.description ||
                        featuredBlog.excerpt,
                    }}
                  />
                }
                tag={
                  featuredBlog.hero_section?.tags?.[0]?.tags || ""
                }
                date={featuredBlog.date}
                link={`/blogs/${featuredBlog.slug}`}
              />
            )}

            {/* ONLY 3 BLOGS IN SLIDER */}
            <Slider {...settingsM}>
              {filteredRemainingBlogs
                .slice(0, 3)
                .map((blog) => (
                  <div key={blog.id}>
                    <BlogCards
                      className="normalCard"
                      title={
                        blog.hero_section?.title ||
                        blog.title
                      }
                      banner={
                        blog.hero_section?.image?.url ||
                        FallbackImage
                      }
                      description={
                        <div
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          dangerouslySetInnerHTML={{
                            __html:
                              blog.hero_section?.description ||
                              blog.excerpt,
                          }}
                        />
                      }
                      tag={
                        blog.hero_section?.tags?.[0]?.tags || ""
                      }
                      date={blog.date}
                      link={`/blogs/${blog.slug}`}
                    />
                  </div>
                ))}
            </Slider>

          </div>
        </section>
      </main>
    </>
  )
}

export default Home
