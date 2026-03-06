const bcrypt = require("bcryptjs");
const User = require("../models/user");
const OTP = require("../models/otp");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

/* =========================
   SEND OTP
========================= */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const otp = generateOTP();

        await OTP.deleteMany({ email });

        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await sendOTPEmail(email, otp);

        res.json({ message: "OTP sent to email" });

    } catch (err) {
        console.error("OTP error:", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

/* =========================
   REGISTER WITH OTP
========================= */
exports.register = async (req, res) => {
    try {
        const { username, email, password, otp } = req.body;

        if (!username || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields including OTP required" });
        }

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.create({
            username: username.trim(),
            email: normalizedEmail,
            password,
            isEmailVerified: true,
        });

        await OTP.deleteMany({ email });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
};

/* =========================
   LOGOUT
========================= */
exports.logout = (req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged out successfully" });

};