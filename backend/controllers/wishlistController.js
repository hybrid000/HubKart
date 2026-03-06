const User = require("../models/user")
const mongoose = require("mongoose");


const getWishlist = async (req, res) => {
    try {
     
            const userId = req.user._id;

            const foundUser = await User.findById(userId).populate({
                path: 'wishlist',
                model: 'Product',
            });

            const productsInWishlist = foundUser.wishlist;

            // Map over products and include image paths
            const productsWithImages = productsInWishlist.map(element => ({
                ...element.toObject(),
                imagePath: `/resources/products/${element._id}/img1.png`,
            }));

            // Respond with JSON data
            res.status(200).json({ products: productsWithImages });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const addToWishlist = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const userId = req.user._id;
            const userFound = await User.findById(userId);
            const productId = req.params.productId;

            // Check if the product already exists in the wishlist
            const isProductInWishlist = userFound.wishlist.includes(productId);

            if (!isProductInWishlist) {
                // If the product is not in the wishlist, add it
                userFound.wishlist.push(productId)
                await userFound.save();
                res.json({ message: 'Product added to wishlist' });
            }
            else {
                // If the product is already in the wishlist, remove it
                await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } }); // Fix: Use userFound instead of User
                res.json({ message: 'Removed from wishlist' });
            }
        } else {

            res.redirect('/user/login');
        }
    } catch (error) {
        console.error('Error adding/removing product to/from wishlist:', error);
        res.status(500).send('Internal Server Error');
    }
};



const wishlistCheck = async (req, res) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const productId = req.params.productId;

        // Check if the product already exists in the wishlist
        const isProductInWishlist = user.wishlist.includes(productId);

        console.log(isProductInWishlist)

        // Return the result as JSON 
        res.json({ isProductInWishlist });

    } catch (error) {
        console.error('Error checking wishlist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteWishlist=async (req, res)=>{

}




module.exports={wishlistCheck,getWishlist, addToWishlist};