import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  updateSubCategory,
  fetchSubCategories
} from "../../../global_redux/features/subCategory/subCategoryThunks";
import { 
  fetchCategories 
} from "../../../global_redux/features/category/categoryThunks";
import { 
  selectCategories,
  selectCategoryLoading
} from "../../../global_redux/features/category/categorySlice";
import { clearSubCategoryState } from "../../../global_redux/features/subCategory/subCategorySlice";
import toast from "react-hot-toast";
import { 
  Upload, 
  X, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon
} from "lucide-react";

const SubCategoryEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoryLoading);
  const { subCategories, loading, success, error } = useSelector((state) => state.subCategory);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    img: null,
  });
  const [preview, setPreview] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
    if (subCategories.length === 0) {
      dispatch(fetchSubCategories());
    }
  }, [dispatch, subCategories.length]);

  useEffect(() => {
    if (subCategories.length > 0 && initialLoading) {
      const sub = subCategories.find(s => s._id === id);
      if (sub) {
        setFormData({
          name: sub.name || "",
          category: typeof sub.category === 'object' ? sub.category?._id : sub.category,
          img: null,
        });
        setPreview(sub.img);
        setInitialLoading(false);
      } else {
        toast.error("Subcategory not found");
        navigate("/admin/subCategories");
      }
    }
  }, [subCategories, id, navigate, initialLoading]);

  useEffect(() => {
    if (success) {
      toast.success("Subcategory updated successfully!");
      dispatch(clearSubCategoryState());
      navigate("/admin/subCategories");
    }
    if (error) {
      toast.error(error);
      dispatch(clearSubCategoryState());
    }
  }, [success, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return toast.error("Please upload an image file");
      }
      setFormData((p) => ({ ...p, img: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return toast.error("Name is required");
    if (formData.name.trim().length < 3) return toast.error("Name must be at least 3 characters long");
    if (!formData.category) return toast.error("Parent category is required");
    // Image is optional on edit - only required if no preview exists
    if (!preview) return toast.error("Image is required");

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("category", formData.category);
    // Only append image if a new file was selected
    if (formData.img instanceof File) {
      data.append("img", formData.img);
    }

    dispatch(updateSubCategory({ id, formData: data }));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/admin/subCategories")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Subcategory</h1>
          <p className="text-gray-500 text-sm">Update subcategory details and classification</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Subcategory Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Subcategory Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Cleansers, Sneakers"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
                required
              />
            </div>

            {/* Parent Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                Parent Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.category || cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Image <span className="text-gray-400 text-xs font-normal">(Optional - leave empty to keep current image)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Upload Area */}
                <label 
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                  />
                  <div className="space-y-2">
                    <Upload size={28} className="text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.img ? 'Change image' : 'Click to upload new image'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, or WebP</p>
                    </div>
                  </div>
                </label>

                {/* Preview Area */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative aspect-square flex items-center justify-center">
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => { 
                          setPreview(null); 
                          setFormData(p => ({...p, img: null})); 
                        }}
                        className="absolute top-2 right-2 bg-white rounded-md p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={40} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-medium text-gray-400">No image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/subCategories")}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition active:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Subcategory</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryEdit;