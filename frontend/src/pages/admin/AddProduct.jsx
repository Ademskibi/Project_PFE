import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

// Upload image to backend or cloud storage
const imageUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post("http://localhost:5000/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.secure_url;
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        return null;
    }
};

const AddProduct = () => {
    const [itemId, setItemId] = useState("");
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/categories");
                const data = await response.json();
                if (data.success && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("❌ Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!categoryId) return alert("❌ Please select a category.");

        setIsSubmitting(true);
        let uploadedImageUrl = imgUrl;

        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                alert("❌ Please select a valid image file.");
                setIsSubmitting(false);
                return;
            }

            uploadedImageUrl = await imageUpload(imageFile);
            if (!uploadedImageUrl) {
                alert("❌ Failed to upload the image.");
                setIsSubmitting(false);
                return;
            }
        }

        const productData = {
            itemId,
            name,
            categoryId,
            stock,
            imgUrl: uploadedImageUrl,
        };

        try {
            const response = await fetch("http://localhost:5000/api/create_product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (!response.ok) throw new Error("Failed to add product");

            alert("✅ Product added successfully!");
            navigate("/admin/products"); // optional
        } catch (error) {
            console.error(error);
            alert("❌ Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <AdminNavbar />
            <div className="flex justify-center py-10 px-4">
                <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
                        📦 Add New Product
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            placeholder="🆔 Item ID"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                        />
                        <input
                            type="text"
                            placeholder="📦 Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                        />
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                        >
                            <option value="">📁 Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="📦 Stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            min="0"
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="w-full file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {imageFile && (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                className="mt-3 rounded-xl border max-h-48 object-cover mx-auto"
                            />
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-xl text-white font-bold transition shadow-lg ${
                                isSubmitting
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting ? "⏳ Adding Product..." : "✅ Add Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
