// src/pages/Checkout/OrderSummary.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronDown, ChevronUp, Tag, X, Loader2, Package, Zap } from "lucide-react";

const OrderSummary = ({
  cartItems,
  subtotal,
  discount,
  finalAmount,
  appliedPromo,
  promoCode,
  promoError,
  promoSuccess,
  onApplyPromo,
  onRemovePromo,
  onPromoCodeChange,
  showProducts,
  setShowProducts,
  isBuyNow = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      {/* Header with Buy Now indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isBuyNow ? (
            <div className="bg-orange-100 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          ) : (
            <div className="bg-purple-100 p-2 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBuyNow ? "Quick Purchase" : "Order Summary"}
            </h2>
            <p className="text-sm text-gray-500">
              {isBuyNow ? "Single item checkout" : `${cartItems.length} items in cart`}
            </p>
          </div>
        </div>
        
        {isBuyNow && (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            Quick Buy
          </span>
        )}
      </div>

      {/* Expandable Product List - Enhanced for Buy Now */}
      <div
        onClick={() => setShowProducts(!showProducts)}
        className="bg-gray-50 rounded-xl p-4 mb-4 cursor-pointer hover:bg-gray-100 transition border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isBuyNow ? (
              <Package className="w-5 h-5 text-orange-600" />
            ) : (
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            )}
            <div>
              <h3 className="font-bold text-gray-900">
                {isBuyNow ? "Product Details" : "Items in Cart"}
              </h3>
              <p className="text-sm text-gray-500">
                {isBuyNow ? "1 item" : `${cartItems.length} items`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-gray-900">₹{subtotal.toFixed(0)}</span>
              {discount > 0 && (
                <span className="block text-xs text-green-600">
                  -₹{discount.toFixed(0)} discount
                </span>
              )}
            </div>
            {showProducts ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProducts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mb-4"
          >
            {cartItems.map((item, index) => {
              // For customized items, use price directly (already includes base + customization)
              // For regular items, use originalPrice or price
              const itemPrice = item.isCustomized 
                ? item.price  // Customized: price already includes base + customization cost
                : (item.originalPrice || item.price); // Regular: use originalPrice if available, else price
              
              const discountPercent = item.discount || 0;
              const discountedPrice = itemPrice - (itemPrice * discountPercent) / 100;
              const quantity = item.quantity || 1;
              
              // Use inline SVG placeholder instead of external URL
              const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
              
              return (
                <div 
                  key={item.id || `item-${index}`} 
                  className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={item.image?.[0] || item.image || placeholderSvg}
                    alt={item.name}
                    onError={(e) => {
                      // Prevent infinite loop - only set once if not already set
                      if (!e.target.src.includes('data:image/svg+xml')) {
                        e.target.src = placeholderSvg;
                      }
                      // Stop trying to load if it fails
                      e.target.onerror = null;
                    }}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h4>
                    {item.isCustomized && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                        Customized
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-sm text-gray-900">
                        ₹{(discountedPrice * quantity).toFixed(0)}
                      </span>
                      {item.size && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Size: {item.size}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">Qty: {quantity}</span>
                      </div>
                      {/* {discountPercent > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(originalPrice * quantity).toFixed(0)}
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )} */}
                    </div>
                    {/* {isBuyNow && item.maxStock && (
                      <p className="text-xs text-gray-500 mt-1">
                        Only {item.maxStock} left in stock
                      </p>
                    )} */}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Code Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-gray-900">Promo Code</h3>
          {/* {isBuyNow && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Applicable
            </span>
          )} */}
        </div>

        {appliedPromo ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 text-white p-1.5 rounded">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm text-green-700">{appliedPromo.code}</p>
                  <p className="text-xs text-green-600">Discount: ₹{discount.toFixed(0)}</p>
                </div>
              </div>
              <button
                onClick={onRemovePromo}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
            {appliedPromo.productName && (
              <p className="text-xs text-gray-600 mt-1">
                Applied to: <span className="font-medium">{appliedPromo.productName}</span>
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-3  py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && onApplyPromo()}
              />
              <button
                onClick={onApplyPromo}
                disabled={status === "loading"}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2 min-w-20 justify-center"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            {promoError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 mt-2 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> {promoError}
              </motion.p>
            )}

            {promoSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  ✓ {typeof promoSuccess === "string" ? promoSuccess : promoSuccess.message}
                </p>
                {typeof promoSuccess === "object" && promoSuccess.productName && (
                  <p className="text-xs text-gray-600">
                    Applied to: <span className="font-medium">{promoSuccess.productName}</span>
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-bold text-gray-900 text-sm mb-2">Price Breakdown</h4>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600">Promo Discount</span>
            <span className="font-medium text-green-600">- ₹{discount.toFixed(0)}</span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">₹{finalAmount.toFixed(0)}</span>
              {discount > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  You save ₹{discount.toFixed(0)}
                </p>
              )}
            </div>
          </div>
          {/* {isBuyNow && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              🚚 Free shipping available
            </p>
          )} */}
        </div>
      </div>

      {/* Quick Buy Benefits */}
      {/* {isBuyNow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-bold text-orange-800">Quick Buy Benefits</h4>
          </div>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Faster checkout process</li>
            <li>• Priority shipping</li>
            <li>• Instant order confirmation</li>
          </ul>
        </motion.div>
      )} */}
    </motion.div>
  );
};

export default OrderSummary;