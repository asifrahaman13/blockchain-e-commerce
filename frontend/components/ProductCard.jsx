import React from "react";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const [owner, name, description, price, product_id] = product;

  return (
    <>
      <div className="product max-w-xs rounded overflow-hidden shadow-lg flex flex-col h-full group hover:transition duration-300 transform hover:-translate-y-2 hover:shadow-xl mb-8 mx-8">
  <Link href={`products/${product_id}`}>
    <img
      src={`https://sapphire-bloody-ant-105.mypinata.cloud/ipfs/${product_id}`}
      alt={name}
      className="w-full h-40 object-cover text-gray-100"
    />
    <div className="px-3 py-2 flex-grow">
      <div className="flex justify-between items-center">
        <div className="font-bold text-sm mb-1 text-gray-100">💻 {name}</div>
        <span className="text-gray-100 text-xl">
          ₹ {price.toString()}
        </span>
      </div>
      <p className="text-gray-100 text-sm">
        📨 {description.substring(0, 200)}
      </p>
    </div>
    <div className="px-3 py-2">
      <span className="text-gray-100 text-sm">🧑🏼‍💻 Owner: {owner}</span>
    </div>
  </Link>
</div>

    </>
  );
};

export default ProductCard;
