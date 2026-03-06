import React, { useContext, useEffect, useState } from "react";
import "../styles/productList.css"; // Ensure the CSS file is imported
import { AuthContext } from "../../context/AuthContext";

const UserWishlist = () => {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const wishlistResponse = await fetch(
            `http://localhost:5000/user/wishlist`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json();
            if (Array.isArray(wishlistData.products)) {
              setProducts(wishlistData.products); // Access the products array
            } else {
              console.error(
                "Expected an array but got:",
                wishlistData.products
              );
              setProducts([]); // Set an empty array if the response isn't as expected
            }
          } else {
            console.error("Failed to fetch wishlist");
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      }
    };

    fetchWishlist();
  }, [user]); // Run the effect whenever `user` changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div id="layer2">
        {!products || products.length === 0 ? (
          <h3>No products in wishlist</h3>
        ) : (
          <div className="productz">
            {products.map((product) => (
              <a href={`/product/${product._id}`} key={product._id}>
                <div className="product-container">
                  <img
                    src={product.imagePath}
                    className="laptop"
                    width="13rem"
                    alt={product.productName}
                  />
                  <div className="product-info">
                    <button>
                      <i className="fa-solid fa-heart fa-xl"></i>
                    </button>
                    <h4>{product.productName}</h4>
                    <div className="rev">
                      {/* Star ratings and other information can go here */}
                    </div>
                    <h4>
                      <i className="fa fa-inr"></i>
                      {product.discountedPrice}
                    </h4>
                    <h5 className="disc">{product.productPrice}</h5>
                    <h5 className="disc1">
                      {(
                        ((product.productPrice - product.discountedPrice) /
                          product.productPrice) *
                        100
                      ).toFixed(2)}
                      % off
                    </h5>
                    <h5>Free Delivery</h5>
                    <ul>
                      {product.descriptionPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserWishlist;
