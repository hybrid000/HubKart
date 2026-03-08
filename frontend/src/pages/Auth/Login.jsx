import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  // redirect destination
  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     REGISTER USER
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      /* =========================
         CONFIRM LOGIN
      ========================= */

      const authRes = await fetch("http://localhost:5000/auth/me", {
        credentials: "include",
      });

      if (authRes.ok) {
        const userData = await authRes.json();

        setUser(userData);

        console.log("User registered and logged in:", userData);
      }

      /* =========================
         REDIRECT BACK
      ========================= */

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/user/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
