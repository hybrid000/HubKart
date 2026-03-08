import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH WISHLIST
  ========================= */

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/wishlist", {
        credentials: "include",
      });

      const data = await res.json();
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error("Wishlist fetch failed:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* =========================
     REMOVE FROM WISHLIST
  ========================= */

  const removeWishlist = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/user/wishlist/${productId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Remove failed");

      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Wishlist remove failed:", err);
    }
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/user/cart/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Cart add failed");

      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  /* =========================
     STATES
  ========================= */

  if (loading) {
    return <div className="wishlist-loading">Loading...</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your wishlist is empty</h2>

        <Link to="/">
          <button className="shop-btn">Browse Products</button>
        </Link>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((product) => {
          const price = product.discountedPrice || product.price;

          return (
            <div className="wishlist-card" key={product._id}>
              <Link to={`/product/${product._id}`}>
                <img src={product.images?.[0]} alt={product.productName} />
              </Link>

              <h3>{product.productName}</h3>

              <p className="wishlist-price">₹{price}</p>

              <div className="wishlist-buttons">
                <button
                  className="cart-btn"
                  onClick={() => addToCart(product._id)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
