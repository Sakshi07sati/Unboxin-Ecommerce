// Shop.jsx – FIXED & CLEAN VERSION
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../../../global_redux/features/cart/cartSlice";
import { Search, Loader2, ArrowRight } from "lucide-react";
import DynamicSection from "../../home/components/DynamicSection";
import toast from "react-hot-toast";

import {
  fetchPublicProducts,
} from "../../../global_redux/features/product/productThunks";

// import { clearProducts } from "../../../global_redux/features/product/productSlice";
import { fetchSectionsProduct } from "../../../global_redux/features/sectionProducts/sectionProductThunks";

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, status, error, hasLoaded } = useSelector(
    (state) => state.products
  );
  const { sections } = useSelector((state) => state.sectionProduct);



  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const section = queryParams.get("section");

  // 📌 FIXED FETCH LOGIC — Load both products and sections
  useEffect(() => {
    const fetchData = async () => {
      // Always fetch public products to have them available for filtering
      dispatch(fetchPublicProducts());
      // Always fetch sections to know which products belong where
      dispatch(fetchSectionsProduct());
    };

    fetchData();
  }, [dispatch]);



  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Filter products (size, category)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const seenIds = new Set();

    return products.filter((product) => {
      if (seenIds.has(product._id)) return false;

      if (
        category &&
        product.category?.toLowerCase() !== category.toLowerCase()
      )
        return false;

      if (section) {
        const targetSection = sections.find(
          (s) => s.section?.toLowerCase() === section.toLowerCase()
        );
        if (targetSection) {
          const sectionProductIds = targetSection.products.map((p) =>
            typeof p === "string" ? p : p._id || p
          );
          if (!sectionProductIds.includes(product._id)) return false;
        } else {
          return false;
        }
      }

      seenIds.add(product._id);
      return true;
    });
  }, [products, category, section, sections]);

  // Loading screen
  if (status === "loading" && !hasLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-600 text-lg font-medium">
          Loading products, please wait...
        </p>
      </div>
    );
  }

  // Error screen
  if (status === "failed" && !hasLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-red-800 font-semibold text-lg mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl md:text-3xl font-bold capitalize text-gray-900">
              {category
                ? `${category} Collection`
                : section
                  ? `${section} Section`
                  : "Shop"}
            </h1>
            <p className="text-gray-600 mt-1 text-lg">
              {category
                ? `Explore our exclusive ${category} products`
                : section
                  ? `Browse all ${section} designs`
                  : "Discover all our latest products"}
            </p>
          </div>

        </div>
      </div>

      {/* Products */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!category && !section && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
        )}
        {status === "loading" && hasLoaded && (
          <div className="flex justify-center mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        <p className="text-gray-600 text-lg mb-4">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <Search size={80} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="bg-white h-[26rem] rounded-xl border border-dashed border-gray-600 overflow-hidden transition-all cursor-pointer group"
                >
                  <div className="relative h-[65%] p-1 overflow-hidden">
                    <img
                      src={product.img?.[0] || product.img}
                      alt={product.name}
                      className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex flex-col justify-between h-[36%] p-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1 h-10 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 my-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        className="relative bg-primary w-full hover:translate-y-[-2px] text-white font-bold text-lg px-4 py-2 rounded-xl font-mono border-black transition-all duration-200 flex items-center justify-center gap-4 shadow-md"
                      >
                        <ArrowRight className="w-5 h-5" />
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Curated Sections - Only show when no filters are active */}
      {!category && !section && (
        <div className="mt-12 mb-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Collections</h2>
            <div className="h-1 w-20 bg-primary mt-2"></div>
          </div>
          <DynamicSection />
        </div>
      )}
    </div>
  );
};

export default ShopPage;
