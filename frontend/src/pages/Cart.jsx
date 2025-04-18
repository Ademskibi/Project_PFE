import React from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import useCartTimeout from "../hooks/useCartTimeout";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const userCart = useSelector(
    (state) => state.cart.itemsByUserId[user?._id] || []
  );

  console.log("🧑 Logged in user:", user);

  // ⏰ Cart auto-expiration
  useCartTimeout(user?._id);

  const handleCheckout = async () => {
    if (!user?._id) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    if (userCart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    if (!window.confirm("Are you sure you want to confirm all orders?")) {
      return;
    }

    try {
      const orderPayload = {
        items: userCart,
        employeeId: user._id,
        departmentId: user.departmentId,
        status: "Not approved yet",
      };

      console.log("🚀 Sending order data:", orderPayload);

      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error("🚫 Order submission failed:", orderData.message);
        alert(`Order failed: ${orderData.message || "Unknown error"}`);
        return;
      }

      const updateResponse = await fetch("http://localhost:5000/api/products/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: userCart.map((item) => ({
            _id: item.productId,
            operator: "decrease",
            stock: item.quantity,
          })),
        }),
      });

      if (!updateResponse.ok) {
        const updateError = await updateResponse.json();
        console.error("⚠️ Product update failed:", updateError.message);
        alert(`Product update failed: ${updateError.message || "Unknown error"}`);
        return;
      }

      console.log("✅ Order confirmed:", orderData);
      dispatch(clearCart(user._id));
      navigate("/Main_Page");
    } catch (error) {
      console.error("🔥 Checkout error:", error);
      alert("An unexpected error occurred while placing the order.");
    }
  };

  const handleRemoveItem = (productId) => {
    if (!user?._id) return;
    dispatch(removeFromCart({ userId: user._id, productId }));
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-image.jpg";
  };

  return (
    <div>
      <Navbar />
        <div className="p-6 border rounded-lg bg-white shadow-md max-w-md mx-auto mt-10">
      
      <h2 className="text-2xl font-semibold mb-6 text-center">🛒 Cart</h2>
      
      {userCart.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <>
          {userCart.map((order, index) => (
            <div
              key={index}
              className="mb-4 border p-4 rounded shadow flex items-center space-x-4"
            >
              <img
                src={order.imgUrl || "/default-image.jpg"}
                alt={order.name}
                onError={handleImageError}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-gray-800 text-lg font-semibold">{order.name}</p>
                <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
              </div>
              <button
                onClick={() => handleRemoveItem(order.productId)}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                title="Remove from cart"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => dispatch(clearCart(user._id))}
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
        </>
      )}
    </div>
    </div>
    
  
  );
};

export default Cart;
