import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, updateCategory, deleteCategory } from "../../../global_redux/features/category/categoryThunks";
import {
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../../../global_redux/features/category/categorySlice";
import { 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  Plus,
  Search,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText 
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { exportCategories } from "@/utils/exportUtils";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories(token));
  }, [dispatch, token]);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchTerm.trim()) return categories;
    return categories.filter(cat => 
      (cat.category || cat.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

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
   <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-5xl mx-auto">

    {/* Header Section */}
    <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
          <p className="text-gray-600 text-sm mt-1">Manage and organize your product catalog taxonomy</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm font-medium"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {exportDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setExportDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      exportCategories(filteredCategories, 'csv');
                      toast.success('CSV Exported successfully!');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50"
                  >
                    <FileSpreadsheet size={16} className="text-green-600" />
                    Download CSV
                  </button>
                  <button
                    onClick={() => {
                      exportCategories(filteredCategories, 'csv');
                      toast.success('Excel Exported successfully!');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50"
                  >
                    <FileSpreadsheet size={16} className="text-blue-600" />
                    Download Excel
                  </button>
                  <button
                    onClick={() => {
                      exportCategories(filteredCategories, 'pdf');
                      toast.success('PDF Generated successfully!');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <FileText size={16} className="text-red-500" />
                    Download PDF
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate("/admin/categories/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
          >
            <Plus size={20} />
            Add New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Total:</span>
          <span className="text-sm font-bold text-gray-800">{filteredCategories.length}</span>
        </div>
      </div>
    </div>

    {/* Loading */}
    {loading && categories.length === 0 && (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center gap-3 mb-4">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600">Loading categories...</p>
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-600 flex items-center gap-2 text-sm">
        <AlertCircle size={18} />
        {error}
      </div>
    )}

    {/* Table */}
    {!error && (categories.length > 0 || !loading) && (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((cat) => (
              <tr
                key={cat._id || cat.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {editId === (cat._id || cat.id) ? (
                  <td colSpan="2" className="px-6 py-4 bg-blue-50/50">
                    <div className="flex gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        autoFocus
                      />

                      <button
                        onClick={() => handleUpdate(cat._id || cat.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-xs flex items-center gap-1"
                      >
                        <Check size={14} />
                        Save
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800">{cat.category || cat.name}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(cat._id || cat.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
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

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No categories found matching your search</p>
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
};

export default Category;