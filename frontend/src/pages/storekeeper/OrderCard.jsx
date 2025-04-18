import React, { useEffect, useState } from "react";

const OrderCard = ({ order, onOrderAction }) => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          order.items.map((item) =>
            fetch("http://localhost:5000/api/product", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ _id: item.productId }),
            }).then((res) => res.json())
          )
        );

        const productsMap = {};
        order.items.forEach((item, index) => {
          productsMap[item.productId.toString()] = responses[index];
        });

        setProducts(productsMap);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [order]);

  const handleWaitinglist = async (productId, orderId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/waiting/${orderId}/${productId._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Add to waiting list" }),
        }
      );

      if (!response.ok) throw new Error("❌ Failed to add to waiting list");

      const response2 = await fetch(
        `http://localhost:5000/api/remove-item/${orderId}/${productId._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response2.ok) throw new Error("❌ Failed to remove item from order");

      if (onOrderAction) onOrderAction();
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Ready to pick up" }),
        }
      );

      if (!response.ok) {
        console.error("❌ Failed to update order status");
        return;
      }

      console.log(`✅ Order ${orderId} updated to Ready to pick up`);

      if (onOrderAction) onOrderAction();
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🛒 Order #{order.OrderId}
        </h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => handleUpdateStatus(order._id)}
        >
          Ready to Pick Up
        </button>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Status:</strong> {order.status}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        <strong>Created At:</strong>{" "}
        {new Date(order.createdAt).toLocaleString()}
      </div>

      {order.items.map((item) => {
        const product = products[item.productId.toString()];
        return (
          <div
            key={item._id}
            className="flex items-center justify-between bg-gray-50 border rounded-xl p-4 mt-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              {product?.imgUrl ? (
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {product?.name || "Loading..."}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product?.stock ?? "N/A"}
                </p>
              </div>
            </div>

            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
              onClick={() => handleWaitinglist(item.productId, order._id)}
            >
              Move to Waiting List
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCard;
