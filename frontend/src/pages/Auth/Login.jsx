import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { fetchAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      await fetchAuthStatus();
      navigate("/");
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <>
    

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtext">Login to access your cart and wishlist</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input">
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-input">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <Link to="/user/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
