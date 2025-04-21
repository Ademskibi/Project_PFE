import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  const allOutOfStock = products.every((p) => p.stock === 0);

  return (
    <div>
      {allOutOfStock ? (
        <div className="text-center py-10">
          <img
            src="/out-of-stock-illustration.svg"
            alt="No products"
            className="mx-auto w-40 mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Le magasin est en cours de réapprovisionnement
          </h2>
          <p className="text-gray-500">Veuillez revenir plus tard ou contacter l’équipe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
