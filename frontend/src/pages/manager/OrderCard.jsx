import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, onOrderAction }) => {
  const navigate = useNavigate();
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productFetches = order.items.map(async (item) => {
          const productId = item.productId?._id || item.productId;
          const res = await fetch(`http://localhost:5000/api/product/${productId}`);
          const data = await res.json();
          return { productId, details: data };
        });

        const results = await Promise.all(productFetches);
        const newMap = {};
        results.forEach(({ productId, details }) => {
          newMap[productId] = details;
        });

        setProductDetailsMap(newMap);
      } catch (error) {
        console.error("🔥 Failed to fetch product details:", error);
      }
    };

    fetchProducts();
  }, [order]);

  const handleUpdateStatus = async (orderId, newStatus, customMessage = "") => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      if (newStatus === "Declined") {
        const updateResponse = await fetch("http://localhost:5000/api/product/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: order.items.map((item) => ({
              _id: item.productId?._id || item.productId,
              operator: "",
              stock: item.quantity,
            })),
          }),
        });

        if (!updateResponse.ok) {
          const result = await updateResponse.json();
          throw new Error(`Product rollback failed: ${result.message}`);
        }
      }

      const notificationMessage =
        newStatus === "Approved"
          ? "Your order has been approved ✅"
          : customMessage || "Your order was declined ❌";

      await fetch("http://localhost:5000/api/create_notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: order.employeeId,
          message: notificationMessage,
          type: newStatus.toLowerCase(),
          order: order._id,
        }),
      });

      if (onOrderAction) onOrderAction();
    } catch (error) {
      console.error("🔥 Error updating order status:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-transform hover:scale-[1.01]">
      {/* Order Summary as Table */}
      <div className="mb-4 text-sm text-gray-700">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              <td className="py-1 font-semibold">📛 Employee:</td>
              <td>{order.employeeId?.name || "Unknown"}</td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">📈 Stats:</td>
              <td>
                <button
                  onClick={() => navigate(`/user_stats/${order.employeeId?._id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View Stats
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-1 font-semibold">📅 Date:</td>
              <td>{new Date(order.date || order.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approve / Decline Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => handleUpdateStatus(order._id, "Approved")}
          className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow text-sm"
        >
          ✅ Approve
        </button>
        {!isDeclining ? (
          <button
            onClick={() => setIsDeclining(true)}
            className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow text-sm"
          >
            ❌ Decline
          </button>
        ) : (
          <button
            onClick={() => handleUpdateStatus(order._id, "Declined", declineMessage)}
            className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white rounded-xl shadow text-sm"
          >
            🚫 Confirm Decline
          </button>
        )}
      </div>

      {isDeclining && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for decline (optional):
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            rows="3"
            value={declineMessage}
            onChange={(e) => setDeclineMessage(e.target.value)}
            placeholder="Explain why this order was declined..."
          />
        </div>
      )}

      {/* Toggle Product Details */}
      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-700 hover:text-black underline text-sm"
        >
          {showDetails ? "❌ Hide Cart" : "🛒 Show Cart"}
        </button>
      </div>

      {/* Cart-style Product Details */}
      {showDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.items.map((item) => {
            const id = item.productId?._id || item.productId;
            const product = productDetailsMap[id];

            return (
              <div
                key={id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product?.imgUrl || "https://via.placeholder.com/60"}
                    alt={product?.name || "Product"}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <div className="font-semibold">{product?.name || "Loading..."}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: <strong>{item.quantity}</strong>
                    </div>
                    <div className="text-sm text-gray-600">
                      Stock: <strong>{product?.stock ?? "..."}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
