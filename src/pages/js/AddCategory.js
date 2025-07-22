import React, { useState } from 'react';
import axios from 'axios';
import '../css/add-category.css';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleAddCategory = async (e) => {
    e.preventDefault(); // prevent form reload

    if (!categoryName.trim()) {
      setError('Please enter a category name.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/categories`, {
        category_name: categoryName,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccessMsg('Category added successfully!');
        setCategoryName('');
        setError('');
      } else {
        setError('Failed to add category. Try again.');
        setSuccessMsg('');
      }
    } catch (err) {
      setError('An error occurred while adding the category.');
      setSuccessMsg('');
      console.error(err);
    }
  };

  return (
    <div className="add-category-container">
      <h2>Add New Category</h2>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}

      <button className="back-btn" onClick={() => navigate('/AdminOverview#')}>
        ← Back to Products
      </button>
    </div>
  );
};

export default AddCategory;
