import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  /* =========================
     CHECK AUTH
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
      } catch {}
    };

    checkAuth();
  }, [setUser]);

  const firstName = user?.username?.split(" ")[0];

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate(window.location.reload());
  };

  return (
    <nav className="navbar">
      {/* LOGO */}

      <Link to="/" className="logo">
        <i className="fa-solid fa-bag-shopping logo-icon"></i>
        HubKart
      </Link>

      {/* SEARCH */}

      <div className="nav-search">
        <input placeholder="Search products..." />

        <button className="search-btn">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* RIGHT SIDE */}

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/user/login" className="nav-btn">
              Login
            </Link>

            <Link to="/user/register" className="nav-btn signup">
              Sign Up
            </Link>
          </>
        ) : (
          <div
            className="user-menu"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button className="nav-user">
              <i className="fa-solid fa-user"></i>
              {firstName}
            </button>

            {showMenu && (
              <div className="dropdown">
                <button onClick={() => navigate("/user/wishlist")}>
                  ❤️ My Wishlist
                </button>

                <button onClick={() => navigate("/user/cart")}>
                  🛒 My Cart
                </button>

                <button onClick={() => navigate("/user/orders")}>
                  📦 My Orders
                </button>

                <button onClick={() => navigate("/user/profile")}>
                  ⚙️ Profile
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
