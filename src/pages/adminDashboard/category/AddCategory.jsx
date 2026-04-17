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
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    navigate("/admin/category")
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="w-full max-w-sm">

    <div className="bg-white rounded-xl shadow p-6">

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Add Category
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Create a new category
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded flex gap-2 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category name"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Adding...
            </>
          ) : (
            "Add Category"
          )}
        </button>

      </form>

    </div>

  </div>
</div>
  );
};

export default AddCategory;