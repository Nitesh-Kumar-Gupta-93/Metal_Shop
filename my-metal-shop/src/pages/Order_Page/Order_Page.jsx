import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Order_Page.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <-- NEW
  const { product } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  if (!product) {
    return (
      <div className="order-page">
        <h2>No product selected</h2>
        <p>Please go back and choose a product.</p>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    // Instead of alert, navigate to payment page
    navigate("/paymentDetails", {
      state: {
        product,
        quantity,
        totalPrice,
        address
      },
    });
  };

  return (
    <div className="order-page">
      <h2 className="order-title">Place Your Order</h2>
      <div className="order-card">
        <img src={product.image} alt={product.title} className="order-img" />
        <h3 className="order-product-name">{product.title}</h3>
        <p className="order-category">Category: {product.category}</p>
        <p className="order-price">Price: ₹{product.price}</p>

        <form className="order-form" onSubmit={handleOrderSubmit}>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </label>

          <label>
            Address:
            <textarea
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your shipping address"
            />
          </label>

          <p className="order-total">Total: ₹{totalPrice}</p>
          <button type="submit" className="btn green-btn">Confirm Order</button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
