import React, { useEffect, useState } from "react";
import OrderCard from "../../components/OrderCard";
import NavbarManger from "../../components/NavbarManger";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders/status/Not approved yet");
      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn("Expected array but got:", data);
        setOrders([]); // Set to empty array to avoid map error
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Ensure fallback on error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
