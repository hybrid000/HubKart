const User = require("../models/user");

/* =========================
   GET CART
========================= */

exports.getCart = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .populate("cart.product");

        res.json({
            cart: user.cart
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

/* =========================
   ADD TO CART
========================= */

exports.addToCart = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        const productId = req.params.productId;

        const existing = user.cart.find(
            item => item.product.toString() === productId
        );

        if (existing) {

            existing.quantity += 1;

        } else {

            user.cart.push({
                product: productId,
                quantity: 1
            });

        }

        await user.save();

        res.json({
            success: true,
            message: "Cart updated"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Cart update failed"
        });

    }

};
/* =========================
   UPDATE QUANTITY
========================= */

exports.updateCart = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        const productId = req.params.productId;
        const { quantity } = req.body;

        const item = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not in cart"
            });
        }

        item.quantity = quantity;

        await user.save();

        res.json({
            success: true,
            cart: user.cart
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Cart update failed"
        });

    }

};

/* =========================
   REMOVE ITEM
========================= */

exports.removeFromCart = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        const productId = req.params.productId;

        user.cart = user.cart.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        res.json({
            success: true,
            cart: user.cart
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Remove failed"
        });

    }

};