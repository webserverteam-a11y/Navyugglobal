import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import V1 from "../assets/v1.png"
import V2 from "../assets/v2.png"
import V3 from "../assets/v3.png"
import V4 from "../assets/v4.png"
import P from "../assets/pattern1.svg"
import useFetch from "../services/useFetch";
import { getVerticalsPageData } from "../services/api"
import Loader from "../components/loader";
import { Helmet } from "react-helmet-async"

gsap.registerPlugin(ScrollTrigger)

function Verticals() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)
  const {
    data: verticalsData,
    loading,
    error,
  } = useFetch(getVerticalsPageData);


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
    if (loading || error || !verticalsData || !mainRef.current) return
    const ctx = gsap.context(() => {

      gsap.to(".loader", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => setShowLoader(false)
      })

      /* ─────────────────────────────────────────
         HERO — entrance
      ───────────────────────────────────────── */
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } })
      heroTl
        .from(".verticalsHero", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(".verticalsHero .content h1", {
          y: 70,
          opacity: 0,
          duration: 1.1,
        }, "-=1.0")
        .from(".verticalsHero .content p", {
          y: 40,
          opacity: 0,
          duration: 0.9,
        }, "-=0.75")
        .from(".verticalsHero .content .btn", {
          y: 28,
          opacity: 0,
          duration: 0.7,
        }, "-=0.6")


      /* ─────────────────────────────────────────
         VERTICALS FOCUS
      ───────────────────────────────────────── */

      /* Decorative pattern images drift from opposite sides */
      gsap.from(".verticalsFocus .top", {
        x: 120,
        opacity: 0,
        scrollTrigger: {
          trigger: ".verticalsFocus",
          start: "top 85%",
          end: "top 45%",
          scrub: 2,
        },
      })

      gsap.from(".verticalsFocus .bottom", {
        x: -120,
        opacity: 0,
        scrollTrigger: {
          trigger: ".verticalsFocus .bottom",
          start: "top 85%",
          end: "top 45%",
          scrub: 2,
        },
      })

      gsap.from(".verticalsFocus .heading .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".verticalsFocus",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      splitReveal(".verticalsFocus .heading h2", {
        start: "top 82%",
        end: "top 35%",
      })

      gsap.from(".verticalsFocus .heading p", {
        y: 35,
        opacity: 0,
        scrollTrigger: {
          trigger: ".verticalsFocus .heading p",
          start: "top 88%",
          end: "top 55%",
          scrub: 1.5,
        },
      })


      /* ─────────────────────────────────────────
         WHAT WE DO
      ───────────────────────────────────────── */
      gsap.from(".whatwedo .heading .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".whatwedo",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      gsap.from(".whatwedo .heading h2", {
        y: 55,
        opacity: 0,
        scrollTrigger: {
          trigger: ".whatwedo",
          start: "top 82%",
          end: "top 50%",
          scrub: 1.5,
        },
      })

      /* Vertical cards — alternating slide-in matching home verticals */
      mainRef.current.querySelectorAll(".whatwedo .allVertices .vertical").forEach((el, i) => {
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

    }, mainRef)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [loading, error, verticalsData])

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
        <title>{verticalsData?.seo?.meta_title}</title>
        <meta name="description" content={verticalsData?.seo?.meta_description}></meta>
        <link rel="canonical" href={verticalsData?.seo?.meta_canonical} />
      </Helmet>
      {showLoader && <Loader />}
      <main className="verticals" ref={mainRef}>
        <section className="commonHero verticalsHero">
          <div
            className="content"
            style={{
              backgroundImage: verticalsData?.hero_section?.background?.url
                ? `url(${verticalsData.hero_section.background.url})`
                : {},
            }}
          >
            <h1 dangerouslySetInnerHTML={{
              __html:
                verticalsData?.hero_section?.title ||
                "A new-age company driving <i>growth across</i> multiple industries",
            }}></h1>
            <p dangerouslySetInnerHTML={{
              __html:
                verticalsData?.hero_section?.description
            }}></p>
            <a className="btn btn4" href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                window.lenis?.scrollTo("#verticals", { duration: 1.4 })
              }}>{verticalsData?.hero_section?.link?.title}
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6464 5.64648C11.8417 5.45121 12.1582 5.45121 12.3535 5.64648C12.5487 5.84174 12.5487 6.15825 12.3535 6.35351L8.35348 10.3535C8.15822 10.5488 7.84171 10.5488 7.64645 10.3535L3.64645 6.35351C3.45118 6.15825 3.45118 5.84174 3.64645 5.64648C3.84171 5.45121 4.15822 5.45121 4.35348 5.64648L7.99996 9.29296L11.6464 5.64648Z" fill="white" />
              </svg>
            </a>
          </div>
        </section>

        <section className="verticalsFocus" id="verticals">
          <img src={P} className="top" />
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
              {verticalsData?.our_focus?.label}
            </span>
            <h2>{verticalsData?.our_focus?.title}</h2>
            <p>{verticalsData?.our_focus?.description}</p>
          </div>
          <img src={P} className="bottom" />
          <div className="focusImage" style={
            verticalsData?.our_focus?.image?.url
              ? {
                backgroundImage: `url(${verticalsData?.our_focus.image.url})`,
              }
              : {}
          }></div>
        </section>

        <section className="whatwedo">
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
              {verticalsData?.what_we_do?.label}
            </span>
            <h2>{verticalsData?.what_we_do?.title}</h2>
          </div>
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
                </div>

                <img src={card.card_image?.url} alt={card.card_image?.alt} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Verticals