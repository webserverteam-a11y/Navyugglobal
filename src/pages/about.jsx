import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AV from "../assets/aboutvision.png"
import AM from "../assets/aboutmission.png"
import AA from "../assets/aboutapproach.png"
import Nikhil from "../assets/nikhil.png"
import useFetch from "../services/useFetch";
import { getAboutPageData } from "../services/api"
import Loader from "../components/loader";
import { Helmet } from "react-helmet-async"

gsap.registerPlugin(ScrollTrigger)

function About() {
  const mainRef = useRef(null)
  const ctxRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)

  const {
    data: aboutData,
    loading,
    error,
  } = useFetch(getAboutPageData);


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
    if (loading || error || !aboutData || !mainRef.current) return

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
        .from(".aboutHero", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(".aboutHero .content h1", {
          y: 70,
          opacity: 0,
          duration: 1.1,
        }, "-=1.0")
        .from(".aboutHero .content p", {
          y: 40,
          opacity: 0,
          duration: 0.9,
        }, "-=0.75")
        .from(".aboutHero .content .btn", {
          y: 28,
          opacity: 0,
          duration: 0.7,
        }, "-=0.6")

      /* ─────────────────────────────────────────
         ABOUT WHAT
      ───────────────────────────────────────── */
      gsap.from(".aboutWhat .heading .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutWhat",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      splitReveal(".aboutWhat .heading h2", {
        start: "top 82%",
        end: "top 30%",
      })

      /* Vision & Mission cards — alternating slide-in */
      mainRef.current.querySelectorAll(".aboutWhat .aboutOur").forEach((el, i) => {
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
         LEADERSHIP
      ───────────────────────────────────────── */
      gsap.from(".aboutLeadership .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutLeadership",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      gsap.from(".aboutLeadership .contentSide h2", {
        y: 55,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutLeadership",
          start: "top 82%",
          end: "top 50%",
          scrub: 1.5,
        },
      })

      gsap.from(".aboutLeadership .contentSide p", {
        y: 40,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutLeadership .contentSide p",
          start: "top 88%",
          end: "top 55%",
          scrub: 1.5,
        },
      })

      /* Image side — scale + fade in from right */
      gsap.from(".aboutLeadership .imageSide", {
        x: 90,
        opacity: 0,
        scale: 0.96,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".aboutLeadership",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      /* Name & title row — subtle rise */
      gsap.from(".aboutLeadership .imageSide .row", {
        y: 20,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutLeadership .imageSide",
          start: "top 60%",
          end: "top 30%",
          scrub: 1.5,
        },
      })

      /* ─────────────────────────────────────────
         IMPACT (reused from home — same selectors)
      ───────────────────────────────────────── */
      gsap.from(".about .homeImpact", {
        scale: 0.97,
        transformOrigin: "center top",
        scrollTrigger: {
          trigger: ".about .homeImpact",
          start: "top 90%",
          end: "top 50%",
          scrub: 2,
        },
      })

      gsap.from(".about .homeImpact .impactRow .captionDiv", {
        x: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: ".about .homeImpact",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      gsap.from(".about .homeImpact .impactRow .content h2", {
        x: 80,
        opacity: 0,
        scrollTrigger: {
          trigger: ".about .homeImpact",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      gsap.from(".about .homeImpact .impactRow .content .btn", {
        x: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: ".about .homeImpact",
          start: "top 70%",
          end: "top 30%",
          scrub: 1.5,
        },
      })

      gsap.from(".about .homeImpact .numberWidget", {
        y: 90,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".about .homeImpact .numbersRow",
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
         APPROACH
      ───────────────────────────────────────── */
      gsap.from(".aboutApproach .caption", {
        y: 25,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutApproach",
          start: "top 88%",
          end: "top 65%",
          scrub: 1.5,
        },
      })

      gsap.from(".aboutApproach .headingSide h2", {
        x: 80,
        opacity: 0,
        scrollTrigger: {
          trigger: ".aboutApproach",
          start: "top 82%",
          end: "top 40%",
          scrub: 1.5,
        },
      })

      /* Approach image — scale in */
      gsap.from(".aboutApproach .headingSide img", {
        scale: 0.82,
        opacity: 0,
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: ".aboutApproach .headingSide img",
          start: "top 88%",
          end: "top 45%",
          scrub: 1.5,
        },
      })

      /* Approach cards — staggered rise */
      gsap.from(".aboutApproach .contentSide .card", {
        y: 80,
        opacity: 0,
        stagger: {
          each: 0.15,
          from: "start",
        },
        scrollTrigger: {
          trigger: ".aboutApproach .contentSide",
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
  }, [loading, error, aboutData])

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

  const icons = [
    // Support Icon
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3.75C16.7861 3.75 13.6443 4.70305 10.972 6.48862C8.29969 8.27419 6.21689 10.8121 4.98696 13.7814C3.75704 16.7507 3.43524 20.018 4.06225 23.1702C4.68926 26.3224 6.23692 29.2179 8.50952 31.4905C10.7821 33.7631 13.6776 35.3108 16.8298 35.9378C19.982 36.5648 23.2493 36.243 26.2186 35.013C29.1879 33.7831 31.7258 31.7003 33.5114 29.028C35.297 26.3557 36.25 23.2139 36.25 20C36.245 15.6918 34.5314 11.5614 31.485 8.515C28.4386 5.4686 24.3083 3.75496 20 3.75ZM33.75 20C33.7511 21.2681 33.576 22.5301 33.2297 23.75H27.2125C27.5958 21.2647 27.5958 18.7353 27.2125 16.25H33.2297C33.576 17.4699 33.7511 18.7319 33.75 20ZM15.9375 26.25H24.0625C23.2621 28.8728 21.8725 31.2778 20 33.2812C18.1283 31.2773 16.7388 28.8724 15.9375 26.25ZM15.3281 23.75C14.899 21.2684 14.899 18.7316 15.3281 16.25H24.6844C25.1135 18.7316 25.1135 21.2684 24.6844 23.75H15.3281ZM6.25001 20C6.24892 18.7319 6.42403 17.4699 6.77032 16.25H12.7875C12.4042 18.7353 12.4042 21.2647 12.7875 23.75H6.77032C6.42403 22.5301 6.24892 21.2681 6.25001 20ZM24.0625 13.75H15.9375C16.738 11.1272 18.1275 8.72216 20 6.71875C21.8718 8.72269 23.2612 11.1276 24.0625 13.75ZM32.2391 13.75H26.6734C25.972 11.1764 24.7897 8.75887 23.1891 6.625C25.123 7.08958 26.9336 7.96684 28.4967 9.19665C30.0599 10.4265 31.3386 11.9797 32.2453 13.75H32.2391ZM16.8109 6.625C15.2103 8.75887 14.0281 11.1764 13.3266 13.75H7.75469C8.66137 11.9797 9.94011 10.4265 11.5033 9.19665C13.0664 7.96684 14.877 7.08958 16.8109 6.625ZM7.75469 26.25H13.3266C14.0281 28.8236 15.2103 31.2411 16.8109 33.375C14.877 32.9104 13.0664 32.0332 11.5033 30.8034C9.94011 29.5735 8.66137 28.0203 7.75469 26.25ZM23.1891 33.375C24.7897 31.2411 25.972 28.8236 26.6734 26.25H32.2453C31.3386 28.0203 30.0599 29.5735 28.4967 30.8034C26.9336 32.0332 25.123 32.9104 23.1891 33.375Z" fill="url(#paint0_linear_3007_32228)" />
      <defs>
        <linearGradient id="paint0_linear_2962_18293" x1="20.0016" y1="7.50146" x2="20.0016" y2="35.0457" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1890FF" />
          <stop offset="1" stop-color="#145AFF" />
        </linearGradient>
      </defs>
    </svg>,

    // Build Icon
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.25 6.25H8.75C8.08696 6.25 7.45107 6.51339 6.98223 6.98223C6.51339 7.45107 6.25 8.08696 6.25 8.75V16.25C6.25 16.913 6.51339 17.5489 6.98223 18.0178C7.45107 18.4866 8.08696 18.75 8.75 18.75H16.25C16.913 18.75 17.5489 18.4866 18.0178 18.0178C18.4866 17.5489 18.75 16.913 18.75 16.25V8.75C18.75 8.08696 18.4866 7.45107 18.0178 6.98223C17.5489 6.51339 16.913 6.25 16.25 6.25ZM16.25 16.25H8.75V8.75H16.25V16.25ZM31.25 6.25H23.75C23.087 6.25 22.4511 6.51339 21.9822 6.98223C21.5134 7.45107 21.25 8.08696 21.25 8.75V16.25C21.25 16.913 21.5134 17.5489 21.9822 18.0178C22.4511 18.4866 23.087 18.75 23.75 18.75H31.25C31.913 18.75 32.5489 18.4866 33.0178 18.0178C33.4866 17.5489 33.75 16.913 33.75 16.25V8.75C33.75 8.08696 33.4866 7.45107 33.0178 6.98223C32.5489 6.51339 31.913 6.25 31.25 6.25ZM31.25 16.25H23.75V8.75H31.25V16.25ZM16.25 21.25H8.75C8.08696 21.25 7.45107 21.5134 6.98223 21.9822C6.51339 22.4511 6.25 23.087 6.25 23.75V31.25C6.25 31.913 6.51339 32.5489 6.98223 33.0178C7.45107 33.4866 8.08696 33.75 8.75 33.75H16.25C16.913 33.75 17.5489 33.4866 18.0178 33.0178C18.4866 32.5489 18.75 31.913 18.75 31.25V23.75C18.75 23.087 18.4866 22.4511 18.0178 21.9822C17.5489 21.5134 16.913 21.25 16.25 21.25ZM16.25 31.25H8.75V23.75H16.25V31.25ZM31.25 21.25H23.75C23.087 21.25 22.4511 21.5134 21.9822 21.9822C21.5134 22.4511 21.25 23.087 21.25 23.75V31.25C21.25 31.913 21.5134 32.5489 21.9822 33.0178C22.4511 33.4866 23.087 33.75 23.75 33.75H31.25C31.913 33.75 32.5489 33.4866 33.0178 33.0178C33.4866 32.5489 33.75 31.913 33.75 31.25V23.75C33.75 23.087 33.4866 22.4511 33.0178 21.9822C32.5489 21.5134 31.913 21.25 31.25 21.25ZM31.25 31.25H23.75V23.75H31.25V31.25Z" fill="url(#paint0_linear_3007_32228)" />
      <defs>
        <linearGradient id="paint0_linear_3007_32228" x1="20" y1="6.25" x2="20" y2="33.75" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1890FF" />
          <stop offset="1" stop-color="#145AFF" />
        </linearGradient>
      </defs>
    </svg>,

    // Partner Icon
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38.25 23.5001C38.1187 23.5986 37.9692 23.6703 37.8102 23.711C37.6512 23.7517 37.4857 23.7608 37.3232 23.7376C37.1607 23.7143 37.0044 23.6593 36.8631 23.5757C36.7219 23.4921 36.5985 23.3814 36.5 23.2501C35.7466 22.2374 34.7659 21.4157 33.6369 20.8512C32.5079 20.2867 31.2622 19.9952 30 20.0001C29.7542 20.0001 29.5138 19.9276 29.309 19.7917C29.1042 19.6558 28.944 19.4625 28.8484 19.2361C28.7835 19.0823 28.7501 18.917 28.7501 18.7501C28.7501 18.5832 28.7835 18.418 28.8484 18.2642C28.944 18.0377 29.1042 17.8444 29.309 17.7085C29.5138 17.5726 29.7542 17.5001 30 17.5001C30.7013 17.5001 31.3886 17.3033 31.9838 16.9322C32.5789 16.5611 33.0581 16.0306 33.3668 15.4008C33.6755 14.771 33.8015 14.0673 33.7303 13.3696C33.6591 12.6718 33.3937 12.008 32.9642 11.4536C32.5347 10.8991 31.9583 10.4762 31.3005 10.233C30.6426 9.98967 29.9298 9.93573 29.2428 10.0773C28.5559 10.2188 27.9225 10.5502 27.4144 11.0337C26.9063 11.5172 26.5441 12.1335 26.3687 12.8126C26.3277 12.9716 26.2557 13.121 26.157 13.2522C26.0582 13.3834 25.9346 13.4939 25.7931 13.5773C25.6516 13.6608 25.4951 13.7155 25.3325 13.7385C25.1699 13.7614 25.0043 13.7521 24.8453 13.7111C24.6863 13.67 24.5369 13.5981 24.4057 13.4993C24.2745 13.4005 24.164 13.2769 24.0806 13.1354C23.9971 12.9939 23.9424 12.8374 23.9194 12.6748C23.8965 12.5122 23.9058 12.3466 23.9469 12.1876C24.1902 11.2459 24.65 10.374 25.2897 9.64129C25.9293 8.90856 26.7311 8.33523 27.6313 7.96691C28.5315 7.5986 29.5052 7.44546 30.475 7.5197C31.4448 7.59393 32.3839 7.89348 33.2176 8.39451C34.0513 8.89554 34.7565 9.58423 35.2771 10.4058C35.7978 11.2273 36.1195 12.159 36.2168 13.1268C36.314 14.0946 36.184 15.0717 35.8371 15.9803C35.4902 16.889 34.9361 17.7042 34.2187 18.3611C35.9184 19.097 37.396 20.2648 38.5047 21.7486C38.6032 21.8802 38.6747 22.03 38.7152 22.1894C38.7557 22.3487 38.7644 22.5145 38.7407 22.6772C38.7171 22.8399 38.6615 22.9963 38.5773 23.1375C38.4931 23.2787 38.3819 23.402 38.25 23.5001ZM29.8312 33.1251C29.9217 33.2674 29.9824 33.4265 30.0098 33.5928C30.0371 33.7592 30.0306 33.9294 29.9904 34.0931C29.9503 34.2568 29.8775 34.4108 29.7764 34.5457C29.6752 34.6805 29.5478 34.7936 29.4019 34.8779C29.2559 34.9623 29.0944 35.0163 28.9271 35.0366C28.7597 35.0569 28.59 35.0432 28.4281 34.9962C28.2662 34.9492 28.1154 34.87 27.9849 34.7633C27.8544 34.6565 27.7469 34.5245 27.6687 34.3751C26.8813 33.0418 25.7599 31.9368 24.415 31.1692C23.0702 30.4016 21.5485 29.9978 20 29.9978C18.4515 29.9978 16.9298 30.4016 15.5849 31.1692C14.2401 31.9368 13.1187 33.0418 12.3312 34.3751C12.2531 34.5245 12.1455 34.6565 12.015 34.7633C11.8846 34.87 11.7338 34.9492 11.5719 34.9962C11.41 35.0432 11.2403 35.0569 11.0729 35.0366C10.9055 35.0163 10.744 34.9623 10.5981 34.8779C10.4521 34.7936 10.3247 34.6805 10.2236 34.5457C10.1224 34.4108 10.0496 34.2568 10.0095 34.0931C9.96941 33.9294 9.96284 33.7592 9.9902 33.5928C10.0176 33.4265 10.0783 33.2674 10.1687 33.1251C11.3806 31.0429 13.2284 29.4043 15.4406 28.4501C14.1958 27.497 13.281 26.1779 12.8247 24.678C12.3684 23.1781 12.3936 21.5729 12.8967 20.0881C13.3999 18.6033 14.3557 17.3134 15.6298 16.3999C16.9039 15.4864 18.4322 14.9951 20 14.9951C21.5677 14.9951 23.0961 15.4864 24.3702 16.3999C25.6443 17.3134 26.6001 18.6033 27.1032 20.0881C27.6064 21.5729 27.6316 23.1781 27.1753 24.678C26.719 26.1779 25.8042 27.497 24.5594 28.4501C26.7716 29.4043 28.6194 31.0429 29.8312 33.1251ZM20 27.5001C20.9889 27.5001 21.9556 27.2069 22.7778 26.6575C23.6001 26.1081 24.2409 25.3272 24.6194 24.4135C24.9978 23.4999 25.0968 22.4946 24.9039 21.5247C24.711 20.5548 24.2348 19.6638 23.5355 18.9646C22.8363 18.2653 21.9453 17.7891 20.9754 17.5962C20.0055 17.4033 19.0002 17.5023 18.0866 17.8807C17.1729 18.2592 16.392 18.9 15.8426 19.7223C15.2932 20.5445 15 21.5112 15 22.5001C15 23.8262 15.5268 25.098 16.4645 26.0357C17.4021 26.9733 18.6739 27.5001 20 27.5001ZM11.25 18.7501C11.25 18.4186 11.1183 18.1007 10.8839 17.8662C10.6494 17.6318 10.3315 17.5001 9.99998 17.5001C9.29862 17.5001 8.61133 17.3033 8.01619 16.9322C7.42104 16.5611 6.94189 16.0306 6.63316 15.4008C6.32443 14.771 6.1985 14.0673 6.26967 13.3696C6.34084 12.6718 6.60626 12.008 7.03578 11.4536C7.4653 10.8991 8.0417 10.4762 8.69952 10.233C9.35733 9.98967 10.0702 9.93573 10.7571 10.0773C11.4441 10.2188 12.0775 10.5502 12.5856 11.0337C13.0936 11.5172 13.4559 12.1335 13.6312 12.8126C13.7141 13.1338 13.9212 13.4089 14.2069 13.5773C14.4926 13.7458 14.8335 13.7939 15.1547 13.7111C15.4758 13.6282 15.7509 13.4211 15.9194 13.1354C16.0879 12.8497 16.136 12.5088 16.0531 12.1876C15.8097 11.2459 15.3499 10.374 14.7103 9.64129C14.0707 8.90856 13.2689 8.33523 12.3687 7.96691C11.4685 7.5986 10.4947 7.44546 9.52492 7.5197C8.55512 7.59393 7.61603 7.89348 6.78237 8.39451C5.94871 8.89554 5.24349 9.58423 4.72283 10.4058C4.20217 11.2273 3.88043 12.159 3.78322 13.1268C3.68601 14.0946 3.816 15.0717 4.16287 15.9803C4.50973 16.889 5.06388 17.7042 5.78124 18.3611C4.08324 19.0977 2.60735 20.2655 1.49999 21.7486C1.30087 22.0138 1.21526 22.3472 1.262 22.6756C1.30873 23.0039 1.48399 23.3002 1.7492 23.4993C2.01442 23.6985 2.34787 23.7841 2.67621 23.7373C3.00455 23.6906 3.30087 23.5153 3.49999 23.2501C4.2534 22.2374 5.23407 21.4157 6.36304 20.8512C7.49202 20.2867 8.73776 19.9952 9.99998 20.0001C10.3315 20.0001 10.6494 19.8684 10.8839 19.634C11.1183 19.3996 11.25 19.0816 11.25 18.7501Z" fill="url(#paint0_linear_3007_32228)" />
      <defs>
        <linearGradient id="paint0_linear_3007_32228" x1="20" y1="6.25" x2="20" y2="33.75" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1890FF" />
          <stop offset="1" stop-color="#145AFF" />
        </linearGradient>
      </defs>
    </svg>,
  ];

  return (
    <>
      <Helmet>
        <title>{aboutData?.seo?.meta_title}</title>
        <meta name="description" content={aboutData?.seo?.meta_description}></meta>
        <link rel="canonical" href={aboutData?.seo?.meta_canonical} />
      </Helmet>
      {showLoader && <Loader />}
      <main className="about" ref={mainRef}>
        <section className="commonHero aboutHero" >
          <div
            className="content"
            style={{
              backgroundImage: aboutData?.hero_section?.background?.url
                ? `url(${aboutData.hero_section.background.url})`
                : {},
            }}
          >
            <h1
              dangerouslySetInnerHTML={{
                __html:
                  aboutData?.hero_section?.hero_title ||
                  "<i>Powering Visionaries</i>  Behind Growing Businesses",
              }}
            ></h1>
            <p>{aboutData?.hero_section?.hero_description}</p>
            <a className="btn btn4"
              href="#aboutWhat"
              onClick={(e) => {
                e.preventDefault()
                window.lenis?.scrollTo("#aboutWhat", { duration: 1.4 })
              }}>{aboutData?.hero_section?.hero_link?.title}
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6464 5.64648C11.8417 5.45121 12.1582 5.45121 12.3535 5.64648C12.5487 5.84174 12.5487 6.15825 12.3535 6.35351L8.35348 10.3535C8.15822 10.5488 7.84171 10.5488 7.64645 10.3535L3.64645 6.35351C3.45118 6.15825 3.45118 5.84174 3.64645 5.64648C3.84171 5.45121 4.15822 5.45121 4.35348 5.64648L7.99996 9.29296L11.6464 5.64648Z" fill="white" />
              </svg>
            </a>
          </div>
        </section>
        <section className="aboutWhat" id="aboutWhat">
          <div className="heading">
            <span className="caption">
              <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                <defs>
                  <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                </defs>
              </svg>
              {aboutData?.what_drives_us?.what_drives_us_title}
            </span>
            <h2>{aboutData?.what_drives_us?.what_drives_us_description}</h2>
          </div>
          <div className="whatRow">
            <div className="aboutOur">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 26.7153C39.906 27.2155 39.8225 27.7157 39.7077 28.1951C38.6114 32.5094 34.6857 35.469 30.2275 35.3544C25.5188 35.2294 21.5305 31.5403 21.0711 26.882C21.0502 26.6215 21.0189 26.3714 20.9876 26.1004C20.3089 26.1004 19.6512 26.1004 18.983 26.1004C18.9203 27.278 18.701 28.4035 18.2625 29.4873C16.6442 33.4265 12.5933 35.7817 8.27083 35.2815C4.21985 34.8125 0.826641 31.5715 0.137558 27.5073C-0.238306 25.298 0.168881 23.2346 1.20251 21.2546C2.19437 19.358 3.08183 17.4092 4.02148 15.4813C4.07369 15.3771 4.11545 15.2729 4.17809 15.1687C4.35559 14.8664 4.68968 14.7518 4.97158 14.8977C5.24304 15.0332 5.35789 15.3562 5.22216 15.6689C4.94026 16.2941 4.62704 16.909 4.3347 17.5343C4.26162 17.6801 4.18854 17.8365 4.07369 18.0866C4.2825 17.9719 4.39735 17.899 4.52264 17.826C7.33117 16.1795 10.2337 15.9711 13.2406 17.2008C13.7209 17.3988 13.8775 17.8052 13.5956 18.1491C13.3659 18.4305 13.084 18.4096 12.7812 18.2742C11.6432 17.7739 10.4529 17.5759 9.21049 17.5968C5.21172 17.6697 1.67233 20.8794 1.22338 24.8499C0.71179 29.4039 3.65606 33.3223 8.1873 34.1143C12.4889 34.8646 16.8844 31.7904 17.6361 27.4864C18.1686 24.4331 17.2811 21.8486 15.0259 19.7123C14.8902 19.5872 14.6918 19.4101 14.6918 19.2642C14.6918 19.0557 14.7962 18.7848 14.9529 18.6389C15.1721 18.4409 15.4644 18.5138 15.6524 18.7327C16.2893 19.4517 16.9053 20.1812 17.5317 20.9107C17.6048 20.9941 17.657 21.1087 17.7614 21.265C17.7718 21.1191 17.7927 21.0358 17.7927 20.9524C17.7927 18.6806 17.8032 16.3983 17.7927 14.1265C17.7718 10.9793 15.1721 8.44701 12.0295 8.57206C9.89957 8.64501 8.29171 9.66628 7.24765 11.5212C6.92399 12.0944 6.66297 12.7093 6.37063 13.3033C6.16182 13.7201 5.85904 13.8556 5.53538 13.6993C5.20128 13.543 5.11775 13.2095 5.32657 12.7926C5.89036 11.6671 6.30799 10.4583 7.24765 9.56207C7.70703 9.12439 8.20819 8.71796 8.73022 8.37406C9.033 8.17606 9.24181 7.95722 9.3671 7.63416C9.76384 6.68584 10.3485 5.89383 11.2464 5.35193C12.729 4.46613 14.2638 4.39318 15.7777 5.22687C17.2916 6.05014 18.0537 7.38405 18.1164 9.10354C18.1164 9.20775 18.1268 9.31196 18.1164 9.41617C18.0642 10.2499 18.1268 11.0523 18.534 11.8235C18.7428 12.2299 18.8055 12.7093 18.9412 13.1782C19.6303 13.1782 20.3298 13.1782 20.9667 13.1782C21.2695 12.3966 21.614 11.6671 21.8124 10.9064C21.9377 10.427 21.8228 9.89555 21.8646 9.39533C21.9272 8.7909 21.9481 8.15522 22.1569 7.6029C22.8356 5.82088 24.172 4.81003 26.0722 4.68498C27.9202 4.55992 29.3714 5.37277 30.2693 6.99847C30.6556 7.70711 31.0732 8.29069 31.7832 8.72838C32.7855 9.35365 33.4537 10.302 33.9653 11.3649C35.4687 14.5017 36.9722 17.6385 38.5174 20.7648C39.029 21.8069 39.5615 22.8282 39.7807 23.9745C39.8538 24.3393 39.9165 24.7144 39.9791 25.0792C40 25.6315 40 26.1734 40 26.7153ZM30.5199 17.5864C25.926 17.5759 22.1882 21.2963 22.1778 25.8712C22.1778 30.4565 25.9051 34.1872 30.4886 34.1977C35.072 34.2081 38.8202 30.4773 38.8307 25.9024C38.8307 21.3171 35.1138 17.5968 30.5199 17.5864ZM22.1882 21.2963C23.6604 18.8577 25.6754 17.2841 28.3691 16.6693C31.0419 16.0545 33.5372 16.5547 35.8655 18.0553C35.8551 17.9719 35.8655 17.9407 35.8551 17.9198C34.811 15.7627 33.8087 13.5742 32.702 11.4379C31.5848 9.2807 29.0269 8.15522 26.6777 8.65543C24.1928 9.19733 22.3135 11.2295 22.2196 13.7201C22.1151 16.2108 22.1882 18.691 22.1882 21.2963ZM20.9876 24.902C20.9876 21.3797 20.9876 17.8781 20.9876 14.3871C20.3089 14.3871 19.6512 14.3871 19.0038 14.3871C19.0038 17.9094 19.0038 21.4005 19.0038 24.902C19.6616 24.902 20.3089 24.902 20.9876 24.902ZM16.9053 9.27028C17.1141 7.88427 16.0178 6.38362 14.5457 5.95635C13.0631 5.52909 11.3404 6.23772 10.7766 7.51953C13.1049 7.09226 15.1408 7.68627 16.9053 9.27028ZM29.1939 7.49869C28.6928 6.21689 26.803 5.4874 25.2996 5.99804C23.8901 6.46699 22.7729 8.13438 23.0966 9.24944C25.1743 7.59248 26.1244 7.32153 29.1939 7.49869Z" fill="currentColor" />
                <path d="M9.48236 18.8369C13.3976 18.8369 16.5611 21.9945 16.5611 25.9025C16.5611 29.7896 13.3663 32.968 9.46148 32.9576C5.56711 32.9472 2.39315 29.7687 2.40359 25.8608C2.41403 21.9737 5.57755 18.8265 9.48236 18.8369ZM9.4928 20.0041C6.23531 19.9937 3.59382 22.6198 3.57294 25.8504C3.5625 29.1226 6.19355 31.78 9.44059 31.7904C12.7085 31.8008 15.3709 29.1643 15.3813 25.9129C15.3918 22.6407 12.7607 20.0041 9.4928 20.0041Z" fill="currentColor" />
                <path d="M37.5782 25.3709C37.5782 29.6227 34.6653 32.7074 30.9275 32.947C27.2524 33.1867 23.9636 30.4772 23.4938 26.809C22.9509 22.6614 26.1666 18.8785 30.2906 18.8368C30.7814 18.8264 31.0633 19.0244 31.0737 19.3891C31.0841 19.7539 30.8127 19.9831 30.3324 20.004C27.054 20.1395 24.5692 22.7343 24.6005 25.9961C24.6318 28.9766 26.9392 31.4464 29.9983 31.7695C32.8277 32.0612 35.5945 30.0708 36.2523 27.2675C36.8996 24.4851 35.5527 21.7235 32.953 20.525C32.8799 20.4938 32.8068 20.4625 32.7442 20.4313C32.4101 20.2541 32.2848 19.9727 32.4205 19.6601C32.5563 19.337 32.8695 19.2328 33.2349 19.3787C34.4147 19.8685 35.3961 20.6188 36.1583 21.6401C37.1084 22.9011 37.5678 24.3392 37.5782 25.3709Z" fill="currentColor" />
                <defs>
                  <linearGradient id="paint0_linear_3089_854" x1="20" y1="4.64246" x2="20" y2="35.3576" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3089_854" x1="9.48235" y1="18.8369" x2="9.48235" y2="32.9576" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_3089_854" x1="30.506" y1="18.8364" x2="30.506" y2="32.9618" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                </defs>
              </svg>
              <h3>{aboutData?.what_drives_us?.vision?.our_vision_title}</h3>
              <p>{aboutData?.what_drives_us?.vision?.our_vision_description}</p>
              <img src={aboutData?.what_drives_us?.vision?.our_vision_image?.url}
                alt={aboutData?.what_drives_us?.vision?.our_vision_image?.alt} />
            </div>
            <div className="aboutOur">
              <svg viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 18.7494C0.101943 18.0136 0.172519 17.2779 0.313671 16.55C1.39584 10.7892 4.38355 6.28862 9.33171 3.11863C12.7272 0.942696 16.4677 -0.0670014 20.4984 0.00344265C22.3569 0.0347511 24.184 0.340009 25.9563 0.903561C26.4973 1.07576 26.7561 1.46711 26.7012 1.99153C26.6542 2.4455 26.3013 2.81338 25.8308 2.85251C25.6426 2.86817 25.4387 2.8212 25.2583 2.77424C19.4398 1.1462 14.0368 2.04632 9.17487 5.64679C5.37946 8.45673 3.06613 12.2685 2.27411 16.9178C1.34094 22.3733 2.67404 27.2888 6.195 31.5467C8.99451 34.9359 12.6174 37.0257 16.9696 37.738C22.7725 38.6929 27.9481 37.2057 32.2532 33.2139C36.7779 29.0186 38.6207 23.7509 37.8914 17.6223C37.7738 16.6595 37.5072 15.7125 37.2798 14.7654C37.1151 14.0923 37.3504 13.5365 37.915 13.38C38.4953 13.2156 38.9971 13.5365 39.201 14.2018C42.6436 25.6372 35.4526 37.4405 23.6743 39.6634C22.8823 39.8121 22.0824 39.8904 21.2826 40C20.4513 40 19.6123 40 18.781 40C18.6948 39.9765 18.6085 39.953 18.5223 39.9374C17.5969 39.8043 16.6559 39.7182 15.7463 39.5225C7.89666 37.8789 1.63109 31.3432 0.305829 23.4457C0.180361 22.7177 0.101943 21.982 0 21.2462C0 20.4166 0 19.5869 0 18.7494Z" fill="currentColor" />
                <path d="M20.1147 33.9575C13.2924 33.887 7.47378 28.9716 6.32888 22.2481C5.01146 14.5149 10.3831 7.18874 18.1856 6.12425C19.0718 6.00684 19.9814 6.03815 20.8754 6.0225C21.2596 6.01467 21.589 6.17121 21.8085 6.49995C22.0281 6.82869 22.0752 7.18091 21.8791 7.53313C21.6674 7.91666 21.3223 8.06537 20.891 8.02624C19.2678 7.86187 17.6759 8.0732 16.1625 8.65241C11.575 10.3979 8.82256 13.7009 8.23443 18.585C7.51298 24.518 11.1829 29.8326 16.9388 31.4684C23.5965 33.3626 30.6697 28.9638 31.8538 22.162C32.0185 21.1993 32.0185 20.1974 32.0185 19.2112C32.0185 18.5615 32.3244 18.0763 32.9203 18.0136C33.5006 17.951 34.0182 18.3659 34.0182 19.0155C34.0103 20.1583 34.0574 21.3245 33.8221 22.4281C32.5753 28.3219 28.9759 32.032 23.126 33.5348C22.1536 33.7853 21.1185 33.8244 20.1147 33.9575Z" fill="currentColor" />
                <path d="M29.376 13.9827C28.7486 13.9827 28.0585 13.8184 27.5175 14.0297C26.9921 14.241 26.6235 14.8359 26.1922 15.2664C24.4357 17.0118 22.6869 18.7651 20.9382 20.5105C20.6245 20.8236 20.2795 21.0271 19.8168 20.8862C19.1268 20.6827 18.8758 19.8844 19.3228 19.313C19.4169 19.1878 19.5345 19.086 19.6443 18.9686C21.691 16.9257 23.7377 14.875 25.7923 12.84C26.0118 12.6208 26.1059 12.4017 26.0981 12.0886C26.0824 11.1102 26.0981 10.1396 26.0903 9.16123C26.0903 8.74639 26.2236 8.40983 26.5216 8.12022C28.435 6.21823 30.3483 4.31625 32.2461 2.40643C32.5989 2.04638 32.991 1.87419 33.4772 2.07769C33.9556 2.27337 34.0889 2.67255 34.081 3.15783C34.0732 3.96403 34.0967 4.77022 34.0732 5.57641C34.0653 5.91298 34.183 5.99125 34.4966 5.98342C35.3043 5.95994 36.112 5.98342 36.9198 5.97559C37.4059 5.96777 37.8059 6.11648 37.9941 6.59394C38.1823 7.06356 38.0176 7.44709 37.6726 7.79148C35.7513 9.7013 33.8301 11.6189 31.9167 13.5366C31.6266 13.8262 31.305 13.9593 30.9051 13.9514C30.3954 13.9436 29.8857 13.9514 29.376 13.9514C29.376 13.9671 29.376 13.9749 29.376 13.9827ZM34.5829 8.06543C34.5672 8.03412 34.5594 8.00282 34.5437 7.97151C34.2379 7.97151 33.9242 7.95585 33.6184 7.97151C32.4264 8.04978 31.9951 7.61146 32.0814 6.45305C32.1049 6.13996 32.0814 5.81905 32.0814 5.459C31.9951 5.50597 31.9559 5.51379 31.9324 5.53728C30.6934 6.76613 29.4622 8.00282 28.2232 9.2395C28.1605 9.30212 28.0978 9.38822 28.0899 9.46649C28.0821 10.2805 28.0821 11.0945 28.0821 11.9477C28.6467 11.9477 29.1642 11.9007 29.6818 11.9555C30.3954 12.0416 30.8894 11.7755 31.3756 11.2589C32.4107 10.1709 33.5086 9.12992 34.5829 8.06543Z" fill="currentColor" />
                <path d="M12.1474 19.9314C12.1317 15.6734 15.4644 12.1747 19.7225 11.9712C19.8637 11.9634 20.0127 11.9555 20.1538 11.9712C20.6871 12.0103 21.087 12.4252 21.1027 12.9339C21.1184 13.4349 20.7655 13.8575 20.2479 13.9358C19.7225 14.0141 19.1814 14.0219 18.6639 14.1471C15.8879 14.8124 13.9118 17.4815 14.1235 20.2366C14.3587 23.2892 16.5701 25.5904 19.5265 25.8722C22.9612 26.2009 25.9332 23.6179 26.0744 20.1818C26.09 19.72 26.1685 19.2974 26.6233 19.0547C27.3212 18.6869 28.0975 19.1956 28.0818 20.0331C28.0426 21.9038 27.4623 23.6023 26.2312 25.019C24.0355 27.5393 21.2438 28.4708 18.0209 27.6019C14.8136 26.741 12.908 24.5337 12.2258 21.2855C12.1787 21.0663 12.1552 20.8471 12.1395 20.628C12.1317 20.401 12.1474 20.1662 12.1474 19.9314Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear_3089_678" x1="20.0322" y1="0" x2="20.0322" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3089_678" x1="20.0741" y1="6.02222" x2="20.0741" y2="33.9575" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_3089_678" x1="28.5859" y1="1.99084" x2="28.5859" y2="20.9317" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1890FF" />
                    <stop offset="1" stop-color="#145AFF" />
                  </linearGradient>
                </defs>
              </svg>
              <h3>{aboutData?.what_drives_us?.mission?.our_mission_title}</h3>
              <p>{aboutData?.what_drives_us?.mission?.our_mission_description}</p>
              <img src={aboutData?.what_drives_us?.mission?.our_mission_image?.url}
                alt={aboutData?.what_drives_us?.mission?.our_mission_image?.alt} />
            </div>
          </div>
        </section>
        <section className="aboutLeadership">
          <div className="contentSide">
            <span className="caption">
              <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                <defs>
                  <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                </defs>
              </svg>
              {aboutData?.leadership?.leadership_label}
            </span>
            <h2 dangerouslySetInnerHTML={{
              __html:
                aboutData?.leadership?.leadership_title?.leadership_title ||
                "People who <i>build.</i> <br /> People who <i>lead.</i>",
            }}></h2>
            <p dangerouslySetInnerHTML={{
              __html:
                aboutData?.leadership?.leadership_description,
            }}></p>
          </div>
          <div className="imageSide">
            <img src={
              aboutData?.leadership
                ?.leadership_profile_image?.url
            }
              alt={
                aboutData?.leadership
                  ?.leadership_profile_image?.alt
              } />
            <div className="row">
              <h4>{aboutData?.leadership?.leadership_name}</h4>
              <a href={aboutData?.leadership?.leadership_social_links?.url} target="_blank"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3C19.5304 3 20.039 3.21086 20.4141 3.58594C20.7891 3.96101 21 4.46957 21 5V19C21 19.5304 20.7891 20.039 20.4141 20.4141C20.039 20.7891 19.5304 21 19 21H5C4.46957 21 3.96101 20.7891 3.58594 20.4141C3.21086 20.039 3 19.5304 3 19V5C3 4.46957 3.21086 3.96101 3.58594 3.58594C3.96101 3.21086 4.46957 3 5 3H19ZM5.5 18.5H8.26953V10.1299H5.5V18.5ZM15.2402 9.94043C14.3902 9.94043 13.3999 10.4602 12.9199 11.2402V10.1299H10.1299V18.5H12.9199V13.5703C12.9199 12.8005 13.5398 12.1702 14.3096 12.1699C14.6808 12.1699 15.0373 12.3176 15.2998 12.5801C15.5624 12.8426 15.71 13.199 15.71 13.5703V18.5H18.5V13.2002C18.5 12.3356 18.1563 11.5059 17.5449 10.8945C16.9336 10.2834 16.1046 9.94049 15.2402 9.94043ZM6.87988 5.19043C6.43171 5.19046 6.00148 5.36766 5.68457 5.68457C5.36766 6.00148 5.19046 6.43171 5.19043 6.87988C5.19043 7.80984 5.94994 8.55951 6.87988 8.55957C7.32545 8.55957 7.7533 8.38342 8.06836 8.06836C8.38342 7.7533 8.55957 7.32545 8.55957 6.87988C8.55951 5.94994 7.80984 5.19043 6.87988 5.19043Z" fill="#142035" />
              </svg></a>
            </div>
            <p>{aboutData?.leadership?.leadership_designation}</p>
          </div>
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
                      <stop stop-color="#368CFC" />
                      <stop offset="1" stop-color="#2BDDD7" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#368CFC" />
                      <stop offset="1" stop-color="#2BDDD7" />
                    </linearGradient>
                  </defs>
                </svg>
                {aboutData?.impact?.impact_title}
              </span>
            </div>
            <div className="content">
              <h2>{aboutData?.impact?.impact_description}</h2>
              <Link className="btn btn1" to="/contact">Join With Us
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#142035" />
                </svg>
              </Link>
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

                <h5>{item?.impact_card_count}+</h5>
              </div>
            ))}
          </div>
          <p className="disc">*The numbers provided are subject to change.</p>
        </section>
        <section className="aboutApproach">
          <div className="headingSide">
            <span className="caption">
              <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10" height="10" rx="5" fill="url(#paint0_linear_3057_684)" />
                <rect width="10" height="10" rx="5" fill="url(#paint1_linear_3057_684)" />
                <defs>
                  <linearGradient id="paint0_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_3057_684" x1="0" y1="5" x2="10" y2="5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#368CFC" />
                    <stop offset="1" stop-color="#2BDDD7" />
                  </linearGradient>
                </defs>
              </svg>
              {aboutData?.our_approach?.title}
            </span>
            <h2 dangerouslySetInnerHTML={{
              __html: aboutData?.our_approach?.description,
            }}></h2>
            <img
              src={aboutData?.our_approach?.image?.url}
              alt={aboutData?.our_approach?.image?.alt || "Approach"}
            />
          </div>
          <div className="contentSide">
            {
              aboutData?.our_approach?.approach_card?.map((card, index) => (
                <div className="card" key={index}>
                  {icons[index]}
                  <h4>{card?.approach_card_title}</h4>
                  <p>{card?.approach_card_description}</p>
                </div>
              ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default About