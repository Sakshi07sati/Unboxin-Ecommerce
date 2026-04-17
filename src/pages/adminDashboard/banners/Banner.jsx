import React, { useEffect, useState, useMemo } from "react";
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
  RefreshCw,
  Download,
  Search,
} from "lucide-react";

/**
 * BannerManagement Component
 * Standardized Simple UI for managing carousel banners.
 */
const BannerManagement = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  
  const bannerState = useSelector((s) => s.banner) || {
    banners: [],
    loading: false,
    error: null,
    success: false,
  };
  
  const { banners, loading, error, success } = bannerState;
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    img: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(modalMode === "add" ? "Banner added" : "Banner updated");
      closeModal();
      dispatch(clearBannerState());
      dispatch(fetchBanners());
    }
    if (error) {
      toast.error(typeof error === 'string' ? error : "An error occurred");
      dispatch(clearBannerState());
    }
  }, [success, error, dispatch, modalMode]);

  const filteredBanners = useMemo(() => {
    if (!Array.isArray(banners)) return [];
    return banners.filter(b => 
      (b.productId?._id || b.productId || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [banners, searchTerm]);

  const handleRefresh = () => {
    dispatch(fetchBanners());
    toast.success("Data refreshed");
  };

  const handleExport = () => {
    toast.success("Exporting banner list...");
    // Logic for export can be added here
  };

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
    setFormData({ productId: "", img: null });
    setPreview(null);
    setCurrentBanner(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    data.append("productId", formData.productId.trim());
    if (formData.img) data.append("img", formData.img);

    if (modalMode === "add") {
      if (!formData.img) return toast.error("Please upload an image");
      dispatch(addBanner(data));
    } else {
      dispatch(updateBanner({ id: currentBanner._id, formData: data }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this banner?")) {
      dispatch(deleteBanner(id));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Banner Management</h1>
            <p className="text-gray-500 text-sm mt-1">Configure homepage carousel and promotional graphics</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleRefresh}
              className="p-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-sm text-sm font-bold"
            >
              <Download size={16} /> Export
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm font-bold text-sm"
            >
              <Plus size={18} /> Add Banner
            </button>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by Product ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading && (!banners || banners.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Loading banners...</p>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 text-center py-20 rounded-xl">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="text-gray-300" size={32} />
            </div>
            <h3 className="text-gray-900 font-bold">No Banners Found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or add a new banner.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBanners.map((b) => (
              <div key={b._id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group shadow-sm">
                <div className="aspect-[16/9] relative bg-gray-50 overflow-hidden border-b border-gray-100">
                  <img
                    src={b.img}
                    alt="banner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x225?text=Error"; }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="bg-white/90 p-2 rounded-lg hover:bg-white text-gray-700 shadow-sm border border-gray-100 transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="bg-white/90 p-2 rounded-lg hover:bg-red-50 text-red-600 shadow-sm border border-gray-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Product</p>
                      <p className="text-sm font-bold text-gray-900 ">
                        {b.productId?._id || b.productId || "Storewide Banner"}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-700 font-bold text-[10px] rounded-full border border-green-100">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {modalMode === "add" ? "Create New Banner" : "Edit Banner"}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Linked Product ID</label>
                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="Enter Product ID Reference"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Banner Image</label>
                  <div className="flex flex-col gap-4">
                    {preview ? (
                      <div className="relative group rounded-lg overflow-hidden aspect-[16/7] border border-gray-100">
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <label htmlFor="img-upload" className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <span className="bg-white text-gray-900 px-4 py-1.5 rounded-lg font-bold text-xs">Change Image</span>
                        </label>
                      </div>
                    ) : (
                      <label 
                        htmlFor="img-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-10 bg-gray-50 cursor-pointer hover:bg-white hover:border-gray-300 transition-all group"
                      >
                        <Upload size={32} className="text-gray-300 group-hover:text-blue-500 mb-2 transition-colors" />
                        <span className="text-sm font-bold text-gray-700">Click to upload banner</span>
                        <span className="text-[10px] text-gray-400 mt-1 uppercase">Best ratio 16:9</span>
                      </label>
                    )}
                    <input id="img-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (modalMode === "add" ? "Save Banner" : "Update Banner")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
