import React, { useState, useEffect } from "react";
import ProductDetails from "./ProductDetails";
import StorekeeperNavbar from "./StorekeeperNavbar.jsx";

const Supplies = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        cache: "no-store",
      });
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/product/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();
      if (data.message) {
        alert("✅ Product deleted successfully.");
        fetchProducts();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("❌ Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const processWaitingList = async (_id) => {
    setLoading(true);
    try {
      const productRes = await fetch(`http://localhost:5000/api/product/${_id}`);
      const productData = await productRes.json();
      console.log("Product data:", productData);  
      const updatedStock = productData
      .stock;

      const ordersRes = await fetch("http://localhost:5000/api/orders/status/Waiting list");
      const orders = await ordersRes.json();

      const relevantOrders = orders.filter((order) =>
        order.items.some((item) => item.productId?._id === _id)
      );
      console.log("Relevant orders:", relevantOrders);
      for (const order of relevantOrders) {
        const item = order.items.find((i) => i.productId?._id === _id);
        console.log("Item in order:", item);
        console.log("Updated stock:", updatedStock);
        if (item && updatedStock >= item.quantity) {
          await fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _id: order._id,
              status: "Ready to pick up",
            }),
          });

          await fetch("http://localhost:5000/api/product/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              updates: [{ _id, operator: "decrease", stock: item.quantity }],
            }),
          });
        }
      }

      alert("✅ Product stock updated and relevant waiting list orders processed.");
      fetchProducts();
    } catch (err) {
      console.error("❌ Error processing waiting list:", err);
      alert("❌ Failed to process waiting list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <StorekeeperNavbar />
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Product Management
        </h2>

        {loading && (
          <p className="text-center text-blue-500 font-semibold mb-4">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-gray-700 text-sm font-semibold">
                <th className="px-6 py-3 border-b">Image</th>
                <th className="px-6 py-3 border-b">Item ID</th>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Stock</th>
                <th className="px-6 py-3 border-b">Category</th>
                <th className="px-6 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">
                      <img
                        src={product.imgUrl}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">{product.itemId}</td>
                    <td className="px-6 py-4 border-b">{product.name}</td>
                    <td className="px-6 py-4 border-b">{product.stock}</td>
                    <td className="px-6 py-4 border-b">
                      {product.categoryId?.name || "No category"}
                    </td>
                    <td className="px-6 py-4 border-b text-center space-x-2">
                      <button
                        onClick={() => setSelectedProductId(product._id)}
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        disabled={loading}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => processWaitingList(product._id)}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                      >
                        Check Waiting List
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedProductId && (
          <ProductDetails
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
            onUpdated={fetchProducts}
          />
        )}
      </div>
    </div>
  );
};

export default Supplies;
