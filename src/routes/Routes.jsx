import { Route, Routes } from "react-router-dom";
// import AdminLayout from "@/pages/AdminDashboard/AdminLayout";
// import Dashboard from "@/pages/AdminDashboard/components/Dashboard";
// import AddProduct from "@/pages/AdminDashboard/Products/AddProduct";
// import Products from "@/pages/AdminDashboard/Products/Products";
// import AdminLogin from "@/pages/AdminLogin/AdminLogin";
// import ProtectedRoute from "@/pages/ProtectedRoutes/AdminProtectedRoute";
import Home from "../pages/home/Home";
// import EditProduct from "@/pages/AdminDashboard/Products/EditProduct";
// import Shop from "@/pages/Shop/Shop";
// import ProductDetails from "@/pages/Shop/Components/ProductDetail";
// import Signup from "@/pages/Auth/Signup/Signup";
// import CartPage from "@/pages/CartPage/Cart";
// import Category from "@/pages/AdminDashboard/Category/Category";
// import AddCategory from "@/pages/AdminDashboard/Category/AddCategory";
// import CustomizerPage from "@/pages/CustomizerPage";
// import Contact from "@/pages/Contact/Contact";
// import BannerManagement from "@/pages/AdminDashboard/Banner/Banner";
// import About from "@/pages/About/About";
// import SectionManagement from "@/pages/AdminDashboard/Sections/Section";
// import SectionProductManagement from "@/pages/AdminDashboard/SectionProductMangement/SectionProductManagement";
// import AddSectionProduct from "@/pages/AdminDashboard/SectionProductMangement/AddSectionProduct";
// import Login from "@/pages/Auth/Login/Login";
// import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
// import UpdatePassword from "@/pages/Auth/UpdatePassword/UpdatePassword";
// import PromoCode from "@/pages/AdminDashboard/PromoCode/PromoCode";
// import AddPromoCode from "@/pages/AdminDashboard/PromoCode/AddPromoCode";
// import AdminOrders from "@/pages/AdminDashboard/Orders/AdminOrders";
// import NormalOrders from "@/pages/AdminDashboard/Orders/NormalOrders";
// import CustomizableOrders from "@/pages/AdminDashboard/Orders/CustomizableOrders";
// import AdminContacts from "@/pages/AdminDashboard/Contacts/AdminContacts";
// import Profile from "@/pages/Profile/Profile";
// import CheckoutPage from "@/pages/Checkout/CheckoutPage";
// import OrderSuccess from "@/pages/Checkout/OrderSuccess";
// import Orders from "@/pages/Orders/Orders";
// import Users from "@/pages/AdminDashboard/Users/Users";
// import AIManagement from "@/pages/AdminDashboard/AIManagement/AIManagement";
// import SubAdmins from "@/pages/AdminDashboard/SubAdmins/SubAdmins";
// import AddSubAdmin from "@/pages/AdminDashboard/SubAdmins/AddSubAdmin";
// import SubAdminLogin from "@/pages/SubAdminLogin/SubAdminLogin";
// import NotFound from "@/component/NotFound";
// import AdminProtectedRoute from "@/pages/ProtectedRoutes/AdminProtectedRoute";
// import UserProtectedRoute from "@/pages/ProtectedRoutes/UserProtectedRoute";
// import PermissionProtectedRoute from "@/pages/ProtectedRoutes/PermissionProtectedRoute";
// import TermsAndConditions from "@/pages/TermsAndConditions/TermsAndConditions";
// import PrivacyPolicy from "@/pages/PrivacyPolicy/PrivacyPolicy";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
      {/* <Route path="/sub-admin/login" element={<SubAdminLogin />} /> */}
      {/* <Route path="/shop" element={<Shop />} /> */}
      {/* <Route path="/shop/:sectionName" element={<Shop />} /> */}
      {/* <Route path="/shop/:section" element={<Shop />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/contact" element={<Contact />} /> */}
      {/* <Route path="/product/:id" element={<ProductDetails />} /> */}
      {/* <Route path="/cart" element={<CartPage />} /> */}
      {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      {/* <Route path="/order-success" element={<OrderSuccess />} /> */}
      {/* <Route path="/customize" element={<CustomizerPage />} /> */}
      {/* <Route path="/terms-and-conditions" element={<TermsAndConditions />} /> */}
      {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}

      {/* <Route path="/sign-up" element={<Signup />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      {/* <Route path="/update-password" element={<UpdatePassword />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
      {/* <Route 
        path="/orders" 
        element={
          <UserProtectedRoute>
            <Orders />
          </UserProtectedRoute>
        } 
      /> */}
      {/* <Route path="*" element={<NotFound />} /> */}

       {/* <Route 
              path="/checkout" 
              element={
                <UserProtectedRoute>
                  <CheckoutPage />
                </UserProtectedRoute>
              } 
            /> */}

            


      {/* Protected Admin Routes */}
      {/* <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route 
          path="products/add" 
          element={
            <PermissionProtectedRoute module="products" action="add">
              <AddProduct />
            </PermissionProtectedRoute>
          } 
        /> */}
        {/* <Route path="/admin/products/edit/:id" element={<EditProduct />} /> */}

        {/* <Route path="/admin/category" element={<Category />} /> */}
        {/* <Route 
          path="/admin/categories/add" 
          element={
            <PermissionProtectedRoute module="categories" action="add">
              <AddCategory />
            </PermissionProtectedRoute>
          } 
        /> */}

        {/* <Route path="/admin/banner" element={<BannerManagement />} /> */}

        {/* <Route path="/admin/section" element={<SectionManagement />} /> */}

        {/* <Route path="/admin/section/products" element={<SectionProductManagement />} /> */}
        {/* <Route 
          path="/admin/section/products/add" 
          element={
            <PermissionProtectedRoute module="sectionProducts" action="add">
              <AddSectionProduct />
            </PermissionProtectedRoute>
          } 
        />

        <Route path="/admin/promo-codes" element={<PromoCode />} />
        <Route 
          path="/admin/promo-codes/add" 
          element={
            <PermissionProtectedRoute module="promoCodes" action="add">
              <AddPromoCode />
            </PermissionProtectedRoute>
          } 
        />
        
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/normal" element={<NormalOrders />} />
        <Route path="orders/customizable" element={<CustomizableOrders />} />
        
        <Route path="/admin/contacts" element={<AdminContacts />} />

        <Route path="/admin/ai-management" element={<AIManagement />} />

        <Route path="/admin/sub-admins" element={<SubAdmins />} />
        <Route path="/admin/sub-admins/add" element={<AddSubAdmin />} />
        <Route path="/admin/sub-admins/edit/:id" element={<AddSubAdmin />} /> */}

        {/* <Route path="products/edit/:id" element={<EditProduct />} /> */}
      {/* </Route> */}
    </Routes>
  );
};

export default AllRoutes;
