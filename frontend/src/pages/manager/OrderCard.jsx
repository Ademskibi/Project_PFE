import React, { useState, useEffect } from "react";

const OrderCard = ({ order, onOrderAction }) => {
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");
  const [productDetailsMap, setProductDetailsMap] = useState({});

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
      // 1. Update order status
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      // 2. If Declined, restore product stock
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

      // 3. Send notification
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform hover:scale-[1.01]">
      <h3 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-3">
        👤 Employee:{" "}
        <span className="font-normal text-gray-600">
          {order.employeeId?.name || "Unknown"}
        </span>
      </h3>

      <div className="space-y-3">
        {order.items.map((item) => {
          const id = item.productId?._id || item.productId;
          const product = productDetailsMap[id];

          return (
            <div
              key={id}
              className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-100"
            >
              <img
                src={product?.imgUrl || "https://via.placeholder.com/100"}
                alt={product?.name || "Product"}
                className="w-20 h-20 object-cover rounded-xl border border-gray-300"
              />
              <div>
                <p className="text-base font-medium text-gray-900">
                  {product?.name || "Loading..."}
                </p>
                <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                {product && (
                  <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isDeclining && (
        <div className="mt-5">
          <label className="block text-sm text-gray-700 mb-2 font-medium">
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
            onClick={() =>
              handleUpdateStatus(order._id, "Declined", declineMessage)
            }
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
