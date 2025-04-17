import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col company-info">
          <h3 className="footer-title">Satyamstudio</h3>
          <p>
            OurStudio is a digital agency specializing<br />
            in UI/UX Design and Website<br />
            Development, located in Ohio, United<br />
            States of America.
          </p>
          <p>Copyright Satyam Studio</p>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Service</h4>
          <ul>
            <li>Illustration</li>
            <li>Mobile Design</li>
            <li>Motion Graphic</li>
            <li>Web Design</li>
            <li>Development</li>
            <li>SEO</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Company</h4>
          <ul>
            <li>Service</li>
            <li>Features</li>
            <li>Our Team</li>
            <li>Portfolio</li>
            <li>Blog</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-col newsletter">
          <h4 className="footer-title">Join a Newsletter</h4>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter Your Email" />
            <button>Subscribe</button>
          </div>
          <div className="socials">
            <div className="social-icon">Mr</div>
            <div className="social-icon">Be</div>
            <div className="social-icon">Ig</div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright Satyam Studio</p>
        <p>8819 Ohio St. South Gate, CA 90280</p>
        <p><a href="mailto:Ourstudio@hello.com">Ourstudio@hello.com</a></p>
        <p>+1 386-688-3295</p>
      </div>
    </footer>
  );
};

export default Footer;
