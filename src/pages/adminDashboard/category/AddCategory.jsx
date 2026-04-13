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
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

const AddCategory = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      toast.error("Category is required");
      return;
    }
    dispatch(addCategory({ category }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        
        * {
          font-family: 'Geist', system-ui, -apple-system, sans-serif;
        }

        .input-field {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.12);
        }

        .submit-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .submit-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.25);
        }

        .submit-button:not(:disabled):active {
          transform: translateY(0);
        }

        .status-message {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .input-label {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field:focus ~ .input-label,
        .input-field:not(:placeholder-shown) ~ .input-label {
          transform: translateY(-24px);
          font-size: 0.75rem;
          color: rgb(59, 130, 246);
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-8">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent)]"></div>
            </div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-1">Add Category</h2>
              <p className="text-blue-100 text-sm">Create a new category for your items</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Status Messages */}
            {error && (
              <div className="status-message mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="status-message mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 text-sm font-medium">Category added successfully</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder=" "
                  className="input-field w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:ring-offset-0 bg-white text-slate-900 placeholder-transparent peer"
                />
                <label className="input-label absolute left-4 top-3.5 text-slate-500 text-sm font-medium pointer-events-none">
                  Category Name
                </label>
                {isFocused && (
                  <div className="absolute right-4 top-3.5">
                    <div className="text-blue-500 text-xs font-medium">Required</div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="submit-button w-full py-3 px-4 rounded-lg font-semibold text-white text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none bg-gradient-to-r from-blue-600 to-blue-700"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
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

              {/* Hint Text */}
              <p className="text-xs text-slate-500 text-center mt-4">
                Enter a unique name for your category
              </p>
            </form>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Categories help organize your content
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;