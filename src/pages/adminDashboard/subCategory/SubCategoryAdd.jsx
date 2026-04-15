import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addSubCategory 
} from "../../../global_redux/features/subCategory/subCategoryThunks";
import { 
  fetchCategories 
} from "../../../global_redux/features/category/categoryThunks";
import { 
  selectCategories,
  selectCategoryLoading
} from "../../../global_redux/features/category/categorySlice";
import { clearSubCategoryState } from "../../../global_redux/features/subCategory/subCategorySlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Upload, 
  X, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon
} from "lucide-react";

const SubCategoryAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoryLoading);
  const { loading, success, error } = useSelector((state) => state.subCategory);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    img: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Subcategory created successfully!");
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
    if (!formData.img) return toast.error("Image is required");

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("category", formData.category);
    data.append("img", formData.img);

    dispatch(addSubCategory(data));
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Subcategory</h1>
          <p className="text-gray-500 text-sm">Add a new subcategory to organize your products</p>
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
                Image
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
                      <p className="text-sm font-medium text-gray-900">Click to upload</p>
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
                      <p className="text-xs font-medium text-gray-400">Image preview</p>
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Subcategory</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-medium">Tip:</span> Subcategories must be assigned to a parent category. This helps organize your product hierarchy and improves navigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryAdd;