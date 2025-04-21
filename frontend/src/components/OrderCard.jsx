import React from "react";

const OrderCard = ({ order, onOrderAction }) => {
  const handleUpdateStatus = async (orderId, newStatus) => {
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
          headers: {
            "Content-Type": "application/json",
          },
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
          : "Your order was declined ❌";

      await fetch("http://localhost:5000/api/create_notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: order.employeeId?._id,
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
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        👤 Employee: {order.employeeId?.name || "Unknown"}
      </h3>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.productId?._id}
            className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl shadow-sm"
          >
            <img
              src={item.productId?.imgUrl || "https://via.placeholder.com/100"}
              alt={item.productId?.name}
              className="w-20 h-20 object-cover rounded-xl border border-gray-200"
            />
            <div>
              <p className="text-lg font-medium text-gray-900">{item.productId?.name}</p>
              <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => handleUpdateStatus(order._id, "Approved")}
          className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-2xl transition duration-200 shadow-md"
        >
          ✔ Approve
        </button>
        <button
          onClick={() => handleUpdateStatus(order._id, "Declined")}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition duration-200 shadow-md"
        >
          ✖ Decline
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
