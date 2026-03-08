import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import "./Product.css";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  /* =========================
FETCH PRODUCT
========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/product/${productId}`);
        const data = await res.json();

        setProduct(data.product);
        setCurrentImg(data.product.images?.[0]);

        if (user) {
          const statusRes = await fetch(
            `http://localhost:5000/user/product-status/${productId}`,
            { credentials: "include" },
          );

          const statusData = await statusRes.json();

          setInCart(statusData.inCart);
          setInWishlist(statusData.inWishlist);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load product");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId, user]);

  /* =========================
ADD TO CART
========================= */

  const handleCart = async () => {
    if (!user) {
      navigate("/user/login", { state: { from: location.pathname } });
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

      if (!res.ok) throw new Error();

      setInCart(true);
    } catch (err) {
      console.error("Cart failed", err);
    }
  };

  /* =========================
WISHLIST TOGGLE
========================= */

  const toggleWishlist = async () => {
    if (!user) {
      navigate("/user/login", { state: { from: location.pathname } });
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

      const data = await res.json();

      if (!res.ok) throw new Error();

      setInWishlist(data.inWishlist);
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };

  /* =========================
SUBMIT REVIEW
========================= */

  const submitReview = async () => {
    if (!user) {
      navigate("/user/login", { state: { from: location.pathname } });
      return;
    }

    try {
      await fetch(`http://localhost:5000/product/${productId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rating,
          review: reviewText,
        }),
      });

      window.location.reload();
    } catch (err) {
      console.error("Review failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return null;

  const discount =
    product.price > product.discountedPrice
      ? Math.floor(
          ((product.price - product.discountedPrice) / product.price) * 100,
        )
      : null;

  return (
    <section className="product-page">
      <Helmet>
        <title>{product.productName} | HubKart</title>
      </Helmet>

      {/* LEFT */}

      <div className="product-left">
        <div className="main-image">
          <button
            className={`wishlist-heart ${inWishlist ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            <i className="fa-solid fa-heart"></i>
          </button>

          <img src={currentImg} alt={product.productName} />
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

        <button className="cart-btn" onClick={handleCart}>
          {inCart ? "Already in your cart: Go to your cart" : "Add to Cart"}
        </button>
      </div>

      {/* RIGHT */}

      <div className="product-right">
        <p className="breadcrumb">
          <Link to="/">Home</Link> /
          <Link to={`/category/${product.category?.categoryName}`}>
            {product.category?.categoryName}
          </Link>
        </p>

        <h1>{product.productName}</h1>

        <div className="price-box">
          <span className="price">₹{product.discountedPrice}</span>

          {product.price && (
            <span className="original-price">₹{product.price}</span>
          )}

          {discount && <span className="discount">{discount}% off</span>}
        </div>

        <div className="rating-info">
          <span>{product.ratingsAverage?.toFixed(1) || 0} ⭐</span>
          <span>•</span>
          <span>{product.ratingsCount || 0} Ratings</span>
        </div>

        <p className="shipping">Free Delivery</p>

        {/* OFFERS */}

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

        {/* DESCRIPTION */}

        <div className="description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        {/* REVIEWS */}

        <div className="review-section">
          <h3>Reviews ({product.reviews?.length || 0})</h3>

          <button
            className="cart-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write Review
          </button>

          {showReviewForm && (
            <div className="review-form">
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-solid fa-star ${rating >= star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>

              <textarea
                placeholder="Write review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <button className="cart-btn" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          )}

          {product.reviews?.length > 0 ? (
            product.reviews.map((rev, i) => (
              <div className="review-card" key={i}>
                <strong>{rev.user?.username || "User"}</strong>
                <div>{"⭐".repeat(rev.rating)}</div>
                <p>{rev.review}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Product;
