import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
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

  // ⏰ Activate timeout for cart expiration
  useCartTimeout(user?._id);

  const handleCheckout = async () => {
    if (userCart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    if (!user?._id) {
      alert("⚠️ You must be logged in to place an order.");
      return;
    }

    if (!window.confirm("Are you sure you want to confirm all orders?")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: userCart,
          employeeId: user._id,
          departmentId: user.departmentId,
          status: "Not approved yet",
        }),

      });
      const response = await fetch("http://localhost:5000/api//products/update", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: userCart,
        
        }),
        
      });

      console.log("🚀 Sending order data:", {
        items: userCart,
        employeeId: user._id,
        departmentId: user.departmentId,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("🚫 Order submission failed:", data.message);
        alert(`Order failed: ${data.message || "Unknown error"}`);
        return;
      }

      console.log("✅ Order confirmed:", data);
      dispatch(clearCart(user._id));
      navigate("/checkout");
    } catch (error) {
      console.error("🔥 Checkout error:", error);
      alert("An unexpected error occurred while placing the order.");
    }
  };

  return (
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
                src={order.imgUrl || "/default-image.jpg"} // Local fallback image
                alt={order.name}
                onError={(e) => {
                  e.target.src = "/default-image.jpg"; // Fallback to a local image
                }}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-gray-800 text-xl font-semibold">
                  {order.name}
                </p>
                <p className="text-gray-500 text-sm">
                  Quantity: {order.quantity}
                </p>
              </div>
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
  );
};

export default Cart;