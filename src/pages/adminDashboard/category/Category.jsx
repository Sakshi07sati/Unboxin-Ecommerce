import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, updateCategory, deleteCategory } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../../../global_redux/features/category/categorySlice";
import { Pencil, Trash2, X, Check } from "lucide-react"; // icons

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
    console.log(categories)
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id || cat.id);
    setEditValue(cat.category || cat.name);
  };

  const handleUpdate = (id) => {
    if (!editValue.trim()) return alert("Category cannot be empty");
    dispatch(updateCategory({ id, updatedData: { category: editValue } }));
    setEditId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  if (loading) return <p className="text-gray-600">Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2>

        {Array.isArray(categories) && categories.length > 0 ? (
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat._id || cat.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                {editId === (cat._id || cat.id) ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleUpdate(cat._id || cat.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-gray-800 font-medium">
                      <p>{cat.category || cat.name}</p>
                      
                    </div>
                    <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id || cat.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default Category;
