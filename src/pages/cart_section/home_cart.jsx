import React, { useState } from "react";
import ProductSection from "../Product-Section/product_section";

function HomeCart() {
    const [cart, setCart] = useState([]);

    const handleAddToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };
    return (
        <div>
            <ProductSection onAddToCart={handleAddToCart} />
            {/* Cart Section */}
            {cart.length > 0 && (
                <div className="cart-section">
                    <h3>🛒 Items in Cart ({cart.length})</h3>
                    <ul className="cart-list">
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-img" />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
        </div>
        
    );
    
}

export default HomeCart;
