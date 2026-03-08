import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import Product from "./pages/Product/Product";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";

import RequireAuth from "./components/auth/RequireAuth";
import PageWrapper from "./components/common/PageWrapper";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <PageWrapper title="Home">
              <Home />
            </PageWrapper>
          }
        />

        {/* CATEGORY */}

        <Route
          path="/category/:categoryName"
          element={
            <PageWrapper title="Products">
              <ProductList />
            </PageWrapper>
          }
        />

        {/* PRODUCT */}

        <Route
          path="/product/:productId"
          element={<Product />}
        />

        {/* AUTH */}

        <Route
          path="/user/login"
          element={
            <PageWrapper title="Login">
              <Login />
            </PageWrapper>
          }
        />

        <Route
          path="/user/register"
          element={
            <PageWrapper title="Register">
              <Register />
            </PageWrapper>
          }
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/user/profile"
          element={
            <RequireAuth>
              <PageWrapper title="My Profile">
                <Profile />
              </PageWrapper>
            </RequireAuth>
          }
        />

        <Route
          path="/user/cart"
          element={
            <RequireAuth>
              <PageWrapper title="My Cart">
                <Cart />
              </PageWrapper>
            </RequireAuth>
          }
        />

        <Route
          path="/user/wishlist"
          element={
            <RequireAuth>
              <PageWrapper title="Wishlist">
                <Wishlist />
              </PageWrapper>
            </RequireAuth>
          }
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;