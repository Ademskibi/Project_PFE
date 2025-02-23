import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Function to handle image upload
const imageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post(
            "http://localhost:5000/api/upload", // Updated endpoint to match backend
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.secure_url; // Extract the secure URL from the response
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};

const AddProduct = () => {
    const [itemId, setItemId] = useState("");
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [imgUrl, setImgUrl] = useState(""); // Initial image URL
    const [categories, setCategories] = useState([]); // Categories fetched from the backend
    const [imageFile, setImageFile] = useState(null); // State for selected image file
    const navigate = useNavigate();

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/categories");
                const data = await response.json();
                if (data.success && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                } else {
                    console.error("Fetched data is not in the expected format:", data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("❌ Please select a category.");
            return;
        }

        let uploadedImageUrl = imgUrl;

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                alert("❌ Please select a valid image file.");
                return;
            }

            uploadedImageUrl = await imageUpload(imageFile);
            if (!uploadedImageUrl) {
                alert("❌ Failed to upload the image.");
                return;
            }
        }

        const productData = {
            itemId,
            name,
            categoryId,
            quantity,
            imgUrl: uploadedImageUrl,
        };

        try {
            const response = await fetch("http://localhost:5000/api/create_product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            alert("✅ Product added successfully!");
            navigate("/products");
        } catch (error) {
            console.error("Error:", error);
            alert("❌ Failed to add product");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[url('../public/tiled_background.png')] bg-cover">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Item ID"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">Select Category</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                No categories available
                            </option>
                        )}
                    </select>
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="0"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;