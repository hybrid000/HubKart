const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const cartController = require("../controllers/cartController");
const wishlistController = require("../controllers/wishlistController");

const protect = require("../middlewares/auth");

/* =========================
   PRODUCT STATUS
========================= */

router.get(
   "/product-status/:productId",
   protect,
   userController.getProductStatus
);

/* =========================
   WISHLIST
========================= */

router.get(
   "/wishlist",
   protect,
   wishlistController.getWishlist
);
router.post(
   "/wishlist/:productId",
   protect,
   wishlistController.toggleWishlist
);

/* =========================
   CART
========================= */

router.get(
   "/cart",
   protect,
   cartController.getCart
);

router.post(
   "/cart/:productId",
   protect,
   cartController.addToCart
);

router.patch(
   "/cart/:productId",
   protect,
   cartController.updateCart
);

router.delete(
   "/cart/:productId",
   protect,
   cartController.removeFromCart
);

module.exports = router;