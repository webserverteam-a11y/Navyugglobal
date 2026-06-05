import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useFetch from "../services/useFetch";
import { getContactPageData } from "../services/api"
import Loader from "../components/loader";
import { Helmet } from "react-helmet-async";
import CH from "../assets/contactheading.png"


gsap.registerPlugin(ScrollTrigger)

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  message: "",
  attachments: [],
}

const CONTACT_FORM_ENDPOINT =
  import.meta.env.VITE_CONTACT_FORM_ENDPOINT ||
  "https://lightgray-magpie-707312.hostingersite.com/wp-json/custom/v1/contact-form"

const MAX_ATTACHMENTS = 5
const MAX_ATTACHMENT_SIZE_BYTES = 20 * 1024 * 1024
const MAX_TOTAL_ATTACHMENT_SIZE_BYTES = 20 * 1024 * 1024

function Contact() {

  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setSubmitMessage("")
    setSubmitError("")

    if (name === "attachments") {
      const selectedFiles = Array.from(files)

      let fileErrors = []

      if (selectedFiles.length > MAX_ATTACHMENTS) {
        fileErrors.push(`You can upload a maximum of ${MAX_ATTACHMENTS} files.`)
      }

      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > MAX_ATTACHMENT_SIZE_BYTES
      )

      if (oversizedFiles.length > 0) {
        fileErrors.push("Each file must be less than 20MB.")
      }

      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

      if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        fileErrors.push("Total upload size must be less than 20MB.")
      }

      if (fileErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          attachments: fileErrors.join(" "),
        }))

        return
      }

      setFormData((prev) => ({
        ...prev,
        attachments: selectedFiles,
      }))

      setErrors((prev) => ({
        ...prev,
        attachments: "",
      }))

      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitMessage("")
    setSubmitError("")

    if (!validateForm()) return

    const submitData = new FormData()

    Object.keys(formData).forEach((key) => {
      if (key !== "attachments") {
        submitData.append(key, formData[key])
      }
    })

    formData.attachments.forEach((file) => {
      submitData.append("attachments[]", file)
    })

    try {
      setSubmitting(true)

      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        body: submitData,
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          result?.message || "Could not send your message. Please try again."
        )
      }

      setFormData({ ...INITIAL_FORM_DATA, attachments: [] })
      e.currentTarget.reset()
      setSubmitMessage("Thank you. Your message has been sent successfully.")
    } catch (error) {
      setSubmitError(error.message || "Could not send your message. Please try again.")
    } finally {
      setSubmitting(false)
    }

  }

  const mainRef = useRef(null)
  const [showLoader, setShowLoader] = useState(true)

  const {
    data: contactData,
    loading,
    error,
  } = useFetch(getContactPageData);

  useEffect(() => {
    if (loading || error || !contactData || !mainRef.current) return

    const ctx = gsap.context(() => {

      gsap.to(".loader", {
        opacity: 0,
        duration: 0.6,
        onComplete: () => setShowLoader(false)
      })

      /* ─────────────────────────────────────────
         PAGE ENTRANCE
      ───────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl
        .from(".contactFull", {
          scale: 1.08,
          opacity: 0,
          duration: 1.6,
        })
        .from(".contactFull .heading h1", {
          y: 70,
          opacity: 0,
          duration: 1.1,
        }, "-=1.0")
        .from(".contactFull .heading p", {
          y: 40,
          opacity: 0,
          duration: 0.9,
        }, "-=0.75")

      /* ─────────────────────────────────────────
         FORM FIELDS — staggered rise
      ───────────────────────────────────────── */
      gsap.from(".contactForm .row, .contactForm .inputGroup", {
        y: 40,
        opacity: 0,
        stagger: {
          each: 0.1,
          from: "start",
        },
        scrollTrigger: {
          trigger: ".contactForm",
          start: "top 88%",
          end: "top 30%",
          scrub: 1.5,
        },
      })


    }, mainRef)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [loading, error, contactData])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        setShowLoader(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [loading])

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
        <title>{contactData?.seo?.meta_title}</title>
        <meta name="description" content={contactData?.seo?.meta_description}></meta>
      </Helmet>
      {showLoader && <Loader />}
      <main ref={mainRef}>
        <section className="contactFull">
          <div
            className="content"
            style={{
              backgroundImage: contactData?.hero_section?.background?.url
                ? `url(${contactData.hero_section.background.url})`
                : {},
            }}
          >
            <div className="heading">
              <h1>{contactData?.title}</h1>
              <p>{contactData?.description}</p>
              <img src={CH}/>
            </div>
            <form className="contactForm" onSubmit={handleSubmit}>

              <div className="row">

                <div className="inputGroup">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && (
                    <span className="errorText">{errors.firstName}</span>
                  )}
                </div>

                <div className="inputGroup">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && (
                    <span className="errorText">{errors.lastName}</span>
                  )}
                </div>

              </div>

              <div className="inputGroup">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="errorText">{errors.email}</span>
                )}
              </div>

              <div className="inputGroup">
                <label>Phone Number</label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && (
                  <span className="errorText">{errors.phone}</span>
                )}
              </div>

              <div className="inputGroup">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="inputGroup">
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="inputGroup">
                <label>Attachment</label>
                <input
                  type="file"
                  name="attachments"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png,.zip"
                  onChange={handleChange}
                />

                <small>
                  Max 5 files. Total upload size must be under 20MB.
                </small>

                {errors.attachments && (
                  <span className="errorText">{errors.attachments}</span>
                )}
              </div>

              <div className="inputGroup">
                <label>Your Message</label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your idea"
                  className={errors.message ? "error" : ""}
                ></textarea>

                {errors.message && (
                  <span className="errorText">{errors.message}</span>
                )}
              </div>
              {submitMessage && (
                <p className="formStatus success">{submitMessage}</p>
              )}

              {submitError && (
                <p className="formStatus error">{submitError}</p>
              )}

              <button className="submitBtn btn btn2" type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Submit"}

                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z"
                    fill="#fff"
                  />
                </svg>
              </button>

            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Contact
