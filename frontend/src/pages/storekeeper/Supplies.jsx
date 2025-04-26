import React, { useState, useEffect } from "react";

const Supplies = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        cache: "no-store", // Avoids 304 Not Modified issues
      });
      const data = await response.json();
      console.log(data); // Check what you receive
      
      // Here data is an array already
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  // Delete a product
  const deleteProduct = async (_id) => {
    try {
      const response = await fetch("http://localhost:5000/api/product/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id }),
      });
      const data = await response.json();
      if (data.message) fetchProducts();
    } catch (error) {
      console.error("❌ Error deleting product:", error);
    }
  };

  // Update a product (example: just change name to "Updated Product Name")
  const updateProduct = async (_id) => {
    const updatedData = { name: "Updated Product Name" };
    try {
      const response = await fetch("http://localhost:5000/api/product/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, ...updatedData }),
      });
      const data = await response.json();
      if (data.message) fetchProducts();
    } catch (error) {
      console.error("❌ Error updating product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
 console.log(products); // Check what you receive
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Product Management</h2>
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
                  <td className="px-6 py-4 border-b">{product.categoryId?.name || "No category"}</td>
                  <td className="px-6 py-4 border-b text-center space-x-2">
                    <button
                      onClick={() => updateProduct(product._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Supplies;
