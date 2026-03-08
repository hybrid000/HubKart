import React, { useState, useEffect } from "react";
import "../styles/wishcart.css";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/cart", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.products);
          setTotalPrice(data.totalPrice);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/updatecart/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.products);
        setTotalPrice(data.totalPrice);
      } else {
        console.error("Error updating quantity:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityChange = (productId, action) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.product._id === productId) {
        const newQuantity =
          action === "increment" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);

    const itemToUpdate = updatedCartItems.find(
      (item) => item.product._id === productId
    );
    if (itemToUpdate) {
      updateQuantity(productId, itemToUpdate.quantity);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/deletecart/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setCartItems(
          cartItems.filter((item) => item.product._id !== productId)
        );
        setTotalPrice(data.totalPrice);
      } else {
        console.error("Error deleting item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>No products in cart</h3>
          <p>Your cart is currently empty. Browse our products to add items.</p>
        </div>
      ) : (
        <div className="productz">
          {cartItems.map((cartItem) => (
            <div
              key={cartItem.product._id}
              className="product-container"
              data-product-id={cartItem.product._id}
            >
              <a href={`/product/${cartItem.product._id}`}>
                <img
                  src={cartItem.product.imagePath}
                  className="laptop"
                  width="13rem"
                  alt={cartItem.product.productName}
                />
              </a>
              <div className="product-info">
                <a href={`/product/${cartItem.product._id}`}>
                  <h4 className="headinG">{cartItem.product.productName}</h4>
                </a>
                <h4
                  className="productPrice"
                  data-discounted-price={cartItem.product.discountedPrice}
                >
                  ₹
                  {(
                    cartItem.product.discountedPrice * cartItem.quantity
                  ).toFixed(2)}
                </h4>
                <h5>Free Delivery</h5>

                <div className="qty-and-btn">
                  <div className="quantity-control">
                    <label htmlFor="number">Set Quantity</label>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(cartItem.product._id, "decrement")
                      }
                      data-action="decrement"
                      data-product-id={cartItem.product._id}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      id={`quantity_${cartItem.product._id}`}
                      value={cartItem.quantity}
                      readOnly
                    />
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        handleQuantityChange(cartItem.product._id, "increment")
                      }
                      data-action="increment"
                      data-product-id={cartItem.product._id}
                    >
                      +
                    </button>
                  </div>
                  <button
                    id="del-btn"
                    onClick={() => handleDeleteItem(cartItem.product._id)}
                  >
                    <i className="fa-solid fa-trash"></i>Delete Item from cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="total">
            <h2>Total Cart: ₹{totalPrice.toFixed(2)}</h2>
          </div>
          <div className="checkout-btn">
            <h2>
              <a href="/buy">Checkout</a>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
