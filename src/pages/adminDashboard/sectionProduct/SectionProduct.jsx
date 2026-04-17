import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSectionsProduct,
  replaceSectionProduct,
  deleteSectionProduct,
} from "../../../global_redux/features/sectionProducts/sectionProductThunks";
import { fetchProductById } from "../../../global_redux/features/product/productThunks";
import { 
  Loader2, 
  Eye, 
  Package, 
  Pencil, 
  Trash2, 
  AlertCircle, 
  Search, 
  Filter, 
  X,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { exportSectionProducts } from "@/utils/exportUtils";
import toast from "react-hot-toast";

const SectionProduct = () => {
  const dispatch = useDispatch();
  const { sections, loading, error } = useSelector(
    (state) => state.sectionProduct
  );
  
  // Permissions removed as per request

  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Edit Modal State
  const [editModal, setEditModal] = useState({
    open: false,
    sectionName: "",
    oldProductId: "",
    newProductId: "",
  });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    sectionName: "",
    productId: "",
    productName: "",
  });

  // Fetch all sections on mount - only once
  useEffect(() => {
    dispatch(fetchSectionsProduct());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - removed dispatch dependency

  // Fetch product details once after sections load
  useEffect(() => {
    if (sections?.length && Object.keys(productDetails).length === 0) {
      fetchAllProductDetails();

      console.log("Product details:", productDetails);
    }
  }, [sections]);

  const fetchAllProductDetails = async () => {
    setLoadingProducts(true);
    const details = {};

    try {
      const allProductIds = sections.flatMap((section) =>
        section.products?.map((p) => (typeof p === "string" ? p : p._id || p))
      );

      const uniqueIds = [...new Set(allProductIds)];

      const promises = uniqueIds.map(async (id) => {
        try {
          const result = await dispatch(fetchProductById(id)).unwrap();
          details[id] = result;
        } catch {
          details[id] = null;
        }
      });

      await Promise.all(promises);
      setProductDetails(details);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle Edit Save
  const handleEditSave = async () => {
    if (!editModal.newProductId.trim()) return alert("Enter new Product ID");

    setIsProcessing(true);
    
    try {
      // Close modal immediately for better UX
      setEditModal({
        open: false,
        sectionName: "",
        oldProductId: "",
        newProductId: "",
      });

      // Replace the product in the section
      await dispatch(
        replaceSectionProduct({
          sectionName: editModal.sectionName,
          oldProductId: editModal.oldProductId,
          newProductId: editModal.newProductId,
        })
      ).unwrap();

      // Fetch the new product details and refresh sections in parallel
      const [newProductDetails] = await Promise.all([
        dispatch(fetchProductById(editModal.newProductId)).unwrap(),
        dispatch(fetchSectionsProduct()).unwrap()
      ]);
      
      // Update product details state
      setProductDetails(prev => ({
        ...prev,
        [editModal.newProductId]: newProductDetails
      }));

    } catch (error) {
      console.error("Failed to replace product:", error);
      alert("Failed to replace product. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Close modal immediately for better UX
      setDeleteModal({ open: false, sectionName: "", productId: "", productName: "" });

      await dispatch(
        deleteSectionProduct({
          section: deleteModal.sectionName,
          productId: deleteModal.productId,
        })
      ).unwrap();

      // Refresh sections to get updated data
      await dispatch(fetchSectionsProduct());

    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to remove product. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter and search sections
  const filteredSections = useMemo(() => {
    if (!sections) return [];
    
    let filtered = sections.filter(
      (section) => section.products && section.products.length > 0
    );

    if (selectedSection !== "all") {
      filtered = filtered.filter((s) => s.section === selectedSection);
    }

    if (searchTerm) {
      filtered = filtered.map((section) => ({
        ...section,
        products: section.products.filter((product) => {
          const productId = typeof product === "string" ? product : product._id || product;
          const details = productDetails[productId];
          const name = details?.name || details?.title || "";
          const categoryObj = details?.category;
          const categoryName = typeof categoryObj === 'object' ? categoryObj.category : categoryObj || "";
          
          return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoryName.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }),
      })).filter((section) => section.products.length > 0);
    }

    return filtered;
  }, [sections, selectedSection, searchTerm, productDetails]);

  // Get total products count
  const totalProducts = useMemo(() => {
    return sections?.reduce((acc, section) => acc + (section.products?.length || 0), 0) || 0;
  }, [sections]);

  // loading handled inline to prevent jumpy UI

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="text-red-500 mb-4 mx-auto" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Error Loading Data</h3>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!sections?.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Sections Found</h3>
          <p className="text-gray-500">Start by creating your first section</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Section Product Management</h2>
              <p className="text-gray-600 text-sm mt-1">
                {totalProducts} Total Products across {sections.length} Sections
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {(loadingProducts || isProcessing) && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Loader2 className="animate-spin text-blue-600" size={16} />
                  <span className="text-blue-700 text-xs font-medium">
                    {isProcessing ? "Processing..." : "Loading details..."}
                  </span>
                </div>
              )}

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
                          exportSectionProducts(filteredSections, productDetails, 'csv');
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
                          exportSectionProducts(filteredSections, productDetails, 'csv');
                          toast.success('Excel Exported successfully!');
                          setExportDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 text-left"
                      >
                        <FileSpreadsheet size={16} className="text-blue-600" />
                        Download Excel
                      </button>
                      <button
                        onClick={() => {
                          exportSectionProducts(filteredSections, productDetails, 'pdf');
                          toast.success('PDF Generated successfully!');
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products in sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Sections</option>
                {sections
                  .filter((s) => s.products?.length > 0)
                  .map((section) => (
                    <option key={section._id} value={section.section}>
                      {section.section} ({section.products?.length})
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && sections.length === 0 && (
          <div className="bg-white p-8 rounded-b-lg shadow-sm border border-gray-100 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">Loading sections...</p>
          </div>
        )}

        {/* Sections Grid */}
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div
              key={section._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl"
            >
              {
                console.log("Rendering section:", filteredSections)
              }
              {/* Section Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 capitalize">
                      {section.section}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {section.products?.length || 0} Products classified in this collection
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {section.products?.map((product, index) => {
                      const productId =
                        typeof product === "string"
                          ? product
                          : product._id || product;
                      const details = productDetails[productId];

                      return (
                        <tr
                          key={productId || index}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                            {index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center shadow-sm ring-2 ring-gray-200">
                              {details?.img?.[0] ? (
                                <img
                                  src={details.img[0]}
                                  alt={details?.name || "Product"}
                                  className="object-cover w-full h-full"
                                  onError={(e) =>
                                    (e.target.src = "/placeholder.png")
                                  }
                                />
                              ) : (
                                <Package className="text-gray-400" size={28} />
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {details?.name || details?.title || "Unnamed Product"}
                            </div>
                            {details && (
                              <div className="text-xs text-gray-500 mt-1 font-mono">
                                ID: {productId.slice(0, 8)}...
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {details?.price ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-bold">
                                ₹{details.price}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {details?.category ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                                {typeof details.category === 'object' 
                                  ? details.category.category 
                                  : details.category}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {details?.createdAt
                              ? new Date(details.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "—"}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                                title="View Product"
                              >
                                <Eye size={18} />
                              </button> */}

                                <button
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all hover:scale-110"
                                  title="Replace Product"
                                  onClick={() =>
                                    setEditModal({
                                      open: true,
                                      sectionName: section.section,
                                      oldProductId: productId,
                                      newProductId: "",
                                    })
                                  }
                                >
                                  <Pencil size={18} />
                                </button>

                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                                  title="Remove from Section"
                                  onClick={() =>
                                    setDeleteModal({
                                      open: true,
                                      sectionName: section.section,
                                      productId,
                                      productName: details?.name || details?.title || "this product",
                                    })
                                  }
                                >
                                  <Trash2 size={18} />
                                </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {(!section.products || section.products.length === 0) && (
                  <div className="py-12 text-center">
                    <Package className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-500">No products in this section</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Search className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Pencil className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Replace Product</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Section</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {editModal.sectionName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Product ID</p>
                <p className="text-sm font-mono text-gray-700 break-all">
                  {editModal.oldProductId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Product ID
                </label>
                <input
                  type="text"
                  placeholder="Enter new product ID"
                  value={editModal.newProductId}
                  onChange={(e) =>
                    setEditModal({ ...editModal, newProductId: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setEditModal({
                    open: false,
                    sectionName: "",
                    oldProductId: "",
                    newProductId: "",
                  })
                }
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleEditSave}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Replacing...
                  </>
                ) : (
                  "Replace Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-red-600">Confirm Removal</h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to remove <span className="font-semibold">"{deleteModal.productName}"</span> from the{" "}
                <span className="font-semibold capitalize">{deleteModal.sectionName}</span> section?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  ⚠️ This action will remove the product from this section only. The product itself will not be deleted.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    sectionName: "",
                    productId: "",
                    productName: "",
                  })
                }
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Removing...
                  </>
                ) : (
                  "Remove Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionProduct;