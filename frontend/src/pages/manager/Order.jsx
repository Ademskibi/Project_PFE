import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import NavbarManger from "../../components/NavbarManger";
import { useSelector } from "react-redux";

const Order = () => {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!user?.departmentId) {
      console.warn("User department not loaded yet.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders/status/Not approved yet");
      const data = await response.json();

      if (Array.isArray(data)) {
        const departmentId = user.departmentId._id || user.departmentId;
        const filtered = data.filter(
          (order) =>
            order.departmentId === departmentId ||
            order.departmentId?._id === departmentId
        );
        console.log("Filtered orders:", filtered);
        setOrders(filtered);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    // Fetch only when user and departmentId are available
    if (user && user.departmentId) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div>
      <NavbarManger />
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>

      {orders.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} onOrderAction={fetchOrders} />
        ))
      )}
    </div>
  );
};

export default Order;
