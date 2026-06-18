import { Link } from "react-router-dom"
import RP from "../assets/rightp.svg"
import Logo from "../assets/logo.svg"

function Footer() {
  return (
    <footer>
      <div className="footerCTA">
        <h2>Let’s shape the future of
          entrepreneurship together</h2>
        <p>You've got the vision. We've got the expertise and capital to help you bring it to life.</p>
        <a className="btn btn1" href="/contact">Contact us
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#142035" />
          </svg>
        </a>
      </div>
      <div className="footerTwo">
        <div className="content">
          <img className="footerLogo" src={Logo} alt="Navyug Logo"/>
          <h3>We are committed to building
            people-centric businesses that combine innovation, execution, and lasting impact.</h3>
          <a className="btn btn2" href="/contact">Pitch to Us
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z" fill="#fff" />
            </svg>
          </a>
        </div>
        <div className="footerLinks">
          <h6>NAVIGATE</h6>
          <div className="links">
            <a href="/">Home</a>
            <a href="/about-us">About us</a>
            <a href="/companies">Companies</a>
            <a href="/verticals">Verticals</a>
            <a href="/blogs">Blogs</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
        <div className="footerLinks">
          <h6>CONNECT</h6>
          <div className="links">
            <a href="https://www.linkedin.com/company/navyug-global-ventures-pvt-ltd/" target="_blank">LinkedIn</a>
            {/* <a href="/" target="_blank">X (Twitter)</a> */}
          </div>
        </div>
        <img src={RP} className="fbottom"/>
      </div>
    </footer>
  )
}

export default Footer
