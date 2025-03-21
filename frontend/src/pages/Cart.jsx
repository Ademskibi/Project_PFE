import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("cartOrders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleCheckout = () => {
    console.log("Proceeding to checkout with orders:", orders);
    localStorage.removeItem("cartOrders"); // Clear cart after checkout
    setOrders([]); // Clear UI
    navigate("/checkout");
  };

  const handleClearCart = () => {
    localStorage.removeItem("cartOrders");
    setOrders([]);
  };

  if (orders.length === 0) {
    return <p className="text-gray-500 text-center">Cart is empty.</p>;
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Cart</h2>

      {orders.map((order, index) => (
        <div key={index} className="mb-4 border p-4 rounded shadow">
          <img src={order.imgUrl || "https://via.placeholder.com/150"} className="w-24 h-24 object-cover rounded-lg" />
          <p className="text-gray-800 text-xl font-semibold">{order.name}</p>
          <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <button
          onClick={handleClearCart}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Clear Cart
        </button>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Confirm All Orders
        </button>
      </div>
    </div>
  );
};

export default Cart;
