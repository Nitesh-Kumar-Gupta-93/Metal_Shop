import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Users from "./AdminPages/Users/Users";
import Orders from "./AdminPages/Orders/Orders";
import Messages from "./AdminPages/Messages/Messages";
import Logout from "./AdminPages/Logout";
import AdminDashboard from "./AdminPages/AdminDashBoard/AdminDashBoard";
import Product from "./AdminPages/Product/Product";
import LoginPage from "./Login_Page/LoginPage";
import AdminAddProduct from "./AdminPages/Product/AdminAddProduct";

function AdminMain() {
  return (
    <>
      {/* This layout component lets nested routes render below */}
      <Outlet />

      <Routes>
        {/* <Route path="/" element={<AdminDashboard />} />
        <Route path="products" element={<Product />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="messages" element={<Messages />} />
        <Route path="logout" element={<LoginPage />} /> */}
        {/* <Route path="addProduct" element={<AdminAddProduct />} /> */}
      </Routes>
    </>
  );
}

export default AdminMain;
