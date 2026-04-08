import { useEffect, useRef, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Shirt,
  Settings,
  LogOut,
  Edit,
  Package,
} from "lucide-react";
import { useSelector,  } from "react-redux";
// import { selectCartItemsCount } from "@/global_redux/features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
// import logoblack from "@/assets/logo-black.png";
// import { logout } from "@/global_redux/features/auth/authSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  // const cartItemsCount = useSelector(selectCartItemsCount);
  const menuRef = useRef(null);
  // const { user } = useSelector((state) => state.auth || {});
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // dispatch(logout()); // ✅ Now dispatch is defined
    navigate("/");
    window.location.reload();
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                {/* <img
                  className="h-12 w-auto"
                  src={logoblack}
                  alt="Teezines Logo"
                /> */}
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 text-xl font-mouse hover:text-black font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center md:space-x-4">
            <div className="hidden relative lg:inline-block">
              <div className="absolute top-[6px] left-[6px] w-full h-full bg-black rounded-full"></div>
               
            </div>

            {/* {!user && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 border border-gray-500 py-1 px-1 md:py-2 md:px-3 rounded-sm md:rounded-lg hover:text-black font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="text-gray-700 border border-gray-500 py-1 px-1 md:py-2 md:px-3 rounded-sm md:rounded-lg hover:text-black font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )} */}

            {/* {user && (
              <div className="relative" ref={menuRef}>
                <div
                  onClick={() => setOpen(!open)}
                  className="p-2 border border-black hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <User className="h-5 w-5 text-gray-700" />
                </div>

                {open && (
                  <div className="absolute right-1/2 transform translate-x-1/2 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-3 border-b">
                      <p className="font-semibold text-gray-800">
                        {user?.username || "Guest User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || "guest@example.com"}
                      </p>
                    </div>
                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => { navigate("/profile");
                        setOpen(false);
                      }}
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        Profile
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          navigate("/orders");
                          setOpen(false);
                        }}
                      >
                        <Package className="h-4 w-4 text-gray-600" />
                        My Orders
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={handleUpdatePassword}
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                        Update Password
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 text-gray-600" />
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )} */}

            <Link to="/cart">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {/* {cartItemsCount} */}
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-700 hover:text-black font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative inline-block">
              <div className="absolute top-[6px] left-[6px] w-full h-full bg-black rounded-full"></div>
               
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;