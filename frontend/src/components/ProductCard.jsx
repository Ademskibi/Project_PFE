import React from "react";
import { useCart } from "../context/CartContext"; // Adjust path if needed

const ProductCard = ({ product }) => {
    const { addToCart } = useCart(); // Ensure it's defined

    return (
        <div className="border p-4 rounded shadow-md">
            <img src={product.imgUrl} alt={product.name} className="w-full h-40 object-cover" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">Quantity: {product.quantity}</p>
            <button
                onClick={() => addToCart(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add to order
            </button>
        </div>
    );
};

export default ProductCard;
