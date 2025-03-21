import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import AddOrder from "./Addorder"; 

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [showAddOrder, setShowAddOrder] = useState(false);


    // Close modal handler
    const closeModal = () => setShowAddOrder(false);

    return (
        <div className="border p-4 rounded shadow-md">
            <img src={product.imgUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Available Quantity: {product.quantity}</p>
            
            <button
                onClick={() => setShowAddOrder(true)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add to Order
            </button>

            {/* Modal Structure */}
            {showAddOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <button 
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        >
                            X
                        </button>
                        <AddOrder item={{ productId: product }} onClose={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
