import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./product_section.css";

const ProductSection = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching products...");
      
      const res = await fetch("http://localhost:5000/api/products");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`✅ Fetched ${data.length} products`);

      // Ensure image URLs are properly formatted
      const updatedData = data.map((product) => ({
        ...product,
        image: product.image
          ? product.image.startsWith("http")
            ? product.image
            : `http://localhost:5000/uploads/${product.image.replace(/^\/+/, "")}`
          : "https://via.placeholder.com/300?text=No+Image"
      }));

      console.log("📦 Product data:", updatedData);
      setProducts(updatedData);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = (product) => {
    // Navigate to payment details page first
    console.log("🛍️ Order Now clicked for product:", product);
    
    // Set default quantity
    const quantity = 1;
    
    // Calculate total price
    const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);
    
    // Let user enter their own address in payment details page
    const address = '';
    
    // Navigate to payment details with all necessary data
    navigate("/paymentDetails", { 
      state: { 
        product: {
          ...product,
          title: product.productname, // Ensure the property name matches what PaymentDetails expects
          productid: product.productid // Ensure productid is explicitly passed
        },
        quantity,
        totalPrice,
        address
      } 
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log(`🔍 Filtering products by category: ${category}`);
  };

  // Filter products by category (case insensitive)
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : products;
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);
  console.log("🏷️ Available categories:", categories);

  return (
    <section className="product-section">
      <h2 className="section-title">OUR SERVICES</h2>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">
          <p>Error loading products: {error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      ) : (
        <>
          {/* Category Filter Buttons */}
          <div className="category-links">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={selectedCategory === cat ? "active-category" : ""}
              >
                {cat}
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
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div className="product-card" key={product.productid}>
                  <img 
                    src={product.image} 
                    alt={product.productname} 
                    className="product-img"
                    onError={(e) => {
                      console.log(`❌ Failed to load image for ${product.productname}`);
                      e.target.src = "https://via.placeholder.com/300?text=No+Image";
                    }}
                  />
                  <h4 className="product-title">{product.productname}</h4>
                  <p className="product-price">${product.price}</p>
                  <p className="product-category">{product.category}</p>
                  <div className="product-buttons">
                    <button 
                      className="btn green-btn" 
                      onClick={() => {
                        console.log(`🛒 Adding to cart: ${product.productname}`);
                        onAddToCart(product);
                      }}>
                      Add to Cart
                    </button>
                    <button className="btn green-btn" onClick={() => handleOrderNow(product)}>
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products found{selectedCategory ? ` in category: ${selectedCategory}` : ''}</p>
          )}
        </>
      )}
    </section>
  );
};

export default ProductSection;
