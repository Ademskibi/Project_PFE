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
        const updateResponse = await fetch("http://localhost:5000/api/products/update", {
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
      {/* Table for Order Summary */}
      <table className="w-full text-sm text-left text-gray-700 mb-4">
        <thead className="hidden">
          <tr>
            <th>Employee</th>
            <th>Stats</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">
              📛 <span className="font-semibold">{order.employeeId?.name || "Unknown"}</span>
            </td>
            <td className="py-2">
              <button
                onClick={() => navigate(`/user_stats/${order.employeeId?._id}`)}
                className="text-blue-600 text-sm hover:underline"
              >
                📈 View Stats
              </button>
            </td>
            <td className="py-2 text-gray-500">
              📅 {new Date(order.date || order.createdAt).toLocaleString()}
            </td>
            <td className="py-2">
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(order._id, "Approved")}
                  className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow text-sm"
                >
                  ✅ Approve
                </button>
                {!isDeclining ? (
                  <button
                    type="button"
                    onClick={() => setIsDeclining(true)}
                    className="px-4 py-1 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow text-sm"
                  >
                    ❌ Decline
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(order._id, "Declined", declineMessage)}
                    className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white rounded-xl shadow text-sm"
                  >
                    🚫 Confirm Decline
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Decline message input */}
      {isDeclining && (
        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-1 font-medium">
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

      {/* List for dropdown toggle */}
      <ul className="list-disc list-inside mt-4 text-sm text-gray-600">
        <li>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-700 hover:text-black underline"
          >
            {showDetails ? "🔼 Hide Product Details" : "🔽 Show Product Details"}
          </button>
        </li>
      </ul>

      {/* Product details table */}
      {showDetails && (
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-sm text-left text-gray-700 border rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const id = item.productId?._id || item.productId;
                const product = productDetailsMap[id];

                return (
                  <tr key={id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">
                      <img
                        src={product?.imgUrl || "https://via.placeholder.com/60"}
                        alt={product?.name || "Product"}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="px-4 py-2">{product?.name || "Loading..."}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">{product?.stock ?? "..."}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
