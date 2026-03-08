import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ======================
     FORM CHANGE
  ====================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     OTP TIMER
  ====================== */

  const startCooldown = () => {
    setCooldown(30);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* ======================
     SEND OTP
  ====================== */

  const sendOTP = async () => {
    setError("");

    if (!formData.email) {
      setError("Enter email first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setOtpSent(true);
      startCooldown();
    } catch {
      setError("Failed to send OTP");
    }
  };

  /* ======================
     REGISTER
  ====================== */

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          username: `${formData.firstName} ${formData.lastName}`,
          otp,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }

      const authRes = await fetch("http://localhost:5000/auth/me", {
        credentials: "include",
      });

      const userData = await authRes.json();

      setUser(userData);

      navigate("/");
    } catch {
      setError("Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
          />

          <div className="auth-row">
            <input
              name="lastName"
              placeholder="Last Name"
              required
              onChange={handleChange}
            />

            <select name="gender" onChange={handleChange} required>
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            minLength="8"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          {/* SEND OTP */}

          {!otpSent && (
            <button type="button" className="auth-button" onClick={sendOTP}>
              Send OTP
            </button>
          )}

          {/* OTP FIELD */}

          {otpSent && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              {cooldown > 0 ? (
                <p className="otp-timer">Resend OTP in {cooldown}s</p>
              ) : (
                <button type="button" className="resend-btn" onClick={sendOTP}>
                  Resend OTP
                </button>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Registering..." : "Verify & Register"}
              </button>
            </>
          )}
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/user/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
