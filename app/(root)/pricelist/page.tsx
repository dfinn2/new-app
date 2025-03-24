'use client'; // If using the App Router

import React, { useState, useEffect } from 'react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch from an API route instead of directly calling Stripe
        const response = await fetch('/api/get-stripe-products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <p>${(product.unit_amount / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;