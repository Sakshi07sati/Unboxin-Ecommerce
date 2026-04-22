import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  selectCartItems,
  selectCartShipping,
  selectCartItemsCount,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  updateSize,
  clearBuyNowItem,
} from '../../global_redux/features/cart/cartSlice';

import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const shipping = useSelector(selectCartShipping);
  const itemsCount = useSelector(selectCartItemsCount);
  const navigate = useNavigate();

  const hasDisplaySize = (size) =>
    size !== null &&
    size !== undefined &&
    String(size).trim() !== "" &&
    String(size).toLowerCase() !== "null" &&
    String(size).toUpperCase() !== "OS";

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleIncrement = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Check stock before incrementing
    const currentStock = item.maxStock || Infinity;
    if (item.quantity >= currentStock) {
      toast.error(`Only ${currentStock} items available in size ${item.size}`);
      return;
    }

    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleSizeChange = (itemId, newSize) => {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    // Check if new size is available
    const newSizeInfo = item.sizes?.find(s => s.size === newSize);
    if (!newSizeInfo || newSizeInfo.stock <= 0) {
      toast.error(`Size ${newSize} is out of stock!`);
      return;
    }

    // If switching to a size with less stock, adjust quantity if needed
    if (item.quantity > newSizeInfo.stock) {
      toast.info(`Quantity adjusted to ${newSizeInfo.stock} for size ${newSize}`);
    }

    dispatch(updateSize({ id: itemId, size: newSize }));
    toast.success(`Size updated to ${newSize}`);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
          <div className="text-center max-w-md w-full">
            <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Add some awesome products to get started!</p>
            <div className="relative inline-block">

              <button
                onClick={() => navigate("/")}
                className="  bg-[#ff3f6c] hover:bg-[#e63a62]  text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-mono transition-transform duration-200 ease-in-out w-full sm:w-auto"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate totals with discounted prices
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.originalPrice || item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const handleProceedToCheckout = () => {
    // Clear any existing buyNowItem when proceeding from cart
    dispatch(clearBuyNowItem());
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="w-full lg:col-span-2">
              <div className="space-y-4 sm:space-y-6">
                {cartItems.map((item, index) => {
                  const currentSizeStock = item.maxStock || 0;
                  const isLowStock = currentSizeStock - item.quantity <= 3;
                  const imageSrc = Array.isArray(item.image) ? item.image[0] : item.image;
                  const showImage = Boolean(imageSrc);
                  const showSize = hasDisplaySize(item.size) && Array.isArray(item.sizes) && item.sizes.length > 0;

                  return (
                    <div
                      key={item.id || `cart-item-${index}`}
                      className="bg-white w-full rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-dashed border-gray-600 transition relative"
                    >
                      <div className="flex flex-col sm:flex-row h-full md:h-72 gap-3 sm:gap-4 p-3 sm:p-4">
                        {/* Product Image */}
                        {showImage && (
                          <div className="w-full sm:w-40 lg:w-56 h-48 sm:h-auto overflow-hidden">
                            <img
                              src={imageSrc}
                              alt={item.name || 'Product'}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                            />
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="flex flex-col justify-between flex-1">
                          <div className="mb-3 sm:mb-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                              {item.name || 'Product Name'}
                            </h3>

                            {/* Price Display */}
                            <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                ₹{item.originalPrice?.toFixed(0)}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 font-medium line-through">
                                ₹{item.price}
                              </span>
                              {item.originalPrice && item.price && item.originalPrice > item.price && (
                                <span className="text-xs sm:text-xs font-bold text-green-600 bg-gray-100 px-2 py-1 rounded">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                </span>
                              )}
                            </div>

                            {/* Size and Quantity */}
                            <div className="flex flex-row sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                              {/* Size Selector */}
                              {showSize && (
                                <div className="">
                                  <label className="text-xs text-gray-500 block mb-1 font-medium uppercase">Size</label>
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={item.size || 'M'}
                                      onChange={(e) => handleSizeChange(item.id, e.target.value)}
                                      className="border-2 border-gray-200 w-full sm:w-20 rounded-lg px-3 sm:px-4 py-2 text-sm font-semibold focus:outline-none focus:border-primary bg-white"
                                    >
                                      {item.sizes?.map((sizeInfo) => {
                                        const isOutOfStock = sizeInfo.stock <= 0;
                                        const isCurrentSize = sizeInfo.size === item.size;

                                        return (
                                          <option
                                            key={sizeInfo.size}
                                            value={sizeInfo.size}
                                            disabled={isOutOfStock && !isCurrentSize}
                                            className={isOutOfStock ? 'text-gray-400' : ''}
                                          >
                                            {sizeInfo.size} {isOutOfStock && !isCurrentSize ? '(Out)' : ''}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>

                                  {/* Stock Information */}
                                  <p className={`text-xs mt-1 ${isLowStock ? 'text-orange-600' : 'text-gray-500'}`}>
                                    {currentSizeStock - item.quantity} left in stock
                                  </p>
                                </div>
                              )}

                              {/* Quantity Selector */}
                              <div className="flex-1 min-w-[120px]">
                                <label className="text-xs text-gray-500 block mb-1 font-medium uppercase">Quantity</label>
                                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden max-w-[140px]">
                                  <button
                                    onClick={() => handleDecrement(item.id)}
                                    disabled={item.quantity <= 1}
                                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex-1"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 sm:px-4 py-2 border-x-2 border-gray-200 min-w-[2.5rem] sm:min-w-[3rem] text-center font-bold text-sm sm:text-base">
                                    {item.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => handleIncrement(item.id)}
                                    disabled={item.quantity >= currentSizeStock}
                                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex-1"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <div className="relative w-full sm:w-fit">
                            <div className=""></div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="relative bg-red-500 w-full  text-white font-bold text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg  font-mono  transition-transform duration-200 ease-in-out flex items-center justify-center sm:justify-start gap-2"
                            >
                              REMOVE
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary - Sticky on mobile */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 sticky top-4 sm:top-[7rem] border-2 border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Subtotal ({itemsCount} items)</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>

                  {shipping === 0 && subtotal >= 999 && (
                    <div className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium">
                      🎉 You saved on shipping!
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tax will be calculated at checkout
                  </p>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative w-full">
                    <button
                      onClick={handleProceedToCheckout}
                      className="relative bg-[#ff3f6c] hover:bg-[#e63a62] w-full text-white font-bold text-base sm:text-lg px-4 py-3 rounded-lg sm:rounded-xl  font-mono  transition-transform duration-200 ease-in-out flex items-center justify-center gap-2 sm:gap-4"
                    >
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
                      Proceed to Checkout
                    </button>
                  </div>

                  <div className="relative w-full">
                    <div className=""></div>
                    <button
                      onClick={() => navigate("/")}
                      className="relative bg-white w-full text-black font-bold text-base sm:text-lg px-4 py-3 rounded-lg sm:rounded-xl border-2 font-mono border-black transition-transform duration-200 ease-in-out flex items-center justify-center gap-2 sm:gap-4"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Benefits */}
                {/* <div className="mt-4 sm:mt-6 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-[#d4ff00] font-bold text-base sm:text-lg">✓</span>
                    <span>Free shipping on orders above ₹999</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-[#d4ff00] font-bold text-base sm:text-lg">✓</span>
                    <span>Easy 15 days return & exchange</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="text-[#d4ff00] font-bold text-base sm:text-lg">✓</span>
                    <span>100% secure payments</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;