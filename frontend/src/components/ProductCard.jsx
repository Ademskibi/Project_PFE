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
    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm transition transform hover:scale-105 hover:shadow-lg flex flex-col w-full max-w-xs">
      {/* Product Image */}
      <img
        src={product.imgUrl || "/default-image.jpg"}
        alt={product.name}
        onError={(e) => {
          e.target.src = "/default-image.jpg";
        }}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* Product Name */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>

      {/* Available Quantity */}
      <p className="text-gray-500 text-sm mb-4">In Stock: {product.stock}</p>

      {/* Add to Order Button */}
      <button
        onClick={() => setShowAddOrder(true)}
        className={`mt-auto py-2 px-4 rounded-2xl text-white font-medium transition duration-200 ${
          product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Order"}
      </button>

      {/* Modal for AddOrder */}
      {showAddOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <AddOrder item={{ productId: product }} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
