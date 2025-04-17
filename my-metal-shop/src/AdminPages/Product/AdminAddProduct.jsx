import React, { useState } from "react";
import "./AddProducts.css"; // Create this file for custom styling

const AdminAddProduct = () => {
  const [productData, setProductData] = useState({
    productName: "",
    price: "",
    category: "Metal",
    productImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("productImage", productData.productImage);

    fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        alert("Product added successfully!");
        setProductData({
          productName: "",
          price: "",
          category: "Metal",
          productImage: null,
        });
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Failed to add product.");
      });
  };

  return (
    <div className="admin-container">
      <h1>Admin Page</h1>
      <h2>Add Products</h2>
      {/* Single form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Product Name:</label>
        <input
          type="text"
          name="productName"
          value={productData.productName}
          onChange={handleChange}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={productData.price}
          onChange={handleChange}
          required
        />

        <div className="category-section">
          <label>Category:</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
          >
            <option value="Metal">Metal</option>
            <option value="Shutter">Shutter</option>
            <option value="Steels">Steels</option>
            <option value="Sheds">Sheds</option>
          </select>
        </div>

        <label>Image:</label>
        <input
          type="file"
          name="productImage"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <input type="submit" value="Add Product" />
      </form>
    </div>
  );
};

export default AdminAddProduct;
