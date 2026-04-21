import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Camera,
  Heart,
  Shirt,
  Settings,
  LogOut,
  Edit,
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

const Navbar = () => {
  const [openAuth, setOpenAuth] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const cartItemsCount = useSelector(selectCartItemsCount);
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
    }, [dispatch]);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-primary font-black text-4xl tracking-tighter cursor-pointer">
              UN<span className="font-normal text-3xl not-italic text-primary">BOX</span>
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex gap-6 font-semibold text-sm text-textPrimary uppercase tracking-wide">
             <Link to="/" className="hover:text-primary transition-colors">Home</Link>
             {categories.map((category) => (
               <Link to="/" key={category._id} className="hover:text-primary transition-colors">
                 {category.category}
               </Link>
             ))}
            {/* <a href="#" className="hover:text-primary transition-colors">Fashion</a>
            <a href="#" className="hover:text-primary transition-colors">Beauty</a>
            <a href="#" className="hover:text-primary transition-colors">Electronics</a> */}
            {/* <a href="#" className="hover:text-primary transition-colors">Mobile</a> */}
            <Link to="/admin/login" className="hover:text-primary transition-colors font-bold">
              Admin
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-100 border-none rounded py-2 pl-10 pr-10 text-sm focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search for products, styles, brands..."
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          {/* User Profile / Login */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all duration-300">
                  <User size={18} className="text-primary group-hover:text-white" />
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>
            ) : (
              <button 
                onClick={() => setOpenAuth(true)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
                title="Login / Signup"
              >
                <User size={22}/>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {user && isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
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
          
          <Link to="/wishlist" className="hover:text-primary transition-colors relative hidden sm:block">
            <Heart size={22} />
          </Link>

          <div className="relative">
             <Link to="/cart" className="flex items-center hover:text-primary transition-colors">
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold animate-in zoom-in">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
          
          <button className="lg:hidden hover:text-primary transition-colors">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
