import React, { useEffect, useState } from "react";

const OrderCard = ({ order, onOrderAction }) => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (!order?.items?.length) return;

    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          order.items.map((item) =>
            item?.productId
              ? fetch("http://localhost:5000/api/product", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ _id: item.productId }),
                }).then((res) => res.json())
              : Promise.resolve(null)
          )
        );

        const productsMap = {};
        order.items.forEach((item, index) => {
          const productId = item?.productId?.toString?.();
          if (productId) {
            productsMap[productId] = responses[index];
          }
        });

        setProducts(productsMap);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [order]);

  useEffect(() => {
    if (order?.items?.length === 0) {
      const deleteOrder = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/orders/${order._id}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.ok) {
            console.log("✅ Order deleted successfully");
            onOrderAction?.();
          } else {
            console.error("❌ Failed to delete order");
          }
        } catch (error) {
          console.error("❌ Error deleting order:", error.message);
        }
      };

      deleteOrder();
    }
  }, [order]);

  const handleWaitinglist = async (product, orderId) => {
    try {
      if (!product?._id) return;

      const response = await fetch(
        `http://localhost:5000/api/waiting/${orderId}/${product._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Add to waiting list" }),
        }
      );

      if (!response.ok) throw new Error("❌ Failed to add to waiting list");

      const removeItemRes = await fetch(
        `http://localhost:5000/api/remove-item/${orderId}/${product._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!removeItemRes.ok)
        throw new Error("❌ Failed to remove item from order");

      // ✅ Now trigger the notification (after success)
      await fetch("http://localhost:5000/api/create_notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: order.employeeId,
          message: "Add to waiting list",
          type: "waiting",
          order: order._id,
        }),
      });

      onOrderAction?.();
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

      // ✅ Create notification only after success
      await fetch("http://localhost:5000/api/create_notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: order.employeeId,
          message: "Come take your order",
          type: "ready to pick up",
          order: order._id,
        }),
      });

      console.log(`✅ Order ${orderId} updated to Ready to pick up`);
      onOrderAction?.();
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 mb-8 transition-all hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            🧾 Order #{order.OrderId}
          </h2>
          <div className="text-sm text-gray-600">
            <p><strong>Status:</strong> {order.status}</p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium shadow-md transition"
          onClick={() => handleUpdateStatus(order._id)}
        >
          ✅ Ready to Pick Up
        </button>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => {
          const productId = item?.productId?.toString?.();
          const product = productId ? products[productId] : null;

          return (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border rounded-xl transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {product?.imgUrl ? (
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-xl text-xs text-gray-500">
                    No Image
                  </div>
                )}

                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {product?.name || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: <strong>{item.quantity}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock:{" "}
                    <span
                      className={
                        product?.stock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {product?.stock ?? "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                className="mt-4 sm:mt-0 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow transition disabled:opacity-50"
                onClick={() => handleWaitinglist(product, order._id)}
                disabled={!product}
              >
                ⏳ Move to Waiting List
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
