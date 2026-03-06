const User = require("../models/user");

/* =========================
   ADD TO CART
========================= */
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const user = await User.findById(userId);

        const existingItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            return res.status(200).json({
                message: "Product already in cart",
                alreadyInCart: true,
            });
        }

        user.cart.push({
            product: productId,
            quantity: 1,
        });

        await user.save();

        res.status(200).json({
            message: "Product added to cart",
            alreadyInCart: false,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add to cart" });
    }
};

/* =========================
   TOGGLE WISHLIST
========================= */
exports.toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const user = await User.findById(userId);

        const index = user.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        if (index > -1) {
            user.wishlist.splice(index, 1);
            await user.save();

            return res.status(200).json({
                message: "Removed from wishlist",
                inWishlist: false,
            });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({
            message: "Added to wishlist",
            inWishlist: true,
        });
    } catch (err) {
        res.status(500).json({ message: "Wishlist update failed" });
    }
};

/* =========================
   CHECK PRODUCT STATUS
========================= */
exports.checkProductStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const { productId } = req.params;

        const inCart = user.cart.some(
            (item) => item.product.toString() === productId
        );

        const inWishlist = user.wishlist.some(
            (id) => id.toString() === productId
        );

        res.json({ inCart, inWishlist });
    } catch (err) {
        res.status(500).json({ message: "Status check failed" });
    }
};