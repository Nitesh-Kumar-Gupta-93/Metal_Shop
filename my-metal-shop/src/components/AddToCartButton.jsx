import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './AddToCartButton.css';

const AddToCartButton = ({ product }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await addToCart(product.productid, 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-cart-container">
      <button
        className={`add-to-cart-button ${loading ? 'loading' : ''}`}
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <div className="add-to-cart-error">{error}</div>}
    </div>
  );
};

export default AddToCartButton; 