import React, { useEffect, useMemo, useState } from 'react'
import API from "../../../global_redux/api";
import ProductCategory from '../../../components/Sections/ProductCategory';
import ProductCard from "../../../components/Products/ProductCard";
import { FilterX } from "lucide-react";
const FeatureProduct = () => {
    const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      
      // Filtering state
      const [activeCategoryId, setActiveCategoryId] = useState(null);
      const [activeSubCategoryId, setActiveSubCategoryId] = useState(null);
    
      useEffect(() => {
        const fetchProducts = async () => {
          setLoading(true);
          try {
            const res = await API.get("/products");
            // Accessing the products array from res.data.data or res.data.products
            setProducts(res.data.data || res.data.products || []);
          } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
      }, []);
    
      // Filter products based on selected category/subcategory
      const filteredProducts = useMemo(() => {
        if (!products || !Array.isArray(products)) return [];
        
        let filtered = products;
        
        if (activeSubCategoryId) {
          filtered = products.filter(p => {
            const subId = typeof p.subCategory === 'object' ? (p.subCategory?._id || p.subCategory?.id) : p.subCategory;
            return String(subId) === String(activeSubCategoryId);
          });
        } else if (activeCategoryId) {
          filtered = products.filter(p => {
            const catId = typeof p.category === 'object' ? (p.category?._id || p.category?.id) : p.category;
            return String(catId) === String(activeCategoryId);
          });
        }
        
        // Limits the featured section to 8 items or shows all if a filter is active
        return (activeCategoryId || activeSubCategoryId) ? filtered : filtered.slice(0, 8);
      }, [products, activeCategoryId, activeSubCategoryId]);
    
      const clearFilters = () => {
        setActiveCategoryId(null);
        setActiveSubCategoryId(null);
      };
  return (
    <div>
       <ProductCategory 
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
              activeSubCategoryId={activeSubCategoryId}
              setActiveSubCategoryId={setActiveSubCategoryId}
            />
             {/* Featured Products Section */}
                  <section className=" border relative overflow-hidden py-1 md:py-2">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.08),_transparent_45%)]" />
                    <div className="mx-auto max-w-[1400px] px-4">
                      <div className="mb-5 flex flex-col  justify-between gap-4  md:flex-row md:p-2">
                        <div className="text-left px-3">
                          <h3 className="text-xl md:text-2xl font-bold  text-slate-900">
                            {activeSubCategoryId || activeCategoryId ? "Filtered Results" : "Featured Products"}
                          </h3>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            Discover our handpicked selection
                          </p>
                        </div>
                        
                        {(activeCategoryId || activeSubCategoryId) && (
                          <button 
                            onClick={clearFilters}
                            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-pink-200 hover:text-pink-600"
                          >
                            <FilterX size={16} className="group-hover:rotate-12 transition-transform" />
                            Clear Filters
                          </button>
                        )}
                      </div>
                      
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                          <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-pink-600"></div>
                          <p className="mt-4 text-sm font-medium">Loading products...</p>
                        </div>
                      ) : error ? (
                        <div className="rounded-3xl border border-red-100 bg-red-50/70 py-14 text-center text-red-500 shadow-sm">
                          <p className="text-base font-semibold">{error}</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
                            {filteredProducts.length > 0 ? (
                              filteredProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                              ))
                            ) : (
                              <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
                                <p className="text-lg font-medium">No products found in this category</p>
                                <button
                                  onClick={clearFilters}
                                  className="mt-4 font-medium text-pink-600 transition-colors hover:text-pink-700 hover:underline"
                                >
                                  View all products
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </section>
    </div>
  )
}

export default FeatureProduct
