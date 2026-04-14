// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { addToCart } from "../../global_redux/features/cart/cartSlice";
// import { toggleWishlist } from "../../global_redux/features/wishlist/wishlistSlice";
// import { Heart } from "lucide-react";

// export default function ProductCard({ product }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const wishlist = useSelector((state) => state.wishlist.items);
//   const isWishlisted = wishlist.some((item) => item.id === product.id);

//   if (!product) {
//     return null;
//   }
//   const discountedPrice = Math.round(
//     product.price - (product.price * product.discountPercentage) / 100
//   );

//   const handleWishlistClick = (e) => {
//     e.stopPropagation();
//     dispatch(toggleWishlist(product));
//   };

//   return (
//     <div
//       className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition cursor-pointer relative"
//       onClick={() => navigate(`/product/${product.id}`)}
//       tabIndex={0}
//       role="button"
//       onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/product/${product.id}`); }}
//     >
//       {/* Wishlist Icon */}
//       <button
//         className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow hover:bg-pink-50"
//         onClick={handleWishlistClick}
//         aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
//       >
//         <Heart size={20} color={isWishlisted ? "#e80071" : "#aaa"} fill={isWishlisted ? "#e80071" : "none"} />
//       </button>
//       {/* Image */}
//       <div className="h-48 flex items-center justify-center overflow-hidden">
//         <img
//           src={product.thumbnail}
//           alt={product.title}
//           crossOrigin="anonymous"
//           className="h-full object-contain hover:scale-105 transition"
//         />
//       </div>

//       {/* Title */}
//       <h3 className="text-sm font-medium text-[#111111] mt-2 line-clamp-2">
//         {product.title}
//       </h3>

//       {/* Rating */}
//       <div className="flex items-center gap-1 mt-1">
//         <span className="bg-[#E80071] text-white text-xs px-2 py-[2px] rounded">
//           {product.rating} ★
//         </span>
//       </div>

//       {/* Price */}
//       <div className="mt-2 flex items-center gap-2">
//         <span className="text-lg font-bold text-[#111111]">
//           ₹{discountedPrice}
//         </span>

//         <span className="text-[#6B7280] line-through text-sm">
//           ₹{product.price}
//         </span>

//         <span className="text-[#E80071] text-sm font-medium">
//           {Math.round(product.discountPercentage)}% off
//         </span>
//       </div>

//       {/* Button */}
//       <button 
//        onClick={() => dispatch(addToCart(product))}
//       className="w-full mt-3 bg-[#E80071] hover:bg-[#C6005C] text-white py-1.5 rounded text-sm">
//         Add to Cart
//       </button>
//     </div>
//   );
// }

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../global_redux/features/cart/cartSlice";
import { toggleWishlist } from "../../global_redux/features/wishlist/wishlistSlice";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlist = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlist?.some(
    (item) => item._id === product._id
  );

  if (!product) return null;

  // ✅ Calculate discount
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition cursor-pointer relative"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* ❤️ Wishlist */}
      <button
        className="absolute top-3 right-3 p-1 rounded-full bg-white shadow"
        onClick={handleWishlistClick}
      >
        <Heart
          size={20}
          color={isWishlisted ? "#e80071" : "#aaa"}
          fill={isWishlisted ? "#e80071" : "none"}
        />
      </button>

      {/* 🖼️ Image */}
      <div className="h-48 flex items-center justify-center overflow-hidden">
        <img
          src={product.img?.[0]}
          alt={product.name}
          className="h-full object-contain"
        />
      </div>

      {/* 📝 Title */}
      <h3 className="text-sm font-medium mt-2 line-clamp-2">
        {product.name}
      </h3>

      {/* ⭐ Rating */}
      <div className="mt-1">
        <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">
          {product.rating || 4} ★
        </span>
      </div>

      {/* 💸 Price */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-bold">
          ₹{product.price}
        </span>

        {product.originalPrice && (
          <span className="line-through text-sm text-gray-500">
            ₹{product.originalPrice}
          </span>
        )}

        {discountPercentage > 0 && (
          <span className="text-pink-600 text-sm">
            {discountPercentage}% off
          </span>
        )}
      </div>

      {/* 🛒 Add to Cart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch(addToCart(product));
        }}
        className="w-full mt-3 bg-pink-600 text-white py-1.5 rounded text-sm"
      >
        Add to Cart
      </button>
    </div>
  );
}