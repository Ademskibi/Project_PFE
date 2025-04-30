import React, { useState, useEffect } from "react";

// Reusable Input Component
const Input = ({ label, name, value, onChange, type = "text", disabled = false, min }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-medium">{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={!disabled ? onChange : undefined}
      disabled={disabled}
      min={min}
      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none"
    />
  </div>
);

const ProductDetails = ({ productId, onProductUpdated }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    itemId: "",
    name: "",
    categoryId: "",
    stock: 0,
    addStock: 0,
  });

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/product/${productId}`);
      const data = await res.json();
      if (data) {
        setProductDetails(data);
        setFormData({
          itemId: data._id,
          name: data.name,
          categoryId: data.categoryId,
          stock: data.stock,
          addStock: 0,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching product details:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      const categoriesArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesArray);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchCategories();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "addStock" ? parseInt(value) || 0 : value;
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const updateProduct = async () => {
    if (formData.addStock < 0) {
      alert("🚫 Cannot add negative stock.");
      return;
    }

    try {
      console.log("🔄 Starting product update...");

      const res = await fetch("http://localhost:5000/api/product/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { _id: productId, operator: "increase", stock: formData.addStock },
          ],
        }),
      });

      const data = await res.json();
      console.log("✅ Product update response:", data);

      if (res.ok) {
        fetchProductDetails(); // Refresh stock
        if (onProductUpdated) onProductUpdated(); // Notify parent component
      } else {
        console.warn("⚠️ Product update incomplete:", data);
        alert("⚠️ Failed to update product stock.");
      }
    } catch (err) {
      console.error("❌ Error updating product:", err);
      alert("❌ Error updating product.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 mt-10 bg-white rounded-3xl shadow-2xl">
      {productDetails ? (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
            Edit Product
          </h2>

          <div className="space-y-6">
            <Input label="Item ID" name="itemId" value={formData.itemId} disabled />
            <Input label="Name" name="name" value={formData.name} disabled />

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Category:</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none bg-white"
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <Input label="Current Stock" name="stock" value={productDetails.stock} disabled />
            <Input
              label="Add to Stock"
              name="addStock"
              type="number"
              value={formData.addStock}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={updateProduct}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-full transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetails;
