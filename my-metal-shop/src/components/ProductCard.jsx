import React from 'react';
import AddToCartButton from './AddToCartButton';
import OrderNowButton from './OrderNowButton';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img 
        src={`http://localhost:5000/uploads/${product.image}`} 
        alt={product.productname}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.productname}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price}</p>
        
        <div className="product-actions">
          <AddToCartButton product={product} />
          <OrderNowButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 