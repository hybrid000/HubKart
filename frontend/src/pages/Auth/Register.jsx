import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = useRef([]);

  /* ======================
     FORM INPUT
  ====================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
     PASSWORD STRENGTH
  ====================== */

  const getPasswordStrength = (password) => {
    if (!password) return "";

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "weak";
    if (score === 2 || score === 3) return "medium";
    return "strong";
  };

  const strength = getPasswordStrength(formData.password);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
     OTP INPUT HANDLER
  ====================== */

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const otpCode = otp.join("");

  /* ======================
     REGISTER
  ====================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      setError("Enter valid OTP");
      return;
    }

    setLoading(true);
    setError("");

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
          otp: otpCode,
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
    <div className="auth-container">
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
          <input
            name="lastName"
            placeholder="Last Name"
            required
            onChange={handleChange}
          />

          <select name="gender" required onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              minLength="8"
              onChange={handleChange}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* PASSWORD STRENGTH */}
          {formData.password && (
            <div className={`password-strength ${strength}`}>{strength}</div>
          )}

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
          />

          {/* SEND OTP */}
          {!otpSent && (
            <button type="button" className="auth-btn" onClick={sendOTP}>
              Send OTP
            </button>
          )}

          {/* OTP INPUT */}
          {otpSent && (
            <>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                  />
                ))}
              </div>

              {cooldown > 0 ? (
                <p className="otp-timer">Resend OTP in {cooldown}s</p>
              ) : (
                <button type="button" className="resend-btn" onClick={sendOTP}>
                  Resend OTP
                </button>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Registering..." : "Verify & Register"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
