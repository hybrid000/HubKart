import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        {/* Logo */}
        <div className="footer-column logo">
          <img
            src="/resources/logofooter.png"
            alt="Site Logo"
            className="logo-img"
          />
        </div>

        {/* Contact */}
        <div className="footer-column contact">
          <h4>Contact</h4>
          <p>
            Rudrapur, Udham Singh Nagar,
            <br />
            Uttarakhand - 263153, India
          </p>
          <p>Phone: +91 696969696</p>
        </div>

        {/* Social */}
        <div className="footer-column social">
          <h4>Social</h4>
          <ul className="footer-links">
            <li>
              <Link to="#">
                <i className="fa-brands fa-instagram"></i> Instagram
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-facebook"></i> Facebook
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-brands fa-twitter"></i> Twitter
              </Link>
            </li>
          </ul>
        </div>

        {/* About */}
        <div className="footer-column about">
          <h4>About</h4>
          <ul className="footer-links">
            <li>
              <Link to="#">About Us</Link>
            </li>
            <li>
              <Link to="#">Privacy Policy</Link>
            </li>
            <li>
              <Link to="#">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* App / Payment */}
        <div className="footer-column app">
          <h4>Install Our App</h4>
          <div className="app-store">
            <Link to="#">
              <img
                src="/resources/gpay.png"
                alt="Google Play Store"
                className="store-link"
              />
            </Link>
            <Link to="#">
              <img
                src="/resources/appstore.png"
                alt="Apple App Store"
                className="store-link"
              />
            </Link>
          </div>
          <div className="pay">
            <img src="/resources/pay.png" alt="Payment Methods" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; HubKart 2023. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
