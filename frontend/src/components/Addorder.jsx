import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddOrder = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [quantity, setQuantity] = useState(1);
  console.log("User in AddOrder:", user); 
  console.log("Item in AddOrder:", item.productId);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!item || !user) {
      toast.error("❌ Missing product or user data");
      return;
    }

    const orderData = {
      productId: item.productId._id,
      name: item.productId.name,
      imgUrl: item.productId.imgUrl,
      quantity: parseInt(quantity, 10),
    };

    dispatch(addToCart({ userId: user._id, item: orderData }));
    toast.success("✅ Order added to cart!");
    onClose();
  };

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setQuantity(
      isNaN(newValue)
        ? 1
        : Math.max(1, Math.min(item.productId.quantity || 1, newValue))
    );
  };

  if (!item || !item.productId) {
    return <p className="text-gray-500 text-center">No product data available.</p>;
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={item.productId.imgUrl || "https://via.placeholder.com/150"}
            alt={item.productId.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <p className="text-gray-800 text-xl font-semibold">{item.productId.name}</p>
            <p className="text-gray-500 text-sm">
              Available: {item.productId.quantity || 0} units
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
            Enter Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            required
            max={item.productId.quantity || 1}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            >
              Add Order
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddOrder;
