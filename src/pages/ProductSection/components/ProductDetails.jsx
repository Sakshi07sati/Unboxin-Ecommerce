import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../global_redux/api";
import { ChevronRight, Star, Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "../../../global_redux/features/cart/cartSlice";
import { toggleWishlist } from "../../../global_redux/features/wishlist/wishlistSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        const data = res.data.data;

        setProduct(data);
        // Set initial image
        if (data.img && data.img.length > 0) {
          setSelectedImage(data.img[0]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-medium text-gray-500">Loading Product...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  // Calculate Discount
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Parse Sizes if they come as a JSON string from backend
  const availableSizes = typeof product.sizes === 'string' 
    ? JSON.parse(product.sizes) 
    : product.sizes;

  const isWishlisted = wishlist?.some((item) => item._id === product._id);

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    const sizeInfo = availableSizes?.find((s) => s.size === selectedSize);
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.img?.[0],
        size: selectedSize,
        maxStock: sizeInfo?.stock || 10,
        sizes: availableSizes || [],
      })
    );
    toast.success(`${product.name} (${selectedSize}) added to cart!`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-10 font-sans text-[#282c3f]">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-6 text-gray-500">
        <span>Home</span> <ChevronRight size={14} />
        <span className="capitalize">{product.category?.name || "Category"}</span> <ChevronRight size={14} />
        <span className="font-bold text-gray-800 truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* LEFT - Image Gallery (Myntra Grid Style) */}
        <div className="md:col-span-7 grid grid-cols-2 gap-3">
          {product.img?.map((img, i) => (
            <div key={i} className="overflow-hidden border border-gray-100 group">
              <img
                src={img}
                alt={`Product View ${i}`}
                className="w-full h-[300px] object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* RIGHT - Content Section */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#282c3f] leading-tight">{product.name}</h1>
            <p className="text-lg text-gray-500 mt-1">{product.productDetails}</p>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 border w-fit px-2 py-1 rounded-sm font-bold text-sm hover:border-gray-800 cursor-pointer transition-colors">
            <span>{product.rating || "4.2"}</span>
            <Star size={14} className="fill-[#14958f] text-[#14958f]" />
            <span className="text-gray-400 font-normal border-l ml-1 pl-1">2.4k Ratings</span>
          </div>

          <hr className="my-2 border-gray-100" />

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#282c3f]">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">MRP ₹{product.originalPrice}</span>
                <span className="text-xl font-bold text-[#ff905a]">({discount}% OFF)</span>
              </>
            )}
          </div>
          <p className="text-[#03a685] text-sm font-bold">inclusive of all taxes</p>

          {/* Size Selection */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold uppercase tracking-wider">Select Size</h3>
              <button className="text-[#ff3f6c] font-bold text-sm uppercase tracking-tight">Size Chart {'>'}</button>
            </div>

            <div className="flex flex-wrap gap-3">
              {availableSizes?.map((s, i) => (
                <button
                  key={i}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all
                    ${s.stock === 0 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed italic" : "hover:border-[#ff3f6c]"}
                    ${selectedSize === s.size ? "border-[#ff3f6c] text-[#ff3f6c] border-2" : "border-gray-300 text-gray-700"}
                  `}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToBag}
              className="flex-1 bg-[#ff3f6c] text-white flex items-center justify-center gap-3 py-4 rounded font-bold text-base hover:bg-[#e63a62] active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              <ShoppingBag size={20} />
              ADD TO BAG
            </button>

            <button
              onClick={handleWishlist}
              className={`flex-1 border flex items-center justify-center gap-3 py-4 rounded font-bold text-base transition-colors ${
                isWishlisted
                  ? "border-pink-500 text-pink-600 bg-pink-50"
                  : "border-gray-300 hover:border-gray-800"
              }`}
            >
              <Heart
                size={20}
                fill={isWishlisted ? "#ff3f6c" : "none"}
                color={isWishlisted ? "#ff3f6c" : "currentColor"}
              />
              {isWishlisted ? "WISHLISTED" : "WISHLIST"}
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-base font-bold uppercase tracking-wider mb-4">Product Details</h3>
            <p className="text-sm text-[#282c3f] leading-relaxed whitespace-pre-line">
              {product.productDescription || "No description available for this product."}
            </p>
            
            {/* Delivery Features (Myntra Style) */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-gray-400">100% Original Products</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-gray-400">Pay on delivery might be available</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="text-gray-400">Easy 14 days returns and exchanges</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails