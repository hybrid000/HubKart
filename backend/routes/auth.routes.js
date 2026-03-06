const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middlewares/auth");

/* =========================
   AUTH ROUTES
========================= */
router.post("/send-otp", authController.sendOTP);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

/* Logged in user info */
router.get("/me", protect, (req, res) => {
    res.json({
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
    });
});
module.exports = router;