const User = require("../models/user");
exports.getProductStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const productId = req.params.productId;

        const inWishlist = user.wishlist.some(
            (item) => item.toString() === productId
        );

        const inCart = user.cart.some(
            (item) => item.product.toString() === productId
        );

        res.json({
            inCart,
            inWishlist,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch status" });
    }
};