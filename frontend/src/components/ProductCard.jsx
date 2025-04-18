import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import AddOrder from "./Addorder";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showAddOrder, setShowAddOrder] = useState(false);

  const closeModal = () => setShowAddOrder(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        imgUrl: product.imgUrl,
        stock: 1,
      })
    );
  };

  return (
    <div className="border p-4 rounded shadow-md">
      {/* Product Image */}
      <img
        src={product.imgUrl || "/default-image.jpg"}
        alt={product.name}
        onError={(e) => {
          e.target.src = "/default-image.jpg";
        }}
        className="w-full h-40 object-cover rounded"
      />

      {/* Product Name */}
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>

      {/* Available Quantity */}
      <p className="text-gray-600">Available Stock: {product.stock}</p>

      {/* Add to Order Button */}
      <button
        onClick={() => setShowAddOrder(true)}
        className={`mt-2 px-4 py-2 rounded w-full text-white transition ${
          product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Order"}
      </button>

      {/* Modal for AddOrder */}
      {showAddOrder && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Close"
            >
              ✕
            </button>

            {/* AddOrder Component */}
            <AddOrder item={{ productId: product }} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
