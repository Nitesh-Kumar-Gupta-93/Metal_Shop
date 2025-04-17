import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, quantity, totalPrice, address } = location.state || {};

  if (!product) {
    return <div className="payment-container">No order found.</div>;
  }

  const handlePayNow = () => {
    alert(`🧾 Paid ₹${totalPrice} via UPI`);
  };

  const handleCashOnDelivery = () => {
    alert(`📦 Order placed as COD for ₹${totalPrice}`);
    navigate('/placed-order', {
      state: { product, quantity, totalPrice, address }
    });
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <p><strong>Product:</strong> {product.title}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Address:</strong> {address}</p>

      <div className="payment-section">
        <h3>Scan & Pay</h3>
        <img
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*A9YcoX1YxBUsTg7p-P6GBQ.png"
          alt="QR Code"
          className="qr-code"
        />
        <p><strong>UPI ID:</strong> user@upi</p>
        <button className="pay-now-btn" onClick={handlePayNow}>Pay Now</button>
      </div>

      <div className="or-divider">OR</div>

      <button className="cod-btn" onClick={handleCashOnDelivery}>
        Cash on Delivery
      </button>

      <div className="total-amount">
        <h3>Total Amount: ₹{totalPrice}</h3>
      </div>
    </div>
  );
};

export default PaymentDetails;
