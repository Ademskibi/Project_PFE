import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, onOrderAction }) => {
  const navigate = useNavigate();
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");

  const handleUpdateStatus = async (orderId, newStatus, customMessage = "") => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error("❌ Failed to update order status");
        return;
      }

      if (newStatus === "Declined") {
        const updateResponse = await fetch("http://localhost:5000/api/products/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: order.items.map((item) => ({
              _id: item.productId._id,
              operator: "",
              stock: item.quantity,
            })),
          }),
        });

        const result = await updateResponse.json();
        if (!updateResponse.ok) {
          console.error("❌ Product quantity rollback failed:", result.message);
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
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        👤 Employee:{" "}
        <span className="font-normal">
          {order.employeeId?.name || "Unknown"}
        </span>
      </h3>

      <button
        onClick={() => navigate(`/user_stats/${order.employeeId._id}`)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Show Previous Orders
      </button>

      <div className="space-y-4">
        {order?.items?.map((item) => (
          <div
            key={item.productId?._id}
            className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl shadow-sm"
          >
            <img
              src={item.productId?.imgUrl || "https://via.placeholder.com/100"}
              alt={item.productId?.name}
              className="w-20 h-20 object-cover rounded-xl border border-gray-300"
            />
            <div>
              <p className="text-base font-medium text-gray-900">{item.productId?.name}</p>
              <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {isDeclining && (
        <div className="mt-5">
          <label className="block text-sm text-gray-700 mb-2">
            Reason for decline (optional):
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-300 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            rows="3"
            value={declineMessage}
            onChange={(e) => setDeclineMessage(e.target.value)}
            placeholder="Explain why this order was declined..."
          />
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => handleUpdateStatus(order._id, "Approved")}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow transition duration-200"
        >
          ✔ Approve
        </button>

        {!isDeclining ? (
          <button
            type="button"
            onClick={() => setIsDeclining(true)}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow transition duration-200"
          >
            ✖ Decline
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleUpdateStatus(order._id, "Declined", declineMessage)}
            className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl shadow transition duration-200"
          >
            🚫 Confirm Decline
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
