import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList"; // ✅ Use ProductList instead of ProductCard

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/available");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProductCategory = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId === "") {
      setFilteredProducts(products);
    } else {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}`);
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Category Filter */}
      <div className="flex justify-end mb-4">
        <select
          className="p-2 border rounded-md shadow-sm"
          value={selectedCategory}
          onChange={fetchProductCategory}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ProductsPage;
