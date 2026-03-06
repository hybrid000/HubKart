const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

/* =========================
   GET PRODUCTS BY CATEGORY
========================= */
router.get("/category/:slug", productController.getProductList);

/* =========================
   SIMPLE HOMEPAGE CHECK
========================= */
router.get("/", (req, res) => {
    res.json({ message: "Welcome to HubKart API 🚀" });
});

module.exports = router;