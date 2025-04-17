import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./product_section.css";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        const updatedData = data.map((product) => ({
          ...product,
          image: product.image.startsWith("http")
            ? product.image
            : `http://localhost:5000/uploads/${product.image.replace(/^\/+/, "")}`,
        }));

        setProducts(updatedData);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleOrderNow = (product) => {
    navigate("/order", { state: { product } });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;

  return (
    <section className="product-section">
      <h2 className="section-title">OUR SERVICES</h2>

      {/* Category Filter Buttons */}
      <div className="category-links">
        {["metal", "shutter", "sheds", "steels"].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={selectedCategory === cat ? "active-category" : ""}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory(null)}
          className={!selectedCategory ? "active-category" : ""}
        >
          All
        </button>
      </div>

      {/* Product Cards */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.productid}>
            <img src={product.image} alt={product.title} className="product-img" />
            <h4 className="product-title">{product.title}</h4>
            <div className="product-buttons">
              <button className="btn green-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
              <button className="btn green-btn" onClick={() => handleOrderNow(product)}>
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <h2 className="section-title" style={{ marginTop: "50px" }}>
        🛒 Your Cart ({cartItems.length})
      </h2>
      <div className="product-grid">
        {cartItems.map((item, index) => (
          <div className="product-card" key={`cart-${index}`}>
            <img src={item.image} alt={item.title} className="product-img" />
            <h4 className="product-title">{item.title}</h4>
            <div className="product-buttons">
              <button className="btn green-btn" onClick={() => handleOrderNow(item)}>
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
