import React from 'react';
import './user_cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome for icons

const UserCart = ({ cartItems = [] }) => {
  return (
    <div className="cart-container">
      <div className="cart-header">
        <i className="fas fa-shopping-cart"></i> Items in Cart ({cartItems.length})
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item-card">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserCart;
