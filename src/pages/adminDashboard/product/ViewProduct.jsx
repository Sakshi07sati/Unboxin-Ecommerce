import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductById } from "../../../global_redux/features/product/productThunks";
import { ArrowLeft, Edit, Tag, IndianRupee, Layers, Package, AlignLeft, Info, Eye, EyeOff } from "lucide-react";

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showOutOfStock, setShowOutOfStock] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await dispatch(fetchProductById(id));
        if (res.meta.requestStatus === "fulfilled") {
          setProduct(res.payload);
        } else {
          setError(res.payload || "Failed to load product");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadProduct();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-blue-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50/50 p-6">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center max-w-md w-full border border-red-100 shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <p className="text-xl font-bold mb-2 text-gray-900">Oops! Something went wrong.</p>
          <p className="text-md mb-8 text-gray-600">{error || "Product not found"}</p>
          <button 
            onClick={() => navigate("/admin/products")}
            className="flex w-full items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
          >
            <ArrowLeft size={18} /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Safely extract category and subCategory names
  const categoryName = product.category?.category || product.category?.name || (typeof product.category === 'string' ? product.category : "N/A");
  const subCategoryName = product.subCategory?.name || (typeof product.subCategory === 'string' ? product.subCategory : "N/A");

  // Format sizing and stock
  const sizes = [];
  try {
    if (product.sizes) {
      const parsedSizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
      if (Array.isArray(parsedSizes)) sizes.push(...parsedSizes);
    }
  } catch (e) {
    console.error("Failed to parse sizes", e);
  }

  // Filter sizes based on valid elements with a key/size
  const validSizes = sizes.filter(s => (s.size || s.key) && (s.stock !== undefined || s.value !== undefined));
  const inStockSizes = validSizes.filter(s => (s.stock > 0 || parseInt(s.value) > 0));
  const outOfStockSizes = validSizes.filter(s => (s.stock === 0 || parseInt(s.value) === 0));
  const displayedSizes = showOutOfStock ? validSizes : inStockSizes;

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group w-fit"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 group-hover:border-slate-300">
              <ArrowLeft size={18} />
            </div>
            Back to Products
          </button>
          
          <button 
            onClick={() => navigate(`/admin/products/edit/${id}`)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20 font-medium"
          >
            <Edit size={18} /> Edit Product
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Images */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden aspect-square">
              <img 
                src={product.img?.[activeImage] || "https://via.placeholder.com/600"} 
                alt={product.name} 
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            
            {product.img && product.img.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar p-1">
                {product.img.map((image, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      activeImage === idx 
                        ? 'border-blue-600 scale-100 opacity-100 shadow-md ring-4 ring-blue-50' 
                        : 'border-slate-100 scale-95 opacity-60 hover:opacity-100 hover:scale-100'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column: Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full mb-4 font-mono">
                  ID: {product._id}
                </span>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {product.name || "Unnamed Product"}
                </h1>
                
                <div className="flex flex-wrap items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-blue-600 flex items-center tracking-tight">
                    <IndianRupee size={32} className="mr-0.5" strokeWidth={2.5}/>
                    {product.price || 0}
                  </span>
                  
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-slate-400 line-through mb-1 flex items-center font-medium">
                        <IndianRupee size={18} />{product.originalPrice}
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-3 py-1 rounded-full mb-1 ml-2 border border-emerald-200">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-indigo-100 transition-colors">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                  <Layers size={24} />
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-400 font-bold mb-1">Category</p>
                  <p className="text-lg font-semibold text-slate-800 line-clamp-1">{categoryName}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:border-orange-100 transition-colors">
                <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
                  <Tag size={24} />
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-slate-400 font-bold mb-1">Subcategory</p>
                  <p className="text-lg font-semibold text-slate-800 line-clamp-1">{subCategoryName}</p>
                </div>
              </div>
            </div>
            
            {/* Stock Details */}
            {validSizes.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                      <Package size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Inventory Status</h2>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Stock</p>
                    <p className="text-2xl font-bold text-slate-900">{product.quantity || 0}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <p className="text-sm text-slate-500 font-medium">Size Variations:</p>
                    
                    {/* Toggle Button - Only show if there are out of stock sizes */}
                    {outOfStockSizes.length > 0 && (
                      <button
                        onClick={() => setShowOutOfStock(!showOutOfStock)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900 font-medium text-sm"
                      >
                        {showOutOfStock ? (
                          <>
                            <EyeOff size={16} />
                            Hide out of stock
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            Show out of stock ({outOfStockSizes.length})
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {displayedSizes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {displayedSizes.map((s, idx) => {
                        const sVal = s.stock !== undefined ? s.stock : (s.value || 0);
                        const sKey = s.size || s.key;
                        const hasStock = parseInt(sVal) > 0;
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                              hasStock 
                                ? 'bg-white border-slate-200 hover:border-blue-200 shadow-sm' 
                                : 'bg-red-50 border-red-100 opacity-80'
                            }`}
                          >
                            <span className="text-xl font-bold text-slate-800">{sKey}</span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg w-full text-center ${
                              hasStock 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {hasStock ? `${sVal} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-6 text-center border-2 border-dashed border-slate-200">
                      <p className="text-slate-500 font-medium">No valid sizes to display.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description & Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                    <AlignLeft size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Description</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {product.productDescription || <span className="italic text-slate-400">No description provided.</span>}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                    <Info size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Additional Details</h2>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {product.productDetails || <span className="italic text-slate-400">No additional details provided.</span>}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default ViewProduct;