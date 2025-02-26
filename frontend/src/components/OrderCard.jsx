import React from "react";

const OrderCard = ({ order }) => {
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                console.log(`Order ${orderId} updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div className="border p-4 rounded shadow-md mb-4">
            <h3 className="text-lg font-semibold">Employee: {order.employeeId?.name || "Unknown"}</h3>

            {order.items.map(item => (
                <div key={item.productId?._id} className="flex items-center gap-4 mt-2">
                    <img
                        src={item.productId?.image || "https://via.placeholder.com/100"}
                        alt={item.productId?.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                        <p className="text-gray-700">{item.productId?.name}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                </div>
            ))}

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => handleUpdateStatus(order._id, "Approved")}
                    className="p-2 bg-green-500 text-white rounded flex items-center"
                >
                    ✔ Approve
                </button>

                <button
                    onClick={() => handleUpdateStatus(order._id, "Declined")}
                    className="p-2 bg-red-500 text-white rounded flex items-center"
                >
                    ✖ Decline
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
