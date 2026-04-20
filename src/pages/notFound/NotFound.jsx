import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-block mb-8">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[#ff3f6c]"
              >
                <Ghost size={120} strokeWidth={1.5} />
              </motion.div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-200 rounded-[100%] blur-md" />
            </div>

            <h1 className="text-9xl font-black text-gray-200 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -z-10 select-none">
              404
            </h1>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lost in Space?
            </h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#ff3f6c] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e63a62] transition-all active:scale-95 shadow-lg shadow-pink-100"
              >
                <Home size={18} />
                Back to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:border-gray-900 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Original</div>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="text-lg font-bold text-gray-900">Secure</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Checkout</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">Easy</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Returns</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
