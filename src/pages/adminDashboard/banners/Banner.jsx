import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../../global_redux/features/banner/bannerThunks";
import { clearBannerState } from "../../../global_redux/features/banner/bannerSlice";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";

/**
 * BannerManagement Component
 * Defensive and simplified administrative interface for managing carousel banners.
 */
const BannerManagement = () => {
  const dispatch = useDispatch();
  
  // Defensive selector to prevent crash if 'banner' state is missing
  const bannerState = useSelector((s) => s.banner) || {
    banners: [],
    loading: false,
    error: null,
    success: false,
  };
  
  const { banners, loading, error, success } = bannerState;
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    img: null,
  });
  const [preview, setPreview] = useState(null);

  // Fetch banners on mount with error handling
  useEffect(() => {
    const loadBanners = async () => {
      try {
        await dispatch(fetchBanners()).unwrap();
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    loadBanners();
  }, [dispatch]);

  // Handle Redux state changes (success/error)
  useEffect(() => {
    if (success) {
      toast.success(modalMode === "add" ? "Banner added successfully" : "Banner updated successfully");
      closeModal();
      dispatch(clearBannerState());
      dispatch(fetchBanners()); // Refresh list
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : "An error occurred");
      dispatch(clearBannerState());
    }
  }, [success, error, dispatch, modalMode]);

  // Modal Handlers
  const openAddModal = () => {
    setModalMode("add");
    setFormData({ productId: "", img: null });
    setPreview(null);
    setCurrentBanner(null);
    setShowModal(true);
  };

   const openEditModal = (banner) => {
  if (!banner) return;

  setModalMode("edit");
  setCurrentBanner(banner);

  setFormData({
    productId: banner.productId?._id || banner.productId || "",
    img: null,
  });

  setPreview(banner.img);
  setShowModal(true);
};

  const closeModal = () => {
    setShowModal(false);
    // Cleanup local state
    setFormData({ productId: "", img: null });
    setPreview(null);
    setCurrentBanner(null);
  };

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        return toast.error("Please select a valid image file");
      }
      setFormData((p) => ({ ...p, img: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const productId = formData.productId ? formData.productId.trim() : "";
    data.append("productId", productId);
    
    if (formData.img) {
      data.append("img", formData.img);
    }

    try {
      if (modalMode === "add") {
        if (!formData.img) return toast.error("Please upload an image");
        await dispatch(addBanner(data)).unwrap();
      } else {
        if (!currentBanner?._id) return toast.error("Invalid banner identification");
        await dispatch(updateBanner({ id: currentBanner._id, formData: data })).unwrap();
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleDelete = (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this banner?")) {
      dispatch(deleteBanner(id))
        .unwrap()
        .then(() => toast.success("Banner deleted"))
        .catch((err) => toast.error(typeof err === 'string' ? err : "Failed to delete"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Banner Management</h1>
            <p className="text-sm text-gray-500 mt-1">Configure homepage carousel and promotional graphics</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm font-semibold active:scale-95"
          >
            <Plus size={18} />
            Create Banner
          </button>
        </div>

        {/* Global Loading Spinner for Initial Load */}
        {loading && (!banners || banners.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
             <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
             <p className="text-sm font-medium text-slate-500">Retrieving banner data...</p>
          </div>
        )}

        {/* Grid List */}
        {!loading && (!banners || banners.length === 0) ? (
          <div className="bg-white border-2 border-dashed border-gray-200 text-center py-20 rounded-2xl">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <ImageIcon className="text-gray-300" size={32} />
            </div>
            <h3 className="text-gray-900 font-bold">No Active Banners</h3>
            <p className="text-gray-500 text-sm mt-1">Add banners to highlight your best products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(banners) && banners.map((b) => (
              <div key={b._id || Math.random()} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                <div className="aspect-[16/9] relative bg-gray-50 overflow-hidden">
                  <img
                    src={b.img}
                    alt="banner"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x225?text=Image+Load+Error"; }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button
                      onClick={() => openEditModal(b)}
                      className="bg-white/90 p-3 rounded-full hover:bg-white text-slate-800 transition-all hover:scale-110"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-white/90 p-3 rounded-full hover:bg-red-600 hover:text-white text-red-600 transition-all hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Asset</p>
                  </div>
                  {/* <h4 className="text-sm font-bold text-slate-800 truncate">
                    Product: {b.productId || "Universal Carousel"}
                  </h4> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Styled Modal */}
      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {modalMode === "add" ? "Create New Banner" : "Edit Digital Asset"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Configure your storefront visuals.</p>
              </div>
              <button 
                onClick={closeModal} 
                className="bg-gray-50 p-2 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Product ID */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Product Reference</label>
                <div className="relative">
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="Enter ID (e.g. PRD-882)"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 outline-none transition-all font-medium text-slate-700"
                    required={modalMode === "add"}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Visual Component</label>
                <div className="flex flex-col gap-4">
                   {preview ? (
                    <div className="relative group rounded-3xl overflow-hidden aspect-[15/7] border-2 border-slate-50 shadow-inner">
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label htmlFor="img-upload" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm cursor-pointer hover:scale-105 transition-transform">
                          Change Image
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label 
                      htmlFor="img-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-10 bg-slate-50/50 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all group"
                    >
                      <Upload size={32} className="text-slate-300 group-hover:text-slate-600 mb-2 transition-colors" />
                      <span className="text-sm font-bold text-slate-800">Choose visual asset</span>
                      <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">JPG, PNG, WebP recommended</span>
                    </label>
                  )}
                  <input
                    id="img-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border-2 border-slate-100 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-black disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    modalMode === "add" ? "Deploy Banner" : "Update Asset"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </AnimatePresence>
      
      {/* Fallback for AnimatePresence if framer-motion is not fully loaded */}
      {!window.framerMotionLoaded && <div id="framer-motion-polyfill" />}
    </div>
  );
};

// Dummy component to avoid crash if some versions of framer-motion differ
const AnimatePresence = ({ children }) => <>{children}</>;

export default BannerManagement;