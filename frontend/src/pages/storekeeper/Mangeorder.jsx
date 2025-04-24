import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard.jsx";

const Mangeorder = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders/status/Approved");
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn("Expected array but got:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Storekeeper</h2>
      {orders.length === 0 ? (
        <p>No approved orders.</p>
      ) : (
        orders.map((order) => (
          <OrderCard key={order._id} order={order} onOrderAction={fetchOrders} />
        ))
      )}
    </div>
  );
};

export default Mangeorder;
