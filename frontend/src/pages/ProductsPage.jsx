import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

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

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
