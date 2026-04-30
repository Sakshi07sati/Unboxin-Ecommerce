import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../../global_redux/features/product/productThunks";
import { fetchSubCategories } from "../../../global_redux/features/subCategory/subCategoryThunks";
import { fetchCategories } from "../../../global_redux/features/category/categoryThunks";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Search, 
  X, 
  AlertTriangle, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import { exportProducts } from "@/utils/exportUtils";
// import { usePermissions } from "@/hooks/usePermissions";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error, totalPages, totalProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);
  const { subCategories } = useSelector((state) => state.subCategory);
  
  const canAdd = true;
  const canEdit = true;
  const canDelete = true;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage, itemsPerPage]); // Run when page or limit changes

  useEffect(() => {
    if (products) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      const filtered = products.filter(product => {
        // Search Match
        const nameMatch = !searchLower || (product.name?.toLowerCase().includes(searchLower) || product._id?.toLowerCase().includes(searchLower));
        
        // Category Match
        const categoryId = typeof product.category === 'object' ? product.category?._id : product.category;
        const categoryMatch = !selectedCategory || categoryId === selectedCategory;
        
        // SubCategory Match
        const subCategoryId = typeof product.subCategory === 'object' ? product.subCategory?._id : product.subCategory;
        const subCategoryMatch = !selectedSubCategory || subCategoryId === selectedSubCategory;
        
        return nameMatch && categoryMatch && subCategoryMatch;
      });
      
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
    setCurrentPage(1); // Reset to first page when search/filter changes
  }, [searchTerm, products, selectedCategory, selectedSubCategory]);

  // Pagination logic
  // Since we use server-side pagination, paginatedProducts is just the filtered list
  const paginatedProducts = filteredProducts;

  // const totalPagesCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
  };

  const handleDelete = async () => {
    const { productId } = deleteModal;
    closeDeleteModal();

    const loadingToast = toast.loading("Deleting product...");

    try {
      const res = await dispatch(deleteProduct(productId));

      toast.dismiss(loadingToast);

      if (res.type.endsWith("fulfilled")) {
        toast.success("Product deleted successfully!", {
          duration: 3000,
          icon: "✅",
        });
        dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage })); // Refetch current page
      } else {
        toast.error(res.payload || "Failed to delete product", {
          duration: 4000,
          icon: "❌",
        });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred while deleting", {
        duration: 4000,
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/admin/products/view/${id}`);
  };



  const handleAdd = () => {
    navigate("/admin/products/add");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
              <p className="text-gray-600 text-sm mt-1">Manage your product inventory with advanced filters</p>
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
                          exportProducts(filteredProducts, 'csv');
                          toast.success('CSV Exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileSpreadsheet size={16} className="text-green-600" />
                        Download CSV
                      </button>
                      <button
                        onClick={() => {
                          exportProducts(filteredProducts, 'csv'); // Standard CSV is Excel-ready (with BOM)
                          toast.success('Excel-ready CSV exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileSpreadsheet size={16} className="text-blue-600" />
                        Download Excel
                      </button>
                      <button
                        onClick={() => {
                          exportProducts(filteredProducts, 'pdf');
                          toast.success('PDF Report generated successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FileText size={16} className="text-red-500" />
                        Download PDF
                      </button>
                    </div>
                  </>
                )}
              </div>

              {canAdd && (
                <button
                  onClick={handleAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                >
                  <Plus size={20} />
                  Add New Product
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory(""); // Clear subcategory when category changes
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category || cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* SubCategory Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">All SubCategories</option>
                {subCategories
                  ?.filter(sub => !selectedCategory || (typeof sub.category === 'object' ? sub.category?._id === selectedCategory : sub.category === selectedCategory))
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-8">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{products?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Showing</p>
              <p className="text-2xl font-bold text-gray-800">{filteredProducts?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRP
                </th>
                {/* <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th> */}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SubCategory
                </th>
               
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts?.filter(p => p && p._id).map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.img?.[0] || "https://via.placeholder.com/150"}
                        alt={product.name || "Product"}
                        className="h-14 w-14 rounded object-cover"
                      />
                      <div className="ml-4 w-[250px]">
                        <div className="text-sm font-medium text-gray-900  line-clamp-1">{product.name || "Unnamed Product"}</div>
                        <div className="text-sm text-gray-500">ID: {product._id || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-center font-semibold text-gray-900">₹{product.price || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-center font-semibold line-through text-gray-400">₹{product.originalPrice || 0}</div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-center font-semibold text-gray-900">{product.quantity}</div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {product.category?.category || product.category?.name || (typeof product.category === 'string' ? product.category : "Uncategorized")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {product.subCategory?.name || (typeof product.subCategory === 'string' ? product.subCategory : "None")}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.discount}% OFF
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(product._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => openDeleteModal(product._id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {!canEdit && !canDelete && (
                        <span className="text-gray-400 text-xs">No actions available</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first, last, current, and neighbors
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center font-bold text-sm rounded-xl transition-all active:scale-90 ${
                            currentPage === pageNum
                              ? 'bg-slate-900 text-white shadow-lg border-slate-900 border'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === 2 && currentPage > 3) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNum} className="px-1 text-gray-400 font-bold">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-3 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Product
                </h3>
                <p className="text-gray-600 mb-1">
                  Are you sure you want to delete this product?
                </p>
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded mt-3">
                  {deleteModal.productName}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;