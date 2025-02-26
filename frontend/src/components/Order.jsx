import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard"; // Import OrderCard

const Order = () => {
    const [orders, setOrders] = useState([]); // Store orders in state

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/orders/status/Not approved yet");
                const data = await response.json();
                setOrders(data); // Store fetched orders
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
            
            {orders.length === 0 ? (
                <p>No pending orders.</p>
            ) : (
                orders.map(order => <OrderCard key={order._id} order={order} />)
            )}
        </div>
    );
};

export default Order;
