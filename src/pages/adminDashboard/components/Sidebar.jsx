import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  MessageSquare,
  ShoppingBag,
  Tag,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  // Static Menu items
  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "users",
      name: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "orders",
      name: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      id: "contacts",
      name: "Contacts",
      icon: MessageSquare,
      path: "/admin/contacts",
    },
    {
      id: "products",
      name: "Products",
      icon: Package,
      subItems: [
        { id: "addProduct", name: "Add Product", path: "/admin/products/add" },
        { id: "viewProducts", name: "View Products", path: "/admin/products" },
      ],
    },
     {
      id: "Categories",
      name: "Categories",
      icon: Package,
      path: "/admin/category",
    },
    // {
    //   id: "Categories",
    //   name: "Categories",
    //   icon: Package,
    //   subItems: [
    //     { id: "Add Category", name: "Add Category", path: "/admin/categories/add" },
    //     { id: "View Category", name: "View Category", path: "/admin/category" },
    //   ],
    // },
    {
      id: "SubCategories",
      name: "SubCategories",
      icon: Package,
      subItems: [
        { id: "Add SubCategory", name: "Add SubCategory", path: "/admin/subCategories/add" },
        { id: "View SubCategory", name: "View SubCategory", path: "/admin/subCategories" },
      ],
    },
    {
      id: "Sections",
      name: "Sections",
      icon: Package,
      path: "/admin/sections",
    },
    {
      id: "Section Products Management",
      name: "Section Products Management",
      icon: Package,
      subItems: [
        { id: "Add SectionProduct", name: "Add SectionProduct", path: "/admin/section/products/add" },
        { id: "View SectionProducts", name: "View SectionProducts", path: "/admin/section/products" },
      ],
    },
    { id: "banner", name: "Banner", icon: ShoppingBag, path: "/admin/banner" },
    { id: "promoCodes", name: "Promo Codes", icon: Tag, 
      subItems: [
        { id: "addPromoCode", name: "Add Promo Code", path: "/admin/promo-codes/add" },
        { id: "viewPromoCodes", name: "View Promo Codes", path: "/admin/promo-codes" },
      ]
     },
    // { id: "aiManagement", name: "AI Management", icon: Sparkles, path: "/admin/ai-management" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-slate-950 border-r border-slate-900 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-900/50 bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">
                Unboxin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-900 rounded-lg transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {menuItems.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => setOpenSubMenu(openSubMenu === item.id ? null : item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                        openSubMenu === item.id
                          ? "bg-slate-900 text-white"
                          : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {openSubMenu === item.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    {openSubMenu === item.id && (
                      <div className="ml-12 space-y-1 py-1">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.id}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? "text-blue-400 font-semibold bg-blue-400/10"
                                  : "text-slate-500 hover:text-blue-400 hover:bg-slate-900/30"
                              }`
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.id === "dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                          : "text-slate-400 hover:bg-slate-900/50 hover:text-white"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-900 bg-slate-900/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
