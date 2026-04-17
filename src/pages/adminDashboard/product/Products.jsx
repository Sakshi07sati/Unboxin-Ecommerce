import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../../global_redux/features/product/productThunks";
import { fetchSubCategories } from "../../../global_redux/features/subCategory/subCategoryThunks";
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
  Package, 
  Tag, 
  Wallet,
  Zap,
  Filter,
  ArrowUpDown,
  MousePointer2,
  Box,
  Layers
} from "lucide-react";
import { toast } from "react-hot-toast";
import { exportProducts } from "@/utils/exportUtils";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error, totalPages, totalProducts } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage ] = useState(10);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    dispatch(fetchSubCategories());
  }, [dispatch, currentPage, itemsPerPage]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm.trim()) return products;

    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
      const name = product.name?.toLowerCase() || "";
      const cat = (product.category?.category || product.category?.name || (typeof product.category === 'string' ? product.category : ""))?.toLowerCase() || "";
      const sub = (product.subCategory?.name || (typeof product.subCategory === 'string' ? product.subCategory : ""))?.toLowerCase() || "";
      const id = product._id?.toLowerCase() || "";
      
      return name.includes(searchLower) || cat.includes(searchLower) || sub.includes(searchLower) || id.includes(searchLower);
    });
  }, [searchTerm, products]);

  // Since we use server-side pagination, paginatedProducts is just the filtered list
  // or simply the products from state if we trust the server results.
  const paginatedProducts = filteredProducts;

  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const inventoryStats = useMemo(() => {
    if (!products) return { total: 0, stockValue: 0, categories: 0 };
    // total is now the global count from Redux
    const total = totalProducts;
    // value and uniqueCats are currently based on the loaded page
    const value = products.reduce((acc, p) => acc + (Number(p.originalPrice) || 0), 0);
    const uniqueCats = new Set(products.map(p => p.category?._id || p.category)).size;
    return { total, stockValue: value, categories: uniqueCats };
  }, [products, totalProducts]);

  const handleDelete = async () => {
    const { productId } = deleteModal;
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
    const loadingToast = toast.loading("Deleting product...");

    try {
      const res = await dispatch(deleteProduct(productId));
      toast.dismiss(loadingToast);
      if (res.type.endsWith("fulfilled")) {
        toast.success("Product deleted successfully");
        dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage })); // Refetch current page
      } else {
        toast.error(res.payload || "Delete failed");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An error occurred during deletion");
    }
  };

  if (status === "loading") return (
    <div className="flex flex-col items-center justify-center h-[50vh] animate-pulse">
       <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
       <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Asset Registry...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn mb-24">
      
      {/* Premium Module Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Box size={10} className="fill-indigo-500" />
              Resource Management
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Assets</span></h1>
           <p className="text-slate-500 font-medium text-lg mt-2">Oversee internal logistics and global product distributions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <button
             onClick={() => {
               exportProducts(filteredProducts, 'csv');
               toast.success('Registry export successful');
             }}
             className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm shadow-xl shadow-slate-200/50 active:scale-95 group"
           >
             <Download size={18} className="text-blue-500 group-hover:rotate-12 transition-transform" />
             Extract CSV
           </button>
           <button
             onClick={() => navigate("/admin/products/add")}
             className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-black text-sm shadow-[0_15px_30px_rgba(0,0,0,0.15)] active:scale-95 group"
           >
             <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
             Initialize Asset
           </button>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 flex items-center justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[4rem] group-hover:w-32 group-hover:h-32 transition-all duration-500"></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Inventory</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{inventoryStats.total}</p>
           </div>
           <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Package size={32} />
           </div>
        </div>

        <div className="md:col-span-4 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 flex items-center justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[4rem] group-hover:w-32 group-hover:h-32 transition-all duration-500"></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capital Value</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{inventoryStats.stockValue.toLocaleString()}</p>
           </div>
           <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Wallet size={32} />
           </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 rounded-[2rem] p-4 flex items-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
           <div className="relative z-10 w-full px-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block px-1">Global Filter Matrix</label>
              <div className="relative group/search">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="ID, Unit or Tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold text-white text-xs placeholder:text-slate-600"
                />
              </div>
           </div>
        </div>
      </div>

      {/* Operational Registry */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-slideUp">
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Zap size={18} className="text-blue-400 fill-blue-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Operational Registry</h2>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                 <ArrowUpDown size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Module</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Unit Pricing</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matrix Tags</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Direct Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition-all duration-300 group/row">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner group-hover/row:scale-110 group-hover/row:rotate-3 transition-all duration-500">
                            <img
                              src={product.img?.[0] || "https://via.placeholder.com/150"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg shadow-md flex items-center justify-center text-[10px] font-black text-blue-600 opacity-0 group-hover/row:opacity-100 transition-opacity">
                             {idx + 1}
                          </div>
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tight capitalize group-hover/row:text-blue-600 transition-colors">{product.name || "Untitled Asset"}</p>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">IDX REF: {product._id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-black text-slate-900 tracking-tighter">₹{product.originalPrice || 0}</span>
                          <div className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[9px] font-black uppercase tracking-tighter border border-rose-100/50 line-through decoration-rose-300/50">
                             VAL: ₹{product.price || 0}
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <Tag size={10} />
                             </div>
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                {product.category?.category || product.category?.name || (typeof product.category === 'string' ? product.category : "UNASSIGNED")}
                             </span>
                          </div>
                          <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] w-fit border border-slate-200/50 group-hover/row:bg-white transition-colors">
                             {product.subCategory?.name || (typeof product.subCategory === 'string' ? product.subCategory : "ROOT")}
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all duration-300 translate-x-4 group-hover/row:translate-x-0">
                        <button
                          onClick={() => navigate(`/admin/products/view/${product._id}`)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-90"
                          title="Detailed View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all shadow-sm active:scale-90"
                          title="Refine Module"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, productId: product._id, productName: product.name })}
                          className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all shadow-sm active:scale-90"
                          title="Purge Link"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-10 py-32 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-100 text-slate-200">
                       <Package size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Null Asset Matrix</h3>
                    <p className="text-slate-400 font-bold text-sm mt-2 opacity-60 uppercase tracking-widest">Initialize your registry to see results</p>
                    <button 
                      onClick={() => navigate("/admin/products/add")}
                      className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200"
                    >
                      Initialize Asset
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Console Console / Pagination */}
        {totalPages > 1 && (
          <div className="bg-slate-50/50 px-10 py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Module Density</span>
                 <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-white border-2 border-slate-100 rounded-xl px-4 py-2.5 text-xs font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none shadow-sm cursor-pointer"
                  >
                    {[5, 10, 20, 50, 100].map(v => <option key={v} value={v}>{v} Blocks</option>)}
                  </select>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm active:scale-90"><ChevronsLeft size={18} /></button>
               <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm active:scale-90"><ChevronLeft size={18} /></button>
               
               <div className="flex items-center gap-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                   if (
                     page === 1 ||
                     page === totalPages ||
                     (page >= currentPage - 1 && page <= currentPage + 1)
                   ) {
                     return (
                       <button
                         key={page}
                         onClick={() => setCurrentPage(page)}
                         className={`w-10 h-10 rounded-xl font-black text-xs transition-all active:scale-90 ${
                           currentPage === page
                             ? "bg-slate-900 text-white shadow-lg"
                             : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                         }`}
                       >
                         {page}
                       </button>
                     );
                   } else if (
                     (page === 2 && currentPage > 3) ||
                     (page === totalPages - 1 && currentPage < totalPages - 2)
                   ) {
                     return <span key={page} className="text-slate-300">...</span>;
                   }
                   return null;
                 })}
               </div>

               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm active:scale-90"><ChevronRight size={18} /></button>
               <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-3 bg-white border border-slate-100 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm active:scale-90"><ChevronsRight size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Security Modal - Purge Confirmation */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: "" })}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
             ></motion.div>
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center border border-white/20"
             >
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
                  <AlertTriangle size={40} />
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Purge Link?</h3>
               <p className="text-slate-500 font-bold text-base mb-10 leading-relaxed px-2 uppercase tracking-tight">
                 You are about to initiate a permanent purge of <span className="text-rose-600">"{deleteModal.productName}"</span> from the global registry.
               </p>
               <div className="flex flex-col gap-4">
                 <button 
                   onClick={handleDelete} 
                   className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl hover:shadow-rose-600/20 hover:bg-rose-600 transition-all duration-300 active:scale-95"
                 >
                   Confirm Purge
                 </button>
                 <button 
                   onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: "" })} 
                   className="w-full text-slate-400 font-black text-xs uppercase tracking-[0.2em] py-5 hover:bg-slate-50 rounded-2xl transition-all"
                 >
                   Abort Operation
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
