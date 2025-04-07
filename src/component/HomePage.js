import React from 'react';
import './HomePage.css';
import { FaWhatsapp, FaInstagram, FaFacebook, FaUser } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Top Header */}
      <div className="top-header">
        <h2 className="logo">ServeHub</h2>
        <div className="social-icons">
          <FaWhatsapp />
          <FaInstagram />
          <FaFacebook />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="navbar">
        <h3 className="brand">Metal Weld</h3>
        <ul className="nav-links">
          <li>METAL/IRON</li>
          <li>Shutter</li>
          <li>Sheds</li>
          <li>Steels</li>
          <li>AboutUs</li>
          <li>ContactUs</li>
          <li><FaUser /></li>
        </ul>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welding Services</h1>
          <p>Metal & Stainless Steel Work</p>
          <button className="call-button">Call Now</button>
        </div>
        <div className="hero-image"></div>
      </div>

      {/* Service Highlights */}
      <div className="services">
        <div className="service-box">
          <h3>NO VISITING CHARGE</h3>
          <p>Free visit for inspection and measurement</p>
        </div>
        <div className="service-box">
          <h3>24/7 SERVICES</h3>
          <p>We are 24/7 available to serve you</p>
        </div>
        <div className="service-box">
          <h3>HIGH QUALITY WORK</h3>
          <p>High quality services and products</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
