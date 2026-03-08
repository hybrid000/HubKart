const User = require("../models/user");

/* =========================
   GET WISHLIST
========================= */

exports.getWishlist = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .populate(
                "wishlist",
                "productName price discountedPrice images"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            wishlist: user.wishlist
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch wishlist"
        });

    }

};

/* =========================
   TOGGLE WISHLIST
========================= */

exports.toggleWishlist = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const productId = req.params.productId;

        const index = user.wishlist.findIndex(
            (item) => item.toString() === productId
        );

        let inWishlist;

        if (index === -1) {

            user.wishlist.push(productId);
            inWishlist = true;

        } else {

            user.wishlist.splice(index, 1);
            inWishlist = false;

        }

        await user.save();

        res.json({
            success: true,
            inWishlist
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Wishlist update failed"
        });

    }

};