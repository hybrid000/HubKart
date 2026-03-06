import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const { categoryName } = useParams();

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:5000/category/${categoryName}`,
        );

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return <div className="productlist-loading">Loading products…</div>;
  }

  if (error) {
    return <div className="productlist-error">{error}</div>;
  }

  if (!products || products.length === 0) {
    return (
      <section className="productlist-page">
        <h1 className="category-title">{categoryName}</h1>
        <p className="no-products">No products found.</p>
      </section>
    );
  }

  return (
    <section className="productlist-page">
      <h1 className="category-title">{categoryName}</h1>

      <div className="productlist-container">
        {products.map((product) => {
          const discount =
            product.price > product.discountedPrice
              ? Math.floor(
                  ((product.price - product.discountedPrice) / product.price) *
                    100,
                )
              : null;

          return (
            <Link
              to={`/product/${product._id}`}
              className="product-card"
              key={product._id}
            >
              <div className="product-image">
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
              </div>

              <div className="product-details">
                <h3 className="product-name">{product.productName}</h3>

                <div className="rating-row">
                  <span>{product.ratingsCount || 0} Ratings</span>
                  <span>•</span>
                  <span>{product.reviews?.length || 0} Reviews</span>
                </div>

                <div className="price-row">
                  <span className="price">₹{product.discountedPrice}</span>
                  {product.price && (
                    <span className="original-price">₹{product.price}</span>
                  )}
                  {discount && (
                    <span className="discount">{discount}% off</span>
                  )}
                </div>

                <p className="delivery-text">Free Delivery</p>

                <ul className="description-list">
                  {product.descriptionPoints?.slice(0, 3).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductList;
