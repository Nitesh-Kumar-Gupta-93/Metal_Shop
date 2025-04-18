import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderNowButton.css';

const OrderNowButton = ({ product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrderNow = () => {
    setLoading(true);
    
    // Create a single-item cart for immediate purchase
    const orderItem = {
      productid: product.productid,
      productname: product.productname,
      price: product.price,
      image: product.image,
      quantity: 1
    };

    // Store the single item in localStorage
    localStorage.setItem('cartItems', JSON.stringify([orderItem]));
    
    // Navigate to the order page
    navigate('/order');
  };

  return (
    <button
      className={`order-now-button ${loading ? 'loading' : ''}`}
      onClick={handleOrderNow}
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Order Now'}
    </button>
  );
};

export default OrderNowButton; 