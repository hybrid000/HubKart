import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Product.css";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/product/${productId}`);

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();

        setProduct(data.product);
        setCurrentImg(data.product.images?.[0]);

        // If user logged in → check cart & wishlist status
        if (user) {
          const statusRes = await fetch(
            `http://localhost:5000/user/product-status/${productId}`,
            { credentials: "include" },
          );

          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setInCart(statusData.inCart);
            setInWishlist(statusData.inWishlist);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user]);

  /* =========================
     ADD TO CART
  ========================= */
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (inCart) {
      navigate("/user/cart");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/user/cart/${product._id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to add to cart");

      setInCart(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     TOGGLE WISHLIST
  ========================= */
  const handleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/user/wishlist/${product._id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Wishlist update failed");

      const data = await res.json();
      setInWishlist(data.inWishlist);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     STATES
  ========================= */

  if (loading) return <div className="product-loading">Loading…</div>;
  if (error) return <div className="product-error">{error}</div>;
  if (!product) return null;

  const discount =
    product.price > product.discountedPrice
      ? Math.floor(
          ((product.price - product.discountedPrice) / product.price) * 100,
        )
      : null;

  return (
    <section className="product-page">
      {/* LEFT SIDE */}
      <div className="product-left">
        <div className="main-image">
          <img
            src={currentImg}
            alt={product.productName}
            onError={(e) => (e.target.src = "/no-image.png")}
          />
        </div>

        {product.images?.length > 1 && (
          <div className="thumbnail-row">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                onClick={() => setCurrentImg(img)}
                className={currentImg === img ? "active" : ""}
              />
            ))}
          </div>
        )}

        <div className="action-buttons">
          <button className="cart-btn" onClick={handleAddToCart}>
            {inCart ? "Go to Cart" : "Add to Cart"}
          </button>

          <button className="wishlist-btn" onClick={handleWishlist}>
            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {!user && (
          <p className="login-hint">
            Login required to add to cart, wishlist or post reviews
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="product-right">
        <p className="breadcrumb">
          <Link to="/">Home</Link> /{" "}
          <Link to={`/category/${product.category?.categoryName}`}>
            {product.category?.categoryName}
          </Link>
        </p>

        <h1 className="product-title">{product.productName}</h1>

        <div className="price-box">
          <span className="price">₹{product.discountedPrice}</span>

          {product.price && (
            <span className="original-price">₹{product.price}</span>
          )}

          {discount && <span className="discount">{discount}% off</span>}
        </div>

        <div className="rating-info">
          <span>{product.ratingsCount || 0} Ratings</span>
          <span> • </span>
          <span>{product.reviews?.length || 0} Reviews</span>
        </div>

        <p className="shipping">Free Delivery</p>

        {product.offers?.length > 0 && (
          <>
            <h3>Available Offers</h3>
            <ul className="offer-list">
              {product.offers.map((offer, i) => (
                <li key={i}>{offer}</li>
              ))}
            </ul>
          </>
        )}

        <div className="description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        {/* REVIEWS */}
        <div className="review-section">
          <h3>Write a Review</h3>

          <textarea
            placeholder={
              user ? "Write your review here" : "Login to write a review"
            }
            disabled={!user}
          ></textarea>

          <button disabled={!user} className="review-btn">
            Submit Review
          </button>

          <h3>User Reviews</h3>

          {product.reviews?.length > 0 ? (
            product.reviews.map((rev, i) => (
              <div className="review-card" key={i}>
                <p className="review-user">{rev.user?.username || "User"}</p>
                <p>{rev.review}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Product;
