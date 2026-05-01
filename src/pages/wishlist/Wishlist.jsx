import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { removeFromWishlist } from "../../global_redux/features/wishlist/wishlistSlice";
import { addToCart } from "../../global_redux/features/cart/cartSlice";
import toast from "react-hot-toast";

/* ─── Single Wishlist Card ─────────────────────────────────────── */
const WishlistCard = ({ product, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (e) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(product._id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // pick first available size if sizes exist
    const sizes =
      typeof product.sizes === "string"
        ? JSON.parse(product.sizes)
        : product.sizes;
    const firstAvailable = sizes?.find((s) => s.stock > 0);

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: Array.isArray(product.img) ? product.img[0] : product.img,
        size: firstAvailable?.size || "One Size",
        maxStock: firstAvailable?.stock || product.stock || 10,
        sizes: sizes || [],
        category: product.category?._id || product.category || product.categoryId,
        subCategory: product.subCategory?._id || product.subCategory || product.subCategoryId,
      })
    );
    toast.success(`${product.name} added to cart 🛒`);
  };

  const imageUrl = Array.isArray(product.img) ? product.img[0] : product.img;
  const discountPct =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group relative"
    >
      {/* Neobrutalist offset shadow */}
      <div className="absolute" />

      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="relative bg-white rounded-2xl border border-dashed border-gray-600 overflow-hidden cursor-pointer transition-transform duration-200"
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-[3/3]">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Discount badge */}
          {discountPct > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-black px-2 py-1 rounded-md  font-mono">
              {discountPct}% OFF
            </span>
          )}

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-white  rounded-full p-1.5"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Category */}
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {product.category?.name || product.category?.category || (typeof product.category === 'string' ? product.category : "Category")}
            </span>
          )}

          <h3 className="mt-2 font-bold text-gray-900 text-sm leading-tight line-clamp-1 font-mono">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-black text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <div className="relative mt-4">
            <div className="absolute " />
            <button
              onClick={handleAddToCart}
              className="relative w-full bg-primary text-white font-bold text-sm py-2.5 rounded-xl  flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty State ───────────────────────────────────────────────── */
const EmptyWishlist = ({ onBrowse }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4"
  >
    {/* Animated heart */}
    <div className="relative mb-8">
      <div className="absolute rounded-full" />
      <div className="relative w-24 h-24 bg-primary rounded-full  flex items-center justify-center">
        <Heart size={40} className="text-white" strokeWidth={2.5} />
      </div>
    </div>

    <h2 className="text-3xl font-black text-gray-900 font-mono mb-3">
      Nothing saved yet
    </h2>
    <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
      Hit the heart icon on any product to save it here for later.
    </p>

    {/* Browse button */}
    <div className="relative">
      <div className="absolute " />
      <button
        onClick={onBrowse}
        className="relative bg-primary text-white font-semibold text-base px-8 py-3 rounded-xl flex items-center gap-3  duration-150"
      >
        Browse Products
        <ArrowRight size={18} />
      </button>
    </div>
  </motion.div>
);

/* ─── Main Wishlist Page ────────────────────────────────────────── */
const Wishlist = () => {
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 flex items-end justify-between gap-4 border-b-2 border-black pb-5"
          >
            <div className="flex items-center gap-3">
              {/* Icon pill */}
              <div className="relative hidden sm:block">
                <div className="absolute" />
                <div className="relative w-10 h-10 bg-primary rounded-lg  flex items-center justify-center">
                  <Heart size={18} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">
                  Your Saved Items
                </p>
                <h1 className="text-3xl font-black text-gray-900 font-mono leading-tight">
                  Wishlist
                </h1>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <span className="bg-black text-primary text-sm font-black px-4 py-1.5 rounded-full font-mono whitespace-nowrap">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </motion.div>

          {/* Content */}
          {wishlistItems.length === 0 ? (
            <EmptyWishlist onBrowse={() => navigate("/products")} />
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {wishlistItems.map((product, index) => (
                  <WishlistCard
                    key={product?._id || product?.id || `wishlist-${index}`}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;