import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import PageTitle from '../../components/common/PageTitle'
import "./Home.css";

const Home = () => {
  /* =====================
     BACKEND-ALIGNED CATEGORIES (4)
  ===================== */
  const categories = [
    {
      name: "Laptops",
      image: "/resources/macbook-air.png",
      link: "/category/laptops",
    },
    {
      name: "Smartphones",
      image: "/resources/galaxy-s23.png",
      link: "/category/smartphones",
    },
    {
      name: "Tablets",
      image: "/resources/ipad-air.png",
      link: "/category/tablets",
    },
    {
      name: "Accessories",
      image: "/resources/logitech-mouse.png",
      link: "/category/accessories",
    },
  ];

  /* =====================
     SLIDER
  ===================== */
  const slides = [
    "/resources/slide0.png",
    "/resources/slide2.png",
    "/resources/slide3.png",
    "/resources/slide4.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="home">
      {/* CATEGORY SECTION */}
      <section className="categories">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          {categories.map((cat) => (
            <Link to={cat.link} className="category-card" key={cat.name}>
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SLIDER */}
      <section className="slider-wrapper">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((src, index) => (
            <div className="slide" key={index}>
              <img src={src} alt={`slide-${index}`} />
            </div>
          ))}
        </div>

        <button className="nav prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="nav next" onClick={nextSlide}>
          ›
        </button>
      </section>

      {/* BANNER */}

      <section className="banner">
        <Link to="/category/Tablets">
          <img src="/resources/general-banner.png" alt="Main banner" />
        </Link>
      </section>
      <section className="banner">
        <Link to="/category/Tablets">
          <img src="/resources/tablet-banner.png" alt="Main banner" />
        </Link>
      </section>

      <section className="banner">
        <Link to="/category/Tablets">
          <img src="/resources/accessories-banner.png" alt="Main banner" />
        </Link>
      </section>

      {/* TEXT */}
      <section className="info">
        <p>
          Discover top electronics at JustBuy — laptops, mobiles, tablets and
          accessories at the best prices.
        </p>
      </section>
    </div>
  );
};

export default Home;
