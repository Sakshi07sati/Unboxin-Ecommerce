import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategoryLoading,
  selectCategorySuccess,
  selectCategoryError,
  clearCategoryStatus,
} from "../../../global_redux/features/category/categorySlice";
import toast from "react-hot-toast";
import { AlertCircle, Loader2 } from "lucide-react";

const AddCategory = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const loading = useSelector(selectCategoryLoading);
  const success = useSelector(selectCategorySuccess);
  const error = useSelector(selectCategoryError);

  useEffect(() => {
    return () => {
      dispatch(clearCategoryStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Category added successfully!");
      setCategory("");
      dispatch(clearCategoryStatus());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.error("Category name is required");
      return;
    }
    dispatch(addCategory({ category: category.trim() }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8">
            <h1 className="text-2xl font-bold text-white mb-1">Add Category</h1>
            <p className="text-blue-100 text-sm">Create a new product category</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
                  Category Name
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Clothing"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <span>Add Category</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 text-center">
              Category names must be unique and descriptive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;