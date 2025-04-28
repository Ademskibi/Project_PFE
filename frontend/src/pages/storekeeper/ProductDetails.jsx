import React, { useState, useEffect } from "react";

const ProductDetails = ({ productId, onProductUpdated }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    itemId: "",
    name: "",
    categoryId: "",
    stock: 0, // Default stock to 0
  });

  // Fetch product details
  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/product/${productId}`);
      const data = await response.json();
      if (data) {
        setProductDetails(data);
        setFormData({
          itemId: data._id,
          name: data.name,
          categoryId: data.categoryId,
          stock: data.stock,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching product details:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      const categoriesArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? (value === "" ? 0 : Number(value)) : value, // Ensure stock is treated as a number
    }));
  };

  const updateProduct = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: [
            { _id: productId, operator: "add", stock: formData.stock },
          ],
        }),
      });
      const data = await response.json();
      if (data.message) {
        alert("✅ Product updated successfully!");
        onProductUpdated();
      } else {
        alert("❌ Failed to update product.");
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
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
            {/* Item ID */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Item ID:</label>
              <input
                type="text"
                name="itemId"
                value={formData.itemId}
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Category:</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none bg-white"
              >
                <option value="" disabled>Select a Category</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}  // Controlled value, now editable
                onChange={handleChange}
                min="0"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
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
