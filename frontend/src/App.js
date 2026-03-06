import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import Product from "./pages/Product/Product";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Register";
import Profile from "./pages/User/Profile";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* CATEGORY PRODUCT LIST */}
        <Route
          path="/category/:categoryName"
          element={<ProductList />}
        />

        {/* SINGLE PRODUCT */}
        <Route
          path="/product/:productId"
          element={<Product />}
        />

        {/* AUTH ROUTES */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<SignUp />} />
        <Route path="/user/profile" element={<Profile />} />
    
      </Routes>

      <Footer />
    </>
  );
}

export default App;