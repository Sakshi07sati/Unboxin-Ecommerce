import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchSubCategories, 
  deleteSubCategory 
} from "../../../global_redux/features/subCategory/subCategoryThunks";
import { 
  fetchCategories 
} from "../../../global_redux/features/category/categoryThunks";
import { 
  selectCategories 
} from "../../../global_redux/features/category/categorySlice";
import { Pencil, Trash2, Plus, Search, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SubCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subCategories, loading, error } = useSelector((state) => state.subCategory);
  const categories = useSelector(selectCategories);
  
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchSubCategories());
    dispatch(fetchCategories(token));
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      dispatch(deleteSubCategory(id))
        .unwrap()
        .then(() => toast.success("Subcategory deleted successfully"))
        .catch((err) => toast.error(err || "Failed to delete subcategory"));
    }
  };

  const getCategoryName = (categoryId) => {
  const id = typeof categoryId === "object" ? categoryId?._id : categoryId;

  const cat = categories.find(
    (c) => (c._id || c.id) === id
  );

  return cat ? (cat.category || cat.name) : "Unknown Category";
};
  

  const filteredSubCategories = subCategories.filter(sub => 
    sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(sub.category).toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading && subCategories.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">SubCategory Management</h2>
            <p className="text-slate-500 mt-1">Manage secondary product classifications</p>
          </div>
          <button
            onClick={() => navigate("/admin/subCategories/add")}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-200"
          >
            <Plus size={20} />
            Add SubCategory
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or parent category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-800 transition-all font-medium text-slate-700"
          />
        </div>

        {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Image</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((sub) => (
                
                  <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                        {sub.img ? (
                          <img 
                            src={sub.img} 
                            alt={sub.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{sub.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {getCategoryName(sub.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/subCategories/edit/${sub._id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
