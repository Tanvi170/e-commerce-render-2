import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/add-order.css';

const AddOrder = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const storeId = localStorage.getItem("storeId");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const customerRes = await axios.get(`${baseUrl}/api/customers?storeId=${storeId}`);
        const productRes = await axios.get(`${baseUrl}/api/products?storeId=${storeId}`);

        setCustomers(customerRes.data);
        setProducts(productRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load customers or products.");
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    } else {
      setError("Store ID not found.");
      setLoading(false);
    }
  }, [storeId, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedProduct || !quantity) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/orders`, {
        storeId,
        customerId: selectedCustomer,
        productId: selectedProduct,
        quantity: parseInt(quantity)
      });

      alert('Order placed successfully!');
      setSelectedCustomer('');
      setSelectedProduct('');
      setQuantity('');
    } catch (err) {
      console.error("Order creation failed:", err);
      setError('Failed to place the order.');
    }
  };

  return (
    <div className="add-order-container">
      <h2 className="form-title">Add New Order</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <form className="add-order-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer:</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((cust) => (
                <option key={cust.customer_id} value={cust.customer_id}>
                  {cust.customer_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product:</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option key={prod.product_id} value={prod.product_id}>
                  {prod.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Place Order
          </button>
        </form>
      )}
    </div>
  );
};

export default AddOrder;
