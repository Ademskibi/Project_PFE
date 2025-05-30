import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import ProductsPage from "../ProductsPage";

const Mainpage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/available");
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch search results or reset filteredProducts if no search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        // No search query, show all or filtered by category
        filterProductsByCategory(allProducts, selectedCategory);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/search?name=${searchQuery}`
        );
        // If category is selected, filter search results by category
        if (selectedCategory) {
          const filteredByCategory = res.data.products.filter(
            (p) => p.categoryId === selectedCategory
          );
          setFilteredProducts(filteredByCategory);
        } else {
          setFilteredProducts(res.data.products);
        }
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProducts([]);
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  // Filter products by category (called on category change or after search)
  const filterProductsByCategory = (products, categoryId) => {
    if (!categoryId) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((p) => p.categoryId === categoryId);
    setFilteredProducts(filtered);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (searchQuery) {
      // If searching, refetch search results and then filter by category
      // To simplify, just filter current filteredProducts by category
      filterProductsByCategory(filteredProducts, categoryId);
    } else {
      filterProductsByCategory(allProducts, categoryId);
    }
  };

  return (
    <div>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ProductsPage
        products={filteredProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};

export default Mainpage;
