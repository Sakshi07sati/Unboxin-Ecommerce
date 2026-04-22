import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPublicProducts } from "../../global_redux/features/product/productThunks";
import { selectCategories } from "../../global_redux/features/category/categorySlice";
import { selectSubCategories } from "../../global_redux/features/subCategory/subCategorySlice";
import ProductCard from "../../components/Products/ProductCard";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Filter, Grid3X3, List } from "lucide-react";

function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Get filter IDs from URL
  const categoryIdFromUrl = searchParams.get("category");
  const subCategoryIdFromUrl = searchParams.get("subCategory");

  const { products, status } = useSelector((state) => state.products);
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);

  useEffect(() => {
    dispatch(fetchPublicProducts());
  }, [dispatch]);

  // Enhanced filtering logic to handle different ID formats and data structures
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.filter((product) => {
      // 1. SubCategory Filter (Priority)
      if (subCategoryIdFromUrl) {
        const productSubCat = product.subCategory;
        if (!productSubCat) return false;
        
        const productSubCatId = typeof productSubCat === "object" 
          ? (productSubCat?._id || productSubCat?.id) 
          : productSubCat;
          
        return String(productSubCatId) === String(subCategoryIdFromUrl);
      }
      
      // 2. Category Filter
      if (categoryIdFromUrl) {
        const productCat = product.category;
        if (!productCat) return false;
        
        const productCatId = typeof productCat === "object" 
          ? (productCat?._id || productCat?.id) 
          : productCat;
          
        return String(productCatId) === String(categoryIdFromUrl);
      }
      
      return true;
    });
  }, [products, categoryIdFromUrl, subCategoryIdFromUrl]);

  // Find active filter names for the heading
  const activeCategory = categories?.find(cat => String(cat._id || cat.id) === String(categoryIdFromUrl));
  const activeSubCategory = subCategories?.find(sub => String(sub._id || sub.id) === String(subCategoryIdFromUrl));

  const pageTitle = activeSubCategory 
    ? activeSubCategory.name 
    : activeCategory 
      ? (activeCategory.category || activeCategory.name) 
      : "All Products";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-[1400px] w-full mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight capitalize">
              {pageTitle}
            </h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Filter size={16} />
              Filter
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button className="p-1.5 bg-gray-100 rounded-md text-gray-900 shadow-inner group transition-all">
                <Grid3X3 size={18} className="group-active:scale-95"/>
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors group">
                <List size={18} className="group-active:scale-95"/>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                We couldn't find any products matching the current selection. Try exploring other categories!
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Products;