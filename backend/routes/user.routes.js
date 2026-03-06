const express = require('express');
const router = express.Router();

const cartAndorderController = require("../controllers/cartController.js");
const wishlistController = require("../controllers/wishlistController");
const userController = require("../controllers/userController");

const protect = require('../middlewares/auth');

router.get(
   "/product-status/:productId",
   protect,
   userController.checkProductStatus
);

router.post(
   "/wishlist/:productId",
   protect,
   userController.toggleWishlist
);
// router.post('/cart/:productId', protect, cartAndorderController.addToCart);
// router.get('/cart', protect, cartAndorderController.getCart);
// router.patch('/updatecart/:productId', protect, cartAndorderController.updateCart);
// router.delete('/deletecart/:productId', protect, cartAndorderController.deleteCartItem);

/* =========================
   USER WISHLIST
========================= */

router.get('/wishlist', protect, wishlistController.getWishlist);
router.post('/wishlist/:productId', protect, wishlistController.addToWishlist);

/* =========================
   USER ORDERS
========================= */

// router.get("/orders", protect, cartAndorderController.getOrders);

module.exports = router;