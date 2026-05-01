import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../global_redux/features/category/categoryThunks";
// import { selectCategories } from "../../global_redux/features/category/categorySlice";
import { fetchSubCategories } from "../../global_redux/features/subCategory/subCategoryThunks";
import { selectSubCategories } from "../../global_redux/features/subCategory/subCategorySlice";

export default function ProductCategory({ 
  // activeCategoryId, 
  setActiveCategoryId, 
  activeSubCategoryId, 
  setActiveSubCategoryId 
}) {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  // const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -400, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const handleSubCategoryClick = (id) => {
    setActiveSubCategoryId(activeSubCategoryId === id ? null : id);
    setActiveCategoryId(null); // Clear category filter if any
  };

  return (
    <div className="relative bg-white pt-7 pb-2 px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-5 px-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">
            Shop by SubCategory
          </h2>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => { setActiveCategoryId(null); setActiveSubCategoryId(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${!activeSubCategoryId ? 'bg-pink-600 text-white border-pink-600 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-pink-200 hover:text-pink-600'}`}
             >
                All
             </button>
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="relative group/scroll">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-[40%] -translate-y-1/2 z-20 bg-white shadow-xl p-1 md:p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 opacity-0 group-hover/scroll:opacity-100 hidden md:block"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide px-3 md:px-8 pb-8 pt-2"
          >
            {subCategories.map((sub, i) => {
              const subId = sub._id || sub.id;
              const subName = sub.name;
              const isActive = activeSubCategoryId === subId;
              const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(subName)}&background=random&color=fff&size=128&bold=true`;
              
              return (
                <div
                  key={subId || i}
                  onClick={() => handleSubCategoryClick(subId)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group select-none"
                >
                  {/* Circle Image Container */}
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full p-1 transition-all duration-500 overflow-hidden ${isActive ? 'ring-4 ring-pink-600 scale-105  ' : 'ring-2 ring-transparent ring-offset-2 scale-100 group-hover:scale-105 shadow-sm'}`}>
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img
                          src={sub.img || avatarUrl}
                          alt={subName}
                          className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}
                        />
                        {/* {isActive && (
                            <div className="absolute inset-0 bg-pink-600/20 backdrop-blur-[2px] flex items-center justify-center">
                                <LayoutGrid size={32} className="text-white drop-shadow-lg animate-in zoom-in duration-300" />
                            </div>
                        )} */}
                    </div>
                  </div>

                  {/* Name */}
                  <p className={`text-sm font-bold capitalize mt-4 text-center transition-all duration-300 ${isActive ? 'text-pink-600  ' : 'text-black group-hover:text-pink-500'}`}>
                    {subName}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-[40%] -translate-y-1/2 z-20 bg-white shadow-xl p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 opacity-0 group-hover/scroll:opacity-100 hidden md:block"
          >
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
