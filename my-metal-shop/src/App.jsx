import React from "react";
import { Route, Routes } from "react-router-dom";
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartProvider } from './context/CartContext';

import Navebar from "./pages/Navebar";
import Footer from "./pages/Footer-Section/footer";
import HomePage from "./HomePage/HomePage";
import UserProfile from "./pages/User-Profile/UserProfile";
import OrderPage from "./pages/Order_Page/Order_Page";
import FilteredProductsPage from "./pages/Product-Section/FilteredProductsPage";
import HelpPage from "./pages/Help_Pages/Help_Page";
import LoginPage from "./Login_Page/LoginPage";
import RegisterPage from "./Login_Page/RegisterPage";
import ForgotPasswordPage from "./Login_Page/ForgotPasswordPage";

import AdminMain from "./AdminMain";
import AdminDashboard from "./AdminPages/AdminDashBoard/AdminDashBoard";
import Product from "./AdminPages/Product/Product";
import Users from "./AdminPages/Users/Users";
import Orders from "./AdminPages/Orders/Orders";
import Messages from "./AdminPages/Messages/Messages";
import Logout from "./AdminPages/Logout";
import AdminAddProduct from "./AdminPages/Product/AdminAddProduct";
import EditProduct from "./AdminPages/Product/EditProduct";
import UserCart from "./pages/cart_section/user_cart";
import UpdateUserProfile from "./pages/User-Profile/UpdateUserProfile";
import PaymentDetails from "./pages/Order_Page/PaymentDetails";
import PlacedOrder from "./pages/Order_Page/PlacedOrder";
import MyOrders from "./pages/Order_Page/MyOrders";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<FilteredProductsPage />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/userCart" element={<UserCart />} />
        <Route path="/updateuserprofile" element={<UpdateUserProfile />} />
        <Route path="/paymentDetails" element={<PaymentDetails />} />
        <Route path="/placed-order" element={<PlacedOrder />} />
        <Route path="/myOrders" element={<MyOrders />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminMain />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="logout" element={<LoginPage/>} />
          <Route path="addProduct" element={<AdminAddProduct />} />
          <Route path="editProduct" element={<EditProduct />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;


// ****************************************** ADMINE PAGE ********************************************

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import AdminDashBoard from "./AdminPages/AdminDashBoard/AdminDashBoard"; // Admin Dashboard component
// import Product from "./AdminPages/Product/Product"; // Products management component
// import Users from "./AdminPages/Users/Users"; // Users management component
// import Orders from "./AdminPages/Orders/Orders"; // Orders management component
// import Messages from "./AdminPages/Messages/Messages"; // Contact Messages component
// import Logout from "./AdminPages/Logout";

// function App() {
//   return (
//     <>
//       <Routes>
//       <Route path="/" element={<AdminDashBoard />} />
//        <Route path="/products" element={<Product />} />
//         <Route path="/users" element={<Users />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/messages" element={<Messages />} />
//         <Route path="/logout" element={<Logout />} /> 
//       </Routes>
      
      
//     </>
//   );
// }

// export default App;
