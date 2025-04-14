import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import AddOrder from "./Addorder";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch(); // ✅ Redux hook
  const [showAddOrder, setShowAddOrder] = useState(false);
  console.log("Product in  :", product); // Debugging line
  // Close modal handler
  const closeModal = () => setShowAddOrder(false);

  // Optional: Add directly without quantity (not used here, but ready if needed)
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        imgUrl: product.imgUrl,
        quantity: 1,
      })
    );
  };
  console.log("Product in ProductCard:", product._id); 
  return (
    <div className="border p-4 rounded shadow-md">
      {/* Product Image */}
      <img
        src={product.imgUrl}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />

      {/* Product Name */}
      <h3 className="text-lg font-semibold">{product.name}</h3>

      {/* Available Quantity */}
      <p className="text-gray-600">Available Quantity: {product.quantity}</p>

      {/* Add to Order Button */}
      <button
        onClick={() => setShowAddOrder(true)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Add to Order
      </button>

      {/* Modal Structure */}
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
              X
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
