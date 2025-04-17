import React, { useEffect, useState } from "react";
import "./Navebar.css";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navebar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleCategoryClick = (category) => {
    navigate("/products", { state: { category } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="navbar">
      <h1 className="site-title" onClick={() => navigate("/")}>
        Metal Furniture Shop
      </h1>

      <nav className="nav-links">
        <div className="main-links">
          <a href="/">Home</a>
          <a href="#" onClick={() => handleCategoryClick("metal")}>
            Metal/Iron
          </a>
          <a href="#" onClick={() => handleCategoryClick("shutter")}>
            Shutter
          </a>
          <a href="#" onClick={() => handleCategoryClick("sheds")}>
            Sheds
          </a>
          <a href="#" onClick={() => handleCategoryClick("steels")}>
            Steels
          </a>
          <a href="/userCart" className="cart-link">
            <FaShoppingCart /> Cart
          </a>
        </div>

        <div className="auth-links">
          {!isLoggedIn ? (
            <a href="/login" className="login-btn">
              <FaUser /> Login
            </a>
          ) : (
            <div className="profile-dropdown">
              <button className="profile-btn" onClick={toggleDropdown}>
                <FaUser />
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <a href="/userProfile">My Profile</a>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navebar;
