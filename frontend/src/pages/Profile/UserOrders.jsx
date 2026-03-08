import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"; // Import Helmet for managing the document head
import "../styles/wishcart.css"; // Import CSS file
import "../styles/orders.css"; // Import CSS file

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    // Fetch orders data from the backend
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/orders", {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrders(data);
      } 
      catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders."); // Set error state
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <div className="order-container">
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
        {orders.length === 0 ? (
          <h3>No orders available. Place one!</h3>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order">
              <h5>Order Id: OD{order._id}</h5>
              <h5>Ordered On: {order.orderDate}</h5>
              <h5>Status: {order.orderStatus}</h5>
              <h5>Payment Method: {order.paymentMethod}</h5>
              <h5>Payment: {order.paymentStatus}</h5>

              {order.orderedProducts.map((orderItem) => (
                <div key={orderItem.product._id} className="orderbox">
                  <a
                    href={`/product/${orderItem.product._id}`}
                    className="order-product"
                  >
                    <img
                      src={orderItem.product.imagePath}
                      alt=""
                      className="order-img"
                    />
                    <h5>{orderItem.product.productName}</h5>
                  </a>
                  <h5>Quantity: {orderItem.quantity}</h5>
                </div>
              ))}

              <div className="address">
                <h5>Address:</h5>
                <h6>{order.address.streetOne}</h6>
                <h6>{order.address.streetTwo}</h6>
                <h6>
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </h6>
              </div>

              <div className="payment-method">
                <h5>Payment Method: {order.paymentMethod}</h5>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserOrders;
