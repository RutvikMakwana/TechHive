import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap'; // Import Col, Row from react-bootstrap
import Product from '../components/Product'; // Import Product component from HomePage

const CatagoryWiseProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const selectedCategory = location.state?.category;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/products?category=${selectedCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="mt-4 mb-3">Category: {selectedCategory}</h1>
      <Row>
        {products.map(product => (
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} /> {/* Use the Product component from HomePage */}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CatagoryWiseProduct;
