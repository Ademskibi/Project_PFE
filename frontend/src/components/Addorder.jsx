import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Correct import

const AddOrder = ({ item, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSubmit = () => {
    if (!item || !item.productId) return;
  
    const newOrder = {
      productId: item.productId._id,
      name: item.productId.name,
      imgUrl: item.productId.imgUrl,
      quantity,
    };
  
    // Retrieve existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cartOrders")) || [];
  
    // Add the new order
    const updatedCart = [...existingCart, newOrder];
  
    // Save back to localStorage
    localStorage.setItem("cartOrders", JSON.stringify(updatedCart));
  
    console.log("Updated Cart Orders:", updatedCart);
   // navigate("/cart"); // Navigate to cart without overwriting
   onClose(); 
  };
  

  if (!item || !item.productId) {
    return <p className="text-gray-500 text-center">No product data available.</p>;
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto">
      {/* Product Image and Details */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={item.productId.imgUrl || "https://via.placeholder.com/150"}
          alt={item.productId.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <p className="text-gray-800 text-xl font-semibold">{item.productId.name}</p>
          <p className="text-gray-500 text-sm">Available: {item.productId.quantity || 0} units</p>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
          Enter Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10);
            setQuantity(isNaN(newValue) ? 1 : Math.max(1, Math.min(item.productId.quantity || 1, newValue)));
          }}
          required
          max={item.productId.quantity || 1}
          min="1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cancel
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Add Order
        </button>
      </div>
    </div>
  );
};

export default AddOrder;
