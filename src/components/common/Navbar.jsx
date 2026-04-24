import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Heart,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItemsCount } from "../../global_redux/features/cart/cartSlice";
import React, { useState, useRef, useEffect } from "react";
import AuthModal from "../User/AuthModal";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../global_redux/features/auth/authSlice";
import { fetchCategories } from "../../global_redux/features/category/categoryThunks";
import { selectCategories } from "../../global_redux/features/category/categorySlice";
import { fetchSubCategories } from "../../global_redux/features/subCategory/subCategoryThunks";
import { selectSubCategories } from "../../global_redux/features/subCategory/subCategorySlice";

const Navbar = () => {
  const [openAuth, setOpenAuth] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const cartItemsCount = useSelector(selectCartItemsCount);
  const wishlistCount = useSelector((state) => state.wishlist.items?.length || 0);
  const { user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate("/");
  };
    useEffect(() => {
       dispatch(fetchCategories());
       dispatch(fetchSubCategories());
     }, [dispatch]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="cursor-pointer text-3xl font-black tracking-tight text-primary xl:text-4xl">
              UN<span className="text-[0.85em] font-medium not-italic text-primary/80">BOX</span>
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden items-center gap-1 rounded-full border border-gray-100 bg-gray-50/70 p-1 lg:flex">
             {/* <Link to="/" className="hover:text-primary transition-colors">Home</Link> */}
             {categories.map((category) => {
                const categoryId = category._id || category.id;
                return (
                  <div 
                    key={categoryId} 
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(categoryId)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link 
                      to={`/products?category=${categoryId}`} 
                      className="flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide text-textPrimary transition-colors hover:bg-white hover:text-primary"
                    >
                      {category.category}
                      <ChevronDown size={14} className={`opacity-50 transition-transform duration-300 ${hoveredCategory === categoryId ? "rotate-180" : ""}`} />
                    </Link>
                    
                    {/* Subcategory Dropdown */}
                    {hoveredCategory === categoryId && (
                      <div className="animate-in slide-in-from-top-2 absolute left-0 top-[100%] z-[100] min-w-[220px] rounded-2xl border border-gray-100 bg-white py-3 shadow-2xl duration-200 fade-in">
                        <div className="grid grid-cols-1 gap-1">
                          {subCategories
                            .filter((sub) => {
                              if (!sub.category) return false;
                              const subCatId = typeof sub.category === "object" ? (sub.category?._id || sub.category?.id) : sub.category;
                              return subCatId === categoryId;
                            })
                            .map((sub) => (
                              <Link 
                                key={sub._id || sub.id}
                                to={`/products?subCategory=${sub._id || sub.id}`}
                                className="group/item flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
                              >
                                {sub.name}
                                <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                              </Link>
                            ))}
                          {subCategories.filter((sub) => {
                            if (!sub.category) return false;
                            const subCatId = typeof sub.category === "object" ? (sub.category?._id || sub.category?.id) : sub.category;
                            return subCatId === categoryId;
                          }).length === 0 && (
                            <p className="px-4 py-2 text-xs text-gray-400 italic">No subcategories</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {/* <a href="#" className="hover:text-primary transition-colors">Fashion</a>
            <a href="#" className="hover:text-primary transition-colors">Beauty</a>
            <a href="#" className="hover:text-primary transition-colors">Electronics</a> */}
            {/* <a href="#" className="hover:text-primary transition-colors">Mobile</a> */}
            
          </div>
        </div>
              <Link to="/admin/login" className="hover:text-primary transition-colors font-bold">
              Admin
            </Link>
        {/* Search Bar */}
        <div className="relative mx-5 hidden max-w-md flex-1 md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={17} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search for products, styles, brands..."
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 text-gray-700 sm:gap-3">
          {/* User Profile / Login */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div className="group flex cursor-pointer items-center gap-1" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-primary">
                  <User size={18} className="text-primary group-hover:text-white" />
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </div>
            ) : (
              <button 
                onClick={() => setOpenAuth(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-primary/30 hover:text-primary"
                title="Login / Signup"
              >
                <User size={19} />
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {user && isProfileOpen && (
              <div className="animate-in zoom-in absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl duration-200 fade-in">
                <div className="bg-primary/5 p-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900 truncate">
                    {user?.username || user?.name || "User"}
                  </p>
                  <p className="text-xs text-textSecondary truncate">
                    {user?.email || "No email provided"}
                  </p>
                </div>
                
                <ul className="py-2">
                  <li>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/orders" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Heart size={16} />
                      Wishlist
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 mt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <AuthModal isOpen={openAuth} onClose={() => setOpenAuth(false)} />
          
          <Link to="/wishlist" className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-primary/30 hover:text-primary sm:flex">
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="animate-in zoom-in absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <div className="relative">
             <Link to="/cart" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-primary/30 hover:text-primary">
              <ShoppingBag size={18} />
              {cartItemsCount > 0 && (
                <span className="animate-in zoom-in absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
          
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:border-primary/30 hover:text-primary lg:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
