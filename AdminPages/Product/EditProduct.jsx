import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const EditProduct = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productid');

  const [product, setProduct] = useState({
    productname: '',
    category: '',
    price: '',
    imageUrl: '',
    imageFile: null,
    currentImage: ''
  });

  useEffect(() => {
    if (!productId) {
      alert('Product ID is missing!');
      return;
    }

    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        setProduct(prev => ({
          ...prev,
          productname: data.productname,
          category: data.category,
          price: data.price,
          currentImage: `http://localhost:5000/uploads/${data.image}`
        }));
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        alert('Error fetching product.');
      });
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProduct(prev => ({
      ...prev,
      imageFile: e.target.files[0],
      imageUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', product.productname);
    formData.append('category', product.category);
    formData.append('price', product.price);

    if (product.imageUrl) {
      formData.append('imageUrl', product.imageUrl);
    } else if (product.imageFile) {
      formData.append('productImage', product.imageFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else {
        alert('Failed to update product.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating product.');
    }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="hidden" name="id" value={productId} />

        <label>Product Name:</label>
        <input
          type="text"
          name="productname"
          value={product.productname}
          onChange={handleInputChange}
          required
        />

        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={product.price}
          onChange={handleInputChange}
          required
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleInputChange}
        />

        <label>OR Upload Image File:</label>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
        />
        <p className="note">Only one option will be used: image URL or uploaded file.</p>

        {product.currentImage && (
          <>
            <label>Current Image:</label>
            <img className="preview" src={product.currentImage} alt="Current" />
          </>
        )}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
