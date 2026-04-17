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
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  Image as ImageIcon,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText 
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { exportSubCategories } from "@/utils/exportUtils";

const SubCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subCategories, loading, error } = useSelector((state) => state.subCategory);
  const categories = useSelector(selectCategories);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

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

  // loading handled inline now to avoid jumpy UI

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">SubCategory Management</h2>
              <p className="text-gray-600 text-sm mt-1">Refine your product taxonomy with distinct sub-classifications</p>
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
                          exportSubCategories(filteredSubCategories, categories, 'csv');
                          toast.success('CSV Exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 text-left"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        Download CSV
                      </button>
                      <button
                        onClick={() => {
                          exportSubCategories(filteredSubCategories, categories, 'csv');
                          toast.success('Excel-ready file exported!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 text-left"
                      >
                        <FileSpreadsheet size={16} className="text-blue-600" />
                        Download Excel
                      </button>
                      <button
                        onClick={() => {
                          exportSubCategories(filteredSubCategories, categories, 'pdf');
                          toast.success('PDF Report generated!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium text-left"
                      >
                        <FileText size={16} className="text-red-500" />
                        Download PDF
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => navigate("/admin/subCategories/add")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
              >
                <Plus size={20} />
                Add New SubCategory
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search subcategories or parents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Total:</span>
              <span className="text-sm font-bold text-gray-800">{filteredSubCategories.length}</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && subCategories.length === 0 && (
          <div className="bg-white p-8 rounded-b-lg shadow-sm border border-gray-100 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Loading subcategories...</p>
          </div>
        )}

        {/* content */}
        {!error && (subCategories.length > 0 || !loading) && (
          <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent Category</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                          {sub.img ? (
                            <img src={sub.img} alt={sub.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 capitalize leading-tight">{sub.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">
                          {getCategoryName(sub.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/subCategories/edit/${sub._id}`)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(sub._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic">
                      No subcategories found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategory;
