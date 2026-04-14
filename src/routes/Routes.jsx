import { Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import ProductCategory from "../components/Sections/ProductCategory";
import ProductCard from "../components/Products/ProductCard";
import AdminLogin from "../pages/admin/adminLogin/AdminLogin";
import AdminProtectedRoute from "../pages/protectedRoutes/AdminProtectedRoutes";
import AdminLayout from "../pages/adminDashboard/AdminLayout";
import Dashboard from "../pages/adminDashboard/components/Dashboard";
import AddCategory from "../pages/adminDashboard/category/AddCategory";
import Category from "../pages/adminDashboard/category/Category";
import BannerManagement from "../pages/adminDashboard/banners/Banner";
import AddProduct from "../pages/adminDashboard/product/AddProduct";
import EditProduct from "../pages/adminDashboard/product/EditProduct";
import Products from "../pages/adminDashboard/product/Product";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product-category" element={<ProductCategory />} />
      <Route path="/product-card" element={<ProductCard />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route 
          path="products/add" 
          element={<AddProduct />} 
        />
        <Route path="products/edit/:id" element={<EditProduct />} />
        {/* Category Routes */}
        <Route path="categories/add" element={<AddCategory />} />
        
        {/* Placeholder for other routes (they were commented out in previous code) */}
        <Route path="category" element={<Category />} />
        <Route path="banner" element={<BannerManagement />} />

      </Route>
    </Routes>
  );
};

export default AllRoutes;
