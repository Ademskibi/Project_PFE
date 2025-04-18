import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
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

        setOrders(data);
        console.log("🚀 Order data:", data);
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    console.log(`🔧 Update status ${orderId} => ${newStatus}`);
  };

  return (

    <div>
        <Navbar />
<div className="p-4">
      <h1 className="text-xl font-bold mb-4">📦 Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 shadow hover:shadow-md transition">
              <p>Status: <span className="font-medium">{order.status}</span></p>
              <p>Total Amount: ${order.totalAmount}</p>
              <div className="mt-2">
                <h4 className="font-semibold">Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="ml-4 text-sm">
                    {item.productId?.name} x {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Orderlist;
