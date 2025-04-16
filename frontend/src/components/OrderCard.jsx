import React from "react";

const OrderCard = ({ order }) => {
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            // 1. Update order status
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                console.log(`✅ Order ${orderId} updated to ${newStatus}`);
            } else {
                console.error("❌ Failed to update order status");
            }

            // 2. If declined, return products back to stock
            if (newStatus === "Declined") {
                const updateResponse = await fetch("http://localhost:5000/api/products/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        updates: order.items.map((item) => ({
                            _id: item.productId._id,
                            operator: "", // Optional: set to "increase" if logic expects it
                            quantity: item.quantity,
                        })),
                    }),
                });

                const result = await updateResponse.json();

                if (!updateResponse.ok) {
                    console.error("❌ Product quantity rollback failed:", result.message);
                } else {
                    console.log("🔁 Product quantities restored after decline");
                }
            }
        } catch (error) {
            console.error("🔥 Error updating order status:", error);
        }
    };

    return (
        <div className="border p-4 rounded shadow-md mb-4 bg-white">
            <h3 className="text-lg font-semibold">Employee: {order.employeeId?.name || "Unknown"}</h3>

            {order.items.map((item) => (
                <div key={item.productId?._id} className="flex items-center gap-4 mt-2">
                    <img
                        src={item.productId?.imgUrl || "https://via.placeholder.com/100"}
                        alt={item.productId?.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                        <p className="text-gray-800 font-medium">{item.productId?.name}</p>
                        <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                </div>
            ))}

            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => handleUpdateStatus(order._id, "Approved")}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                    ✔ Approve
                </button>

                <button
                    onClick={() => handleUpdateStatus(order._id, "Declined")}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                    ✖ Decline
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
