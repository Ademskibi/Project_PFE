import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../pages/emplyee/Navbar";

const Orderlist = () => {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/employee/${user._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("🚫 Order fetch failed:", data.message);
          alert(`Order fetch failed: ${data.message || "Unknown error"}`);
          return;
        }

        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(sortedOrders);
        console.log("🚀 Order data:", sortedOrders);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready to pick up":
        return "text-blue-600 font-semibold";
      case "Not approved yet":
        return "text-gray-500 font-semibold";
      case "Declined":
        return "text-red-600 font-semibold";
      case "Approved":
        return "text-green-600 font-semibold";
      case "Waiting list":
        return "text-yellow-600 font-semibold";
      default:
        return "";
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">📦 Your Orders History</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-400">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2 text-center">Product Name</th>
                  <th className="border border-gray-400 px-4 py-2 text-center">Quantity</th>
                  <th className="border border-gray-400 px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-400 px-4 py-2 text-center">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items.map((item, idx) => (
                    <tr
                      key={`${order._id}-${idx}`}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {item.productId?.name || "N/A"}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {item.quantity}
                      </td>
                      {idx === 0 && (
                        <>
                          <td
                            rowSpan={order.items.length}
                            className={`border border-gray-400 px-4 py-2 text-center align-middle ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </td>
                          <td
                            rowSpan={order.items.length}
                            className="border border-gray-400 px-4 py-2 text-center align-middle text-sm text-gray-600"
                          >
                            {formatDate(order.createdAt)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderlist;
