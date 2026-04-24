import React from "react";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ProductCard from "../../components/Products/ProductCard";

const Wishlist = () => {
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Wishlist
            </h1>
            <p className="text-sm font-medium text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-4 text-center">
              <Heart className="mb-4 h-12 w-12 text-gray-300" />
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Save products by clicking the heart icon.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-700"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((product, index) => (
                <ProductCard
                  key={product?._id || product?.id || `wishlist-item-${index}`}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
