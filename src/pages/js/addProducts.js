import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/addProducts.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock_quantity: '',
    image: null,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get(`${BASE_URL}/api/products/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setError('Unable to fetch categories');
      });
  }, [BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    const data = new FormData();

    data.append('product_name', formData.name);
    data.append('price', formData.price);
    data.append('product_category', formData.category);
    data.append('description', formData.description);
    data.append('stock_quantity', formData.stock_quantity);
    if (formData.image) data.append('image', formData.image);

    try {
      await axios.post(`${BASE_URL}/api/products/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/AdminOverview', { state: { tab: 'Products' } });
    } catch (err) {
      console.error('Product creation failed:', err);
      setError('Product creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-wrapper">
      <div className="add-product-card">

        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/AdminOverview', { state: { tab: 'Products' } })}>←</button>
          <h2 className="heading-title">Products</h2>
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => navigate('/AdminOverview', { state: { tab: 'Products' } })}>Cancel</button>
            <button className="save-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="add-product-content">
          {/* Left Panel: Image */}
          <div className="left-panel">
            <h2>Add new product</h2>
            <div className="image-upload">
              {formData.image ? (
                <img src={URL.createObjectURL(formData.image)} alt="Preview" />
              ) : (
                <div className="image-placeholder">
                  <p>No image added yet</p>
                </div>
              )}
            </div>
            <label className="upload-btn">
              + Add Image
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </div>

          {/* Right Panel: Form */}
          <div className="right-panel">
            <form onSubmit={handleSubmit}>
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />

              <label>Product Category</label>
              <input
                list="category-options"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                placeholder="Type or select a category"
              />
              <datalist id="category-options">
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name} />
                ))}
              </datalist>

              <label>Product Description</label>
              <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} />

              <label>Stock Quantity</label>
              <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} required />
            </form>

            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
