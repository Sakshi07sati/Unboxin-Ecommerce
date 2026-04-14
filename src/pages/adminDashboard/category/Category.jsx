import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, updateCategory, deleteCategory } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../../../global_redux/features/category/categorySlice";
import { Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const Category = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    dispatch(fetchCategories(token));
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
      toast.success("Category deleted successfully");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id || cat.id);
    setEditValue(cat.category || cat.name);
  };

  const handleUpdate = (id) => {
    if (!editValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    dispatch(updateCategory({ id, updatedData: { category: editValue } }));
    setEditId(null);
    setEditValue("");
    toast.success("Category updated successfully");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product categories</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="w-5 h-5 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin"></div>
            <p className="text-blue-900 text-sm font-medium">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-900 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Categories List */}
        {!loading && !error && (
          <>
            {Array.isArray(categories) && categories.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category Name</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {categories.map((cat) => (
                        <tr 
                          key={cat._id || cat.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {editId === (cat._id || cat.id) ? (
                            <td colSpan="2" className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  autoFocus
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleUpdate(cat._id || cat.id);
                                    if (e.key === "Escape") handleCancelEdit();
                                  }}
                                />
                                <button
                                  onClick={() => handleUpdate(cat._id || cat.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                  title="Save"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </td>
                          ) : (
                            <>
                              <td className="px-6 py-4">
                                <p className="text-gray-900 font-medium">{cat.category || cat.name}</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleEdit(cat)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Edit category"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(cat._id || cat.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Delete category"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm font-medium">No categories found</p>
                <p className="text-gray-400 text-xs mt-1">Create your first category to get started</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Category;