import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../global_redux/api";
import {
  ChevronRight,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "../../../global_redux/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../global_redux/features/wishlist/wishlistSlice";
import { InnerImageZoom } from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Custom CSS for ReactQuill content styling
const quillStyles = `
  .ql-editor-content h1, .ql-editor-content h2, .ql-editor-content h3,
  .ql-editor-content h4, .ql-editor-content h5, .ql-editor-content h6 {
    line-height: 1.2;
    margin: 0;
  }
  .ql-editor-content h1 { font-size: 1.5em; }
  .ql-editor-content h2 { font-size: 1.25em; }
  .ql-editor-content h3 { font-size: 1.125em; }
  .ql-editor-content strong { font-weight: 600; }
  .ql-editor-content em { font-style: italic; }
  .ql-editor-content ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0;
  }
  .ql-editor-content ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 0;
  }
  .ql-editor-content p {
    margin: 0;
    line-height: 1.5;
  }
  .ql-editor-content a {
    color: #3b82f6;
    text-decoration: underline;
  }
  .ql-editor-content blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1em;
    margin: 0;
    font-style: italic;
    color: #6b7280;
  }
  .ql-editor-content {
    line-height: 1.5;
  }
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        const data = res.data.product || res.data.data || res.data;
        setProduct(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-gray-600 text-xl mb-4">Product not found</div>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Parse sizes if they come as JSON string from backend
  const availableSizes =
    (typeof product.sizes === "string"
      ? JSON.parse(product.sizes)
      : product.sizes)?.filter(s => s.size && s.size !== "null" && s.size !== "") || [];

  // Calculate discount percentage
  const discountPercentage =
    product.originalPrice &&
      product.price &&
      product.price < product.originalPrice
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) *
        100,
      )
      : 0;

  const isWishlisted = wishlist?.some((item) => item._id === product._id);

  const handleAddToBag = () => {
    const hasSizes = availableSizes && availableSizes.length > 0;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size before adding to cart!");
      return;
    }

    const sizeInfo = hasSizes
      ? availableSizes.find((s) => s.size === selectedSize)
      : null;

    if (hasSizes && (!sizeInfo || sizeInfo.stock <= 0)) {
      toast.error(`Size ${selectedSize} is out of stock!`);
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.img?.[0],
        size: selectedSize || "One Size",
        maxStock: sizeInfo?.stock || product.stock || 10,
        sizes: availableSizes || [],
        category: product.category?._id || product.category || product.categoryId,
        subCategory:
          product.subCategory?._id || product.subCategory || product.subCategoryId,
      })
    );
    toast.success(`${product.name} added to cart 🛒`);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist! ❤️");
    }
  };

  const categoryName =
    product.category?.name ||
    product.category?.category ||
    (typeof product.category === "string" ? product.category : "Category");

  return (
    <div className="min-h-screen py-8">
      <style>{quillStyles}</style>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600 flex items-center gap-1 flex-wrap">
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <ChevronRight size={14} />
          <span className="capitalize hover:text-blue-600 cursor-pointer">
            {categoryName}
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-2xl md:shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row w-full gap-16 p-2">
            {/* ─── Image Section ─── */}
            <div className="lg:w-[55%]">
              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 gap-2">
                {product.img?.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="product-image-container rounded-lg border border-gray-200 bg-gray-100 overflow-hidden"
                  >
                    <InnerImageZoom
                      src={imgUrl}
                      zoomSrc={imgUrl}
                      zoomType="hover"
                      zoomPreload={true}
                      hideHint={true}
                      
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Swiper */}
              <div className="md:hidden w-full">
                <Swiper
                  slidesPerView={1}
                  loop
                  autoplay={{ delay: 3000 }}
                  className="rounded-lg"
                  modules={[Navigation, Pagination, Autoplay]}
                  pagination={{ clickable: true }}
                  navigation
                >
                  {product.img?.map((imgUrl, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full h-[25rem] rounded-lg overflow-hidden border border-gray-300">
                        <img
                          src={imgUrl}
                          alt={`Product ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* ─── Product Info ─── */}
            <div className="flex flex-col lg:w-[45%]">
              {/* Category Badge */}
              <span className="inline-block w-fit px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3 capitalize">
                {categoryName} 
              </span>

              {/* Product Name */}
              <h1 className="text-3xl font-bold capitalize text-gray-700 mb-2">
                {product.name}
              </h1>

              {/* Rating Badge */}
              <div className="flex items-center gap-1 border w-fit px-2 py-1 rounded-sm font-bold text-sm hover:border-gray-800 cursor-pointer transition-colors mb-4">
                <span>{product.rating || "4.2"}</span>
                <Star size={14} className="fill-[#14958f] text-[#14958f]" />
                <span className="text-gray-400 font-normal border-l ml-1 pl-1">
                  2.4k Ratings
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-lg">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Size Selection */}
              {availableSizes && availableSizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      SELECT SIZE
                    </h3>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                      Size Chart {">"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((s, i) => (
                      <div key={i} className="text-center">
                        <button
                          disabled={s.stock <= 0}
                          onClick={() => setSelectedSize(s.size)}
                          className={`px-5 py-2 rounded-lg border text-base font-semibold shadow-sm transition-all ${s.stock <= 0
                              ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                              : selectedSize === s.size
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white border-gray-300 hover:border-primary"
                            }`}
                        >
                          {s.size.toUpperCase()}
                        </button>
                        <p
                          className={`text-xs mt-1 ${s.stock <= 0 ? "text-gray-400" : "text-primary"
                            }`}
                        >
                          {s.stock <= 0 ? "Out of stock" : `${s.stock} left`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-10">
                {/* Add to Cart */}
                <div className="relative inline-block">
                  <div className="absolute" />
                  <button
                    onClick={handleAddToBag}
                    className="relative bg-primary w-full  text-white font-bold text-base sm:text-lg md:text-xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl  font-mono  transition-transform duration-200 ease-in-out flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Add To Cart
                  </button>
                </div>

                {/* Wishlist */}
                <div className="relative inline-block">
                  <div className="absolute " />
                  <button
                    onClick={handleWishlist}
                    className="relative bg-white w-full   text-black font-bold text-base sm:text-lg md:text-xl px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 font-mono border-gray-300 transition-transform duration-200 ease-in-out flex items-center justify-center gap-2"
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "#ff3f6c" : "none"}
                      color={isWishlisted ? "#ff3f6c" : "currentColor"}
                    />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </button>
                </div>
              </div>

              {/* Product Info Accordion */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  PRODUCT INFORMATION
                </h2>

                {/* Product Details */}
                <div className="border border-gray-200 rounded-lg mb-3">
                  <button
                    onClick={() => toggleSection("details")}
                    className="w-full flex justify-between p-4 hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Details
                    </h3>
                    <motion.div
                      animate={{ rotate: openSection === "details" ? 180 : 0 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSection === "details" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-4 border-t border-gray-100">
                          <div
                            className="text-sm text-gray-900 font-medium leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                            dangerouslySetInnerHTML={{
                              __html: product.productDetails || "",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description */}
                <div className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection("description")}
                    className="w-full flex justify-between p-4 hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">
                      Description
                    </h3>
                    <motion.div
                      animate={{
                        rotate: openSection === "description" ? 180 : 0,
                      }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSection === "description" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-4 border-t border-gray-100">
                          <div
                            className="ql-editor-content text-sm text-gray-900 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html:
                                product.productDescription ||
                                "<p>No description available.</p>",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Trust Badges */}
                <div className="my-4 space-y-2 text-sm text-gray-400 font-medium">
                  <p>✔ 100% Original Products</p>
                  <p>✔ Pay on delivery might be available</p>
                  <p>✔ Easy 14 days returns and exchanges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
