import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../../global_redux/features/wishlist/wishlistSlice';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../global_redux/features/cart/cartSlice';
import { ArrowLeft, ShoppingCart, Star, Heart, ShieldCheck, RefreshCcw, Truck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
// import { useScrollToTop } from '../../components/common/ScrollToTop';
// import ReviewSection from './ReviewSection';
// import PaymentModal from '../../components/modal/PaymentModal';
// import ProductSpecification from './ProductSpecification';
// import ProductGallery from './ProductGallery';

const ProductDetails = () => {
//   useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const products = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist.items);
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product not found</h2>
          <button onClick={() => navigate('/')} className="text-[#e80071] underline font-medium">Back to Shop</button>
        </div>
      </div>
    );
  }

  // --- PRICING CALCULATIONS ---
  const isInCart = cartItems.some(item => item.product.id === product.id);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  
  const unitPrice = product.price;
  // Calculate original price based on discount
  const unitOriginalPrice = product.discountPercentage > 0 
    ? (unitPrice / (1 - product.discountPercentage / 100)) 
    : unitPrice;

  const currentPriceTotal = (unitPrice * quantity).toFixed(0);
  const originalPriceTotal = (unitOriginalPrice * quantity).toFixed(0);

  const handleToggleWishlist = (prod) => {
    dispatch(toggleWishlist(prod));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product }));
    toast.success(`${product.title} added to bag!`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-8">
        {/* Breadcrumb style navigation */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400 mb-8">
          <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
          <ChevronRight size={12} />
          <span className="cursor-pointer hover:text-black" onClick={() => navigate('/shop')}>Shop</span>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-bold truncate max-w-[150px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Column */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <ProductGallery product={product} onOpenChange={setIsGalleryOpen} />
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <header className="border-b border-gray-100 pb-5">
              <h2 className="text-xs font-bold tracking-[0.15em] text-[#e80071] uppercase mb-1">
                {product.brand || "Nykaa Exclusive"}
              </h2>
              <h1 className="text-2xl font-medium text-gray-900 leading-tight mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center bg-green-700 text-white px-2 py-[2px] rounded-sm text-xs font-bold">
                  {product.rating} <Star size={10} fill="white" className="ml-1" />
                </div>
                <span className="text-xs text-gray-400 font-medium border-l pl-3 border-gray-200 uppercase tracking-wider">
                  {product.reviews?.length || 0} Ratings
                </span>
              </div>
            </header>

            {/* Pricing Section */}
            <div className="space-y-1 py-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-gray-900">₹{currentPriceTotal}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-gray-400 line-through font-light">
                    MRP: ₹{originalPriceTotal}
                  </span>
                )}
                <span className="text-[#fc2779] text-sm font-bold">
                  {product.discountPercentage?.toFixed(0)}% OFF
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">inclusive of all taxes</p>
            </div>

            {/* Action Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-500">-</button>
                  <span className="px-4 py-2 text-sm font-bold min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-50 text-gray-500">+</button>
                </div>
                
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`flex-1 flex items-center justify-center gap-2 border py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${
                    isWishlisted ? 'border-[#e80071] text-[#e80071] bg-[#fff0f6]' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={16} color={isWishlisted ? "#e80071" : "#aaa"} fill={isWishlisted ? "#e80071" : "none"} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart || product.stock === 0}
                  className={`py-4 rounded-sm font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 ${
                    isInCart || product.stock === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-[#e80071] text-white hover:bg-[#c60061]'
                  }`}
                >
                  <ShoppingCart size={16} />
                  {isInCart ? 'Added to Bag' : 'Add to Bag'}
                </button>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={product.stock === 0}
                  className="py-4 rounded-sm font-bold uppercase tracking-widest text-[11px] border border-[#e80071] text-[#e80071] hover:bg-[#fff0f6] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Trust Info */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-50">
              <div className="text-center space-y-1">
                <Truck size={18} className="mx-auto text-gray-400" />
                <p className="text-[9px] font-bold text-gray-500 uppercase">Free Shipping</p>
              </div>
              <div className="text-center space-y-1 border-x border-gray-100">
                <RefreshCcw size={18} className="mx-auto text-gray-400" />
                <p className="text-[9px] font-bold text-gray-500 uppercase">Easy Returns</p>
              </div>
              <div className="text-center space-y-1">
                <ShieldCheck size={18} className="mx-auto text-gray-400" />
                <p className="text-[9px] font-bold text-gray-500 uppercase">100% Genuine</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Style Section */}
        <div className="mt-20 border-t border-gray-100 pt-12">
          <div className="max-w-4xl">
            <h3 className="text-xs font-bold text-[#e80071] mb-6 uppercase tracking-[0.2em] border-b-2 border-[#e80071] inline-block pb-1">
              Product Information
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description || "Information not available for this premium selection."}
            </p>
          </div>
          
          <div className="mt-12">
            <ProductSpecification product={product} />
          </div>
          
          <div className="mt-12 pb-20">
            <ReviewSection reviews={product.reviews || []} productRating={product.rating} />
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderDetails={{ total: currentPriceTotal }} // Simplified for display
      />
    </div>
  );
};

export default ProductDetails;