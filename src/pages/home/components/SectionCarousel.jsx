// SectionCarousel.jsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { fetchProductById } from "../../../global_redux/features/product/productThunks";
import { addToCart } from "../../../global_redux/features/cart/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { fetchProductById } from "../../../global_redux/features/products/productsThunks";

// Slide Navigation Buttons
const SlideButtons = () => {
  const swiper = useSwiper();

  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        className="absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-md backdrop-blur transition-all hover:border-primary/40 hover:text-primary md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 stroke-[2.4]" />
      </button>

      <button
        onClick={() => swiper.slideNext()}
        className="absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 shadow-md backdrop-blur transition-all hover:border-primary/40 hover:text-primary md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 stroke-[2.4]" />
      </button>
    </>
  );
};

const SectionCarousel = ({ sectionId, sectionName, productIds }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedProductIdsRef = useRef(new Set()); // Track which product IDs we've already fetched
  
  const navigate = useNavigate();

  // Format section name for display (e.g., "comic-style" -> "Comic Style")
  const formatSectionName = (name) => {
    if (!name) return "";
    return name
      .toString()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Fetch product details for all product IDs
  useEffect(() => {
    // Skip if no product IDs
    if (!productIds || productIds.length === 0) {
      setLoading(false);
      return;
    }

    // Create a stable key from productIds to check if we've already fetched (create copy to avoid mutation)
    const productIdsKey = [...productIds].sort().join(',');
    
    // Prevent duplicate calls by checking if we've already fetched these exact product IDs
    if (fetchedProductIdsRef.current.has(productIdsKey)) {
      setLoading(false);
      return;
    }

    // Mark these product IDs as being fetched
    fetchedProductIdsRef.current.add(productIdsKey);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productPromises = productIds.map((id) =>
          dispatch(fetchProductById(id)).unwrap()
        );
        const fetchedProducts = await Promise.all(productPromises);

        const validProducts = fetchedProducts.filter((p) => p !== null);

        // Sort newest first & keep only 4
        const sortedProducts = validProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setProducts(sortedProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
        // Don't remove from ref on error - prevent infinite retries
        // Only allow manual retry or page refresh
        console.warn("⚠️ Product fetch failed. Will not retry automatically to prevent server load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds ? [...productIds].sort().join(',') : '']); // Only depend on the actual IDs, not the array reference


  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || currentPrice >= originalPrice) {
      return 0;
    }
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.img,
        size: "M",
        memberSavings: product.memberSavings,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleExploreMore = (sectionName) => {
    // Navigate to section-specific products page
    navigate(`/shop?section=${sectionName}`);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full px-4 py-10 md:px-10">
        <div className="flex h-56 flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-500 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary"></div>
          <p className="mt-3 text-sm font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't render if no products
  }

  return (
    <div className="mx-auto w-full px-4 py-10 md:px-7 md:py-14">
      {/* Section Title */}
      <div className="mb-7 flex flex-col items-center justify-between gap-3 md:mb-10 md:flex-row">
        <div>
           
          <h3 className="text-xl md:text-2xl font-bold  text-slate-900">
            {formatSectionName(sectionName)}
          </h3>
        </div>
        <button
          onClick={() => handleExploreMore(sectionName)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:text-primary"
        >
          Explore All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Products Carousel */}
      <div className="relative overflow-visible rounded-3xl border border-slate-100 bg-white px-2 py-5 shadow-sm md:px-4 md:py-6">
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 4 },
          }}
        >
          {/* Product Cards */}
          {products.map((product, index) => (
            <SwiperSlide key={`${product._id}-${index}`}>
              <div className="group flex h-full w-full flex-col px-2 md:px-3">
                {/* Image Container */}
                <div 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="relative mb-2 cursor-pointer overflow-hidden rounded-2xl"
                >
                  <img
                    src={product.img?.[0] ||"/placeholder.png"}
                    alt={product.name}
                    className="h-[21rem] w-full rounded-2xl object-cover transition-transform duration-500 md:h-[20rem] md:group-hover:scale-105"
                  />

                  {/* Desktop Hover Overlay */}
                  <div className="absolute inset-0 hidden items-end justify-center rounded-2xl bg-black/0 p-4 transition-all duration-300 group-hover:bg-black/35 md:flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="flex w-full translate-y-4 items-center justify-center gap-2 rounded-xl bg-primary/95 px-5 py-2.5 text-sm font-bold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <ShoppingCart size={15} />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Mobile Add to Cart Button */}
                {/* <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="md:hidden bg-[#d4ff00] text-black font-bold px-4 py-2 rounded-lg rounded-t-none
                             flex items-center justify-center gap-2 shadow-lg mb-3
                             hover:bg-[#c4ef00] transition-all"
                >
                 <Eye className="w-5 h-5" />
                      Click to View
                </button> */}

                {/* Product Details */}
                <h3 className="mt-1 line-clamp-1 text-base font-bold text-slate-900">
                  {product.name}
                </h3>
                
                {/* Price with discount */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 md:text-xl">
                    ₹{product.originalPrice || product.price || product.sellingPrice}
                  </span>
                  {product.price && product.originalPrice && product.price > product.originalPrice && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.price}
                      </span>
                      {calculateDiscountPercentage(product.price, product.originalPrice) > 0 && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {calculateDiscountPercentage(product.price, product.originalPrice)}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* See More Card */}
          <SwiperSlide>
            <div className="flex h-full w-full flex-col px-2 md:px-3">
              <div
                onClick={() => handleExploreMore(sectionName)}
                className="group/more relative mb-3 flex h-[21rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 transition-all duration-300 hover:border-primary/50 hover:from-primary/10 hover:to-primary/5 md:h-[20rem]"
              >
                {/* Icon Circle */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 transition-all duration-300 group-hover/more:scale-110 group-hover/more:bg-primary/20">
                  <ArrowRight className="h-8 w-8 text-slate-600 transition-colors group-hover/more:text-primary" />
                </div>

                {/* Text */}
                <h3 className="mb-2 text-xl font-bold text-slate-700 transition-colors group-hover/more:text-slate-900">
                  See More
                </h3>
                <p className="px-4 text-center text-sm capitalize text-slate-500 transition-colors group-hover/more:text-slate-700">
                  Explore all {formatSectionName(sectionName)} products
                </p>

                {/* Plus Icon Background */}
                <div className="absolute right-4 top-4 text-5xl text-slate-300 transition-colors group-hover/more:text-primary/40">
                  +
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-600">
                More Products
              </h3>
              <p className="mt-1 font-medium text-slate-400">Click to explore</p>
            </div>
          </SwiperSlide>

          <SlideButtons />
        </Swiper>
      </div>

      {/* Explore Button */}
      <div className="mt-7 flex justify-center md:hidden">
        <button
          onClick={() => handleExploreMore(sectionName)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:text-primary"
        >
          Explore All {formatSectionName(sectionName)}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SectionCarousel;