import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../global_redux/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../global_redux/features/wishlist/wishlistSlice";
import { Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

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
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
      return;
    }
    dispatch(addToWishlist(product));
    toast.success("Added to wishlist");
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
      <h3 className="text-sm   font-medium mt-2 line-clamp-1">
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
          const firstSize = product.sizes?.[0];
          dispatch(
            addToCart({
              productId: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.img?.[0],
              size: firstSize?.size || "OS",
              maxStock: firstSize?.stock || 10,
              sizes: product.sizes || [],
              category: product.category?._id || product.category || product.categoryId,
              subCategory: product.subCategory?._id || product.subCategory || product.subCategoryId,
            })
          );
          toast.success(`${product.name} added to cart!`);
        }}
        className="w-full mt-3 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all text-white py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
      >
        <ShoppingCart size={15} />
        Add to Cart
      </button>
    </div>
  );
}