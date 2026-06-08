import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import PDRL from "../assets/pdrl.png"
import SC from "../assets/shrinithi-capital.png"
import SM from "../assets/savemom.png"
import JM from "../assets/jupiter-meta.png"
import PortfolioCard from "../components/portfoliocard"
import useFetch from "../services/useFetch";
import { getCompaniesPageData } from "../services/api"
import Loader from "../components/loader";
import { Helmet } from "react-helmet-async"

gsap.registerPlugin(ScrollTrigger)

function Companies() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)

  const {
    data: companiesData,
    loading,
    error,
  } = useFetch(getCompaniesPageData);

  useEffect(() => {
    if (loading || error || !companiesData || !mainRef.current) return

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
        .from(".companiesHero", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(".companiesHero .content h1", {
          y: 70,
          opacity: 0,
          duration: 1.1,
        }, "-=1.0")
        .from(".companiesHero .content p", {
          y: 40,
          opacity: 0,
          duration: 0.9,
        }, "-=0.75")
        .from(".companiesHero .content .btn", {
          y: 28,
          opacity: 0,
          duration: 0.7,
        }, "-=0.6")

      /* ─────────────────────────────────────────
         PORTFOLIO HEADING
      ───────────────────────────────────────── */
      gsap.from(".fullPortfolio .heading h2", {
        y: 55,
        opacity: 0,
        scrollTrigger: {
          trigger: ".fullPortfolio",
          start: "top 88%",
          end: "top 55%",
          scrub: 1.5,
        },
      })

      /* ─────────────────────────────────────────
         PORTFOLIO CARDS — staggered rise
      ───────────────────────────────────────── */
      gsap.from(".fullPortfolio .allCards > *", {
        y: 80,
        opacity: 0,
        stagger: {
          each: 0.12,
          from: "start",
        },
        scrollTrigger: {
          trigger: ".fullPortfolio .allCards",
          start: "top 88%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

    }, mainRef)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [loading, error, companiesData])

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
        <title>{companiesData?.seo?.meta_title}</title>
        <meta name="description" content={companiesData?.seo?.meta_description}></meta>
        <link rel="canonical" href={companiesData?.seo?.meta_canonical} />
      </Helmet>
      {showLoader && <Loader />}
      <main className="companies" ref={mainRef}>
        <section className="commonHero companiesHero">
          <div
            className="content"
            style={{
              backgroundImage: companiesData?.hero_section?.background?.url
                ? `url(${companiesData.hero_section.background.url})`
                : {},
            }}
          >
            <h1
              dangerouslySetInnerHTML={{
                __html:
                  companiesData?.hero_section?.title ||
                  "We Back Teams Building <i>Next-Generation</i> Businesses",
              }}
            ></h1>
            <p dangerouslySetInnerHTML={{
              __html:
                companiesData?.hero_section?.description
            }}></p>
            <a className="btn btn4" href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                window.lenis?.scrollTo("#portfolio", { duration: 1.4 })
              }}>{companiesData?.hero_section?.link?.title}
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6464 5.64648C11.8417 5.45121 12.1582 5.45121 12.3535 5.64648C12.5487 5.84174 12.5487 6.15825 12.3535 6.35351L8.35348 10.3535C8.15822 10.5488 7.84171 10.5488 7.64645 10.3535L3.64645 6.35351C3.45118 6.15825 3.45118 5.84174 3.64645 5.64648C3.84171 5.45121 4.15822 5.45121 4.35348 5.64648L7.99996 9.29296L11.6464 5.64648Z" fill="white" />
              </svg>
            </a>
          </div>
        </section>

        <section className="fullPortfolio" id="portfolio">
          <div className="heading">
            <h2>{companiesData?.portfolio?.title}</h2>
          </div>
          <div className="allCards">
            {companiesData?.portfolio?.portfolio_card?.map((item, index) => (
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
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Companies