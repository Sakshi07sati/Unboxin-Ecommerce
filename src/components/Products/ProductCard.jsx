import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../global_redux/features/cart/cartSlice";
export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    if (!product) {
        return (null);}
  const discountedPrice = Math.round(
    product.price - (product.price * product.discountPercentage) / 100
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition cursor-pointer">

      {/* Image */}
      <div className="h-48 flex items-center justify-center overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full object-contain hover:scale-105 transition"
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-[#111111] mt-2 line-clamp-2">
        {product.title}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-1">
        <span className="bg-[#E80071] text-white text-xs px-2 py-[2px] rounded">
          {product.rating} ★
        </span>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold text-[#111111]">
          ₹{discountedPrice}
        </span>

        <span className="text-[#6B7280] line-through text-sm">
          ₹{product.price}
        </span>

        <span className="text-[#E80071] text-sm font-medium">
          {Math.round(product.discountPercentage)}% off
        </span>
      </div>

      {/* Button */}
      <button 
       onClick={() => dispatch(addToCart(product))}
      className="w-full mt-3 bg-[#E80071] hover:bg-[#C6005C] text-white py-1.5 rounded text-sm">
        Add to Cart
      </button>
    </div>
  );
}