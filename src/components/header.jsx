import { useState, useEffect, useRef } from "react"
import Logo from "../assets/logo.svg"

function Header() {
  const [visible, setVisible] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const lastScrollY = useRef(0)

  const currentPath = window.location.pathname

useEffect(() => {
  const handleScroll = ({ scroll }) => {
    if (mobileNavOpen) {
      setVisible(true)
      return
    }

    const currentScroll = scroll
    const diff = currentScroll - lastScrollY.current

    if (Math.abs(diff) < 10) return

    if (diff < 0 || currentScroll < 10) {
      setVisible(true)
    } else {
      setVisible(false)
    }

    lastScrollY.current = currentScroll
  }

  const interval = setInterval(() => {
    if (window.lenis) {
      window.lenis.on("scroll", handleScroll)
      clearInterval(interval)
    }
  }, 50)

  return () => {
    clearInterval(interval)

    if (window.lenis) {
      window.lenis.off("scroll", handleScroll)
    }
  }
}, [mobileNavOpen])

  return (
    <header className={visible ? "header-visible" : "header-hidden"}>
      <div className="logoSide">
        <a className="logo" href="/">
          <img src={Logo} alt="Navyug Logo" />
        </a>

        <span
          className="mobile menuIcon"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="47"
              height="47"
              rx="23.5"
              fill="#032886"
            />
            <rect
              x="0.5"
              y="0.5"
              width="47"
              height="47"
              rx="23.5"
              stroke="#032886"
            />
            <g clipPath="url(#clip0_3197_6521)">
              <rect x="12" y="20.5" width="24" height="1" fill="white" />
              <rect x="12" y="26.5" width="24" height="1" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_3197_6521">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(12 12)"
                />
              </clipPath>
            </defs>
          </svg>
        </span>
      </div>

      <nav className={mobileNavOpen ? "nav-open" : ""}>
        <a href="/" className={currentPath === "/" ? "active" : ""}>
          Home
        </a>

        <a
          href="/about-us"
          className={currentPath === "/about-us" ? "active" : ""}
        >
          About us
        </a>

        <a
          href="/companies"
          className={currentPath === "/companies" ? "active" : ""}
        >
          Companies
        </a>

        <a
          href="/verticals"
          className={currentPath === "/verticals" ? "active" : ""}
        >
          Verticals
        </a>

        <a
          href="/blogs"
          className={currentPath === "/blogs" ? "active" : ""}
        >
          Blogs
        </a>

        <a
          href="/contact"
          className={
            currentPath === "/contact"
              ? "btn btn3 active"
              : "btn btn3"
          }
        >
          Pitch to Us
        </a>
      </nav>
    </header>
  )
}

export default Header