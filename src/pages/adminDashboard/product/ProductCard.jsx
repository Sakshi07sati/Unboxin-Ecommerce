import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

   const handleAdd = () => {
    navigate("/admin/products/add"); // make sure this route exists
  };

  return (
    <div className="border p-4 rounded shadow">
      <img src={product.img} alt={product.name} className="w-full h-40 object-cover mb-2"/>
      <h3 className="font-bold">{product.name}</h3>
      <p>Brand: {product.brand}</p>
      <p>Price: ₹{product.price}</p>
      <p>Discount: {product.discount}%</p>
      <p>Rating: {product.rating}</p>
      <div className="flex justify-between mt-2">
        
        <button 
          onClick={handleAdd} 
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
