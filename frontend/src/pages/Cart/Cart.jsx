import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH CART
  ========================= */

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/user/cart", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await res.json();

      setCart(data.cart || []);
    } catch (err) {
      console.error("Cart fetch failed:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* =========================
     UPDATE QUANTITY
  ========================= */

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/user/cart/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        throw new Error("Cart update failed");
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item,
        ),
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/user/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Remove failed");
      }

      setCart((prev) => prev.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  /* =========================
     CALCULATE TOTAL
  ========================= */

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discountedPrice || item.product.price;

    return total + price * item.quantity;
  }, 0);

  /* =========================
     STATES
  ========================= */

  if (loading) {
    return <div className="cart-loading">Loading cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>

        <Link to="/">
          <button className="shop-btn">Shop Now</button>
        </Link>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-container">
        {/* CART ITEMS */}

        <div className="cart-items">
          {cart.map((item) => {
            const product = item.product;

            const price = product.discountedPrice || product.price;

            return (
              <div className="cart-item" key={product._id}>
                {/* IMAGE */}

                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="cart-img"
                />

                {/* INFO */}

                <div className="cart-info">
                  <Link
                    to={`/product/${product._id}`}
                    className="cart-product-name"
                  >
                    {product.productName}
                  </Link>

                  <p className="cart-price">₹{price}</p>
                </div>

                {/* QUANTITY */}

                <div className="cart-qty">
                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}

                <button
                  className="cart-remove"
                  onClick={() => removeItem(product._id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
