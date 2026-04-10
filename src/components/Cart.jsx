import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, X, ShieldCheck, Tag, ChevronLeft, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useScrollToTop } from './common/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

const Cart = () => {
  useScrollToTop();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const totalMRP = cart.items.reduce((acc, item) => acc + (item.product.price * 1.25 * item.quantity), 0);
  const shippingFee = cart.total > 500 || cart.total === 0 ? 0 : 50;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 pb-40">
        <ShoppingBag size={60} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-[#4A2C1D]">Your bag is empty!</h2>
        <button onClick={() => navigate('/shop')} className="mt-4 text-[#8B6F47] font-bold uppercase text-xs border-b border-[#8B6F47]">Shop Now</button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 sm:bg-white pb-30 sm:pb-20">


        <div className="sm:hidden fixed top-0 left-0 right-0 bg-white z-[110] border-b border-gray-100 shadow-sm h-16">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1 -ml-2">
                <ChevronLeft size={24} className="text-[#4A2C1D]" />
              </button>
              <div className="flex flex-col">
                <h1 className="text-[13px] font-extrabold text-[#4A2C1D] uppercase tracking-tight">Shopping Bag</h1>
                <p className="text-[10px] text-gray-400 font-bold">{cart.items.length} ITEMS</p>
              </div>
            </div>
            <button
              onClick={() => { dispatch(clearCart()); toast.success('Bag cleared'); }}
              className="text-[10px] font-bold text-red-500 uppercase tracking-tighter border border-red-50 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-0 sm:px-4">


          <div className="hidden sm:block pt-16">
            <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#8B6F47] mb-10">
              <ArrowLeft size={14} /> Back to Shop
            </button>
            <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-4">
              <h1 className="text-lg font-bold uppercase tracking-widest text-[#4A2C1D]">Shopping Bag</h1>
              <button onClick={() => dispatch(clearCart())} className="text-[10px] text-red-500 uppercase flex items-center gap-1 border border-red-100 px-3 py-1">
                <Trash2 size={12} /> Clear Bag
              </button>
            </div>
          </div>


          <div className="flex flex-col lg:flex-row gap-4 pt-[40px] sm:pt-0 p-3 sm:p-0">

            {/* LEFT: Items List */}
            <div className="lg:w-[65%] space-y-3">
              {/* Delivery Address Card (Mobile Refined Spacing) */}
              {/* <div className="bg-white p-3 border border-gray-100 rounded-sm flex justify-between items-center shadow-sm sm:shadow-none sm:bg-gray-50/50">
                <p className="text-[11px] text-gray-500 uppercase font-medium">Deliver to: <span className="font-bold text-gray-800">Select Address</span></p>
                <button className="text-[#8B6F47] text-[10px] font-bold uppercase border border-[#8B6F47] px-4 py-1.5 rounded-sm">Add</button>
              </div> */}

              {cart.items.map((item) => (
                <div key={item.product.id} className="relative flex bg-white border border-gray-100 rounded-sm p-3 shadow-sm sm:shadow-none">
                  {/* Product Image */}
                  <img src={item.product.thumbnail} alt="" className="w-20 h-28 sm:w-32 sm:h-40 object-cover rounded-sm bg-gray-50" />

                  {/* Product Details */}
                  <div className="flex-1 ml-4 flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[#4A2C1D] text-xs sm:text-lg uppercase leading-tight">{item.product.brand}</h3>
                        <p className="text-[11px] sm:text-sm text-gray-500 line-clamp-2">{item.product.title}</p>
                      </div>
                      <button onClick={() => dispatch(removeFromCart(item.product.id))} className="p-1">
                        <X size={18} className="text-gray-300" />
                      </button>
                    </div>

                    {/* Compact Qty Selector */}
                    <div className="flex items-center bg-gray-50 self-start rounded border border-gray-200 px-1 py-0.5 mt-1">
                      <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)} className="p-1"><Minus size={12} /></button>
                      <span className="text-[11px] font-bold px-3 border-x border-gray-200">Qty: {item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)} className="p-1"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      {/* Current Sale Price Total */}
                      <span className="text-sm sm:text-base font-bold text-[#4A2C1D]">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Original Price Total (Price * 1.25 for that 25% markup) */}
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        ₹{(item.product.price * 1.25 * item.quantity).toFixed(2)}
                      </span>

                      <span className="text-[10px] sm:text-xs text-orange-500 font-bold">
                        (25% OFF)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            <div className="lg:w-[35%]">
              <div className="sticky top-20 bg-white p-4 sm:p-6 border border-gray-100 rounded-sm">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Price Details ({cart.items.length} Items)</h3>
                <div className="space-y-3 text-[12px] sm:text-sm text-gray-600 border-b border-dashed pb-4">
                  <div className="flex justify-between"><span>Total MRP</span><span>₹{totalMRP.toFixed(0)}</span></div>
                  <div className="flex justify-between text-green-600 font-medium"><span>Discount on MRP</span><span>-₹{(totalMRP - cart.total).toFixed(0)}</span></div>
                  <div className="flex justify-between"><span>Shipping Fee</span><span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span></div>
                </div>
                <div className="flex justify-between items-center pt-4 font-bold text-[#4A2C1D]">
                  <span>Total Amount</span>
                  <span>₹{(cart.total + shippingFee).toFixed(0)}</span>
                </div>

                <button onClick={() => navigate('/checkout')} className="hidden sm:block w-full mt-2 bg-[#8B6F47] text-white py-4 font-bold uppercase tracking-widest text-xs">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex items-center justify-between z-[110] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col pl-2">
          <span className="text-sm font-extrabold text-[#4A2C1D]">₹{(cart.total + shippingFee).toFixed(0)}</span>
          <button className="text-[10px] text-[#8B6F47] font-bold uppercase underline decoration-1 underline-offset-2">View Details</button>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-[#8B6F47] text-white px-10 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-transform shadow-md"
        >
          Place Order
        </button>
      </div>

      <div className="hidden sm:block"><Footer /></div>
    </>
  );
};

export default Cart;