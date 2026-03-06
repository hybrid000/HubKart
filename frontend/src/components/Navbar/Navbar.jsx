import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  /* =========================
     CHECK AUTH ON LOAD
  ========================= */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, [setUser]);

  /* =========================
     PROTECTED ROUTES
  ========================= */

  const handleProtectedClick = (path) => {
    if (!user) {
      navigate("/user/login");
    } else {
      navigate(path);
    }
  };

  const firstName = user?.username?.split(" ")[0];

  return (
    <nav className="navbar">
      {/* LOGO */}

      <div className="navbar-logo">
        <Link to="/">
          <img src="/resources/logo.png" alt="HubKart Logo" />
        </Link>
      </div>

      {/* SEARCH */}

      <div className="navbar-search">
        <input type="text" placeholder="Search products, brands..." />
        <button>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* LINKS */}

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/user/login" className="nav-link">
              Login
            </Link>

            <Link to="/user/register" className="nav-link">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            className="nav-user"
            onClick={() => navigate("/user/profile")}
          >
            <i className="fa-solid fa-user"></i>
            <span>{firstName}</span>
          </button>
        )}

        {/* CART */}

        <button
          onClick={() => handleProtectedClick("/user/cart")}
          className="nav-icon"
        >
          <i className="fa-solid fa-cart-shopping"></i>
        </button>

        {/* WISHLIST */}

        <button
          onClick={() => handleProtectedClick("/user/wishlist")}
          className="nav-icon"
        >
          <i className="fa-regular fa-heart"></i>
        </button>

        {/* ORDERS */}

        <button
          onClick={() => handleProtectedClick("/user/orders")}
          className="nav-icon"
        >
          <i className="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
