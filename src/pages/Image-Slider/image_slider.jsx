import React from "react";
import { Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./image_slider.css";

const ImageSlider = () => {
  return (
    <>
      <div className="bootstrap-slider">
        <Carousel
          fade
          controls={true}
          indicators={true}
          interval={3000} // 3 seconds per slide
          pause={false} // keeps sliding even if user hovers
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://blog.morganitech.com/hubfs/Imported_Blog_Media/Orbital%20Welding%20Equipment%20Repair%20Center.jpg"
              alt="Iron Shop"
            />
            <Carousel.Caption className="text-start">
              <h2>Iron Shop</h2>
              <p>Metal & Stainless Steel Work</p>
              <Link to="/help">
                <Button variant="success">Call Now</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://site-862061.mozfiles.com/files/862061/medium/1eng.jpg"
              alt="Custom Gates"
            />
            <Carousel.Caption className="text-start">
              <h2>Custom Gates</h2>
              <p>Welding, Shutters, and Fabrication</p>
              <Link to="/help">
                <Button variant="success">Call Now</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://media.istockphoto.com/id/927411772/photo/steel-processing-plant.jpg?s=612x612&w=0&k=20&c=zx7YLdAMLmMJxVx6rGoyD1bubcWJwH8qXDRoOiJPKAY="
              alt="Shed Design"
            />
            <Carousel.Caption className="text-start">
              <h2>Modern Sheds</h2>
              <p>Stylish & Durable Metal Sheds</p>
              <Link to="/help">
                <Button variant="success">Call Now</Button>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Service Highlights */}
      <div className="service-highlights">
        <div className="service-box">
          <h4>NO VISITING CHARGE</h4>
          <p>Free visit for inspection and measurement</p>
        </div>
        <div className="service-box">
          <h4 className="highlight">24/7 SERVICES</h4>
          <p className="highlight">We are 24/7 available to serve you</p>
        </div>
        <div className="service-box">
          <h4>HIGH QUALITY WORK</h4>
          <p>High-quality services and products.</p>
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
