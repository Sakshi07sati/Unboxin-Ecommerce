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
   <div className="min-h-screen bg-gray-50 p-6">
  <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">

    {/* Top */}
    <div className="flex justify-between items-center mb-5">
      <button
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <button
        onClick={() => navigate(`/admin/products/edit/${id}`)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Edit size={16} /> Edit
      </button>
    </div>

    {/* Main Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* LEFT - Image */}
      <div className="flex flex-col items-center">

        {/* Main Image (SMALLER + FIXED) */}
        <div className="w-full max-w-[300px] h-[300px] border rounded-lg flex items-center justify-center bg-gray-50">
          <img
            src={product.img?.[activeImage] || "https://via.placeholder.com/300"}
            className="max-h-full object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          {product.img?.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(i)}
              className={`w-14 h-14 object-cover rounded border cursor-pointer ${
                activeImage === i ? "border-blue-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT - DETAILS */}
      <div className="flex flex-col gap-3">

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-800">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600 flex items-center">
            <IndianRupee size={18} /> {product.price}
          </span>

          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="text-sm text-gray-600">
          <p><b>Category:</b> {categoryName}</p>
          <p><b>SubCategory:</b> {subCategoryName}</p>
        </div>

        {/* Stock */}
        <div className="text-sm">
          <span className="font-medium">Stock: </span>
          <span className={product.quantity > 0 ? "text-green-600" : "text-red-500"}>
            {product.quantity > 0 ? `${product.quantity} available` : "Out of stock"}
          </span>
        </div>

      </div>
    </div>

    {/* Sizes */}
    {validSizes.length > 0 && (
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Sizes</h2>
        <div className="flex flex-wrap gap-2">
          {validSizes.map((s, i) => {
            const stock = s.stock || s.value;
            return (
              <div
                key={i}
                className={`px-3 py-1 rounded border text-sm ${
                  stock > 0 ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {s.size || s.key} ({stock > 0 ? stock : "0"})
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Description */}
    <div className="mt-6">
      <h2 className="font-semibold mb-1">Description</h2>
      <p className="text-sm text-gray-600">
        {product.productDescription || "No description"}
      </p>
    </div>

    {/* Details */}
    <div className="mt-4">
      <h2 className="font-semibold mb-1">Additional Details</h2>
      <p className="text-sm text-gray-600">
        {product.productDetails || "No details"}
      </p>
    </div>

  </div>
</div>
  );
};

export default ViewProduct;