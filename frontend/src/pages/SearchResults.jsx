import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import Navbar from './emplyee/Navbar';
const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('name');

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/search?name=${query}`);
        setResults(res.data.products);
      } catch (err) {
        console.error('Search error:', err);
      }
    };
    fetchData();
  }, [query]);

  return (
  <div>
     <Navbar />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Results for: {query}</h2>
      {results.length > 0 ? (
        <ProductsPage products={results} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  </div>
   
  );
};

export default SearchResults;
