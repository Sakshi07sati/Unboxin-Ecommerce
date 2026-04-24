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
import PublicProducts from "../pages/ProductSection/Products";
import ViewProduct from "../pages/adminDashboard/product/ViewProduct";
import ProductDetails from "../pages/ProductSection/ProductDetails";
import SubCategory from "../pages/adminDashboard/subCategory/SubCategory";
import SubCategoryAdd from "../pages/adminDashboard/subCategory/SubCategoryAdd";
import SubCategoryEdit from "../pages/adminDashboard/subCategory/SubCategoryEdit";
import User from "../pages/adminDashboard/users/User";
import Contact from "../pages/adminDashboard/contacts/Contact";
import Section from "../pages/adminDashboard/sections/Section";
import SectionManagement from "../pages/adminDashboard/sections/Section";
import SectionProduct from "../pages/adminDashboard/sectionProduct/SectionProduct";
import AddSectionProduct from "../pages/adminDashboard/sectionProduct/AddSectionProduct";
import Order from '../pages/adminDashboard/orders/Order'
import PromoCode from "../pages/adminDashboard/promocode/PromoCode";
import AddPromoCode from "../pages/adminDashboard/promocode/AddPromoCode";
import CartPage from "../pages/cartPage/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import NotFound from "../pages/notFound/NotFound";
import Profile from "../pages/profile/Profile";
import Contacts from "../pages/contacts/Contacts";
import About from "../pages/about/About";
import Wishlist from "../pages/wishlist/Wishlist";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/product-category" element={<ProductCategory />} />
      <Route path="/product-card" element={<ProductCard />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<PublicProducts />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/about" element={<About />} />
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
        <Route path="users" element={<User />} />
        <Route path="orders" element={<Order/>} />
        <Route path="contacts" element={<Contact />} />
        <Route
          path="products/add"
          element={<AddProduct />}
        />
        <Route path="products/view/:id" element={<ViewProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        {/* Category Routes */}
        <Route path="categories/add" element={<AddCategory />} />

        {/* Placeholder for other routes (they were commented out in previous code) */}
        <Route path="category" element={<Category />} />
        <Route path="banner" element={<BannerManagement />} />
        {/* SubCategory Routes */}
        <Route path="subCategories" element={<SubCategory />} />
        <Route path="subCategories/add" element={<SubCategoryAdd />} />
        <Route path="subCategories/edit/:id" element={<SubCategoryEdit />} />
        <Route path="sections" element={<SectionManagement />} />
        <Route path="section/products/add" element={<AddSectionProduct />} />
        <Route path="section/products" element={<SectionProduct />} />
          <Route path="/admin/promo-codes" element={<PromoCode />} />
        <Route 
          path="/admin/promo-codes/add" 
          element={<AddPromoCode />} 
        />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
