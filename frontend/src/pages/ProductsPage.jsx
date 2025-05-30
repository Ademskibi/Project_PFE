import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";

const ProductsPage = ({ products, selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      {/* Category Filter */}
      <div className="flex justify-end mb-4">
        <select
          className="p-2 border rounded-md shadow-sm"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <ProductList products={products} />
    </div>
  );
};

export default ProductsPage;
