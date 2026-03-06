const fs = require('fs').promises;
const path = require('path');
const Product = require("../models/product");
const Category = require("../models/category");

const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId).populate("category");

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        /* =====================
           RATINGS & REVIEWS
        ===================== */

        const numberOfRatings = product.reviews.length;

        const numberOfReviews = product.reviews.filter(
            (r) => r.review && r.review.trim() !== ""
        ).length;

        const totalRating = product.reviews.reduce(
            (sum, r) => sum + (r.rating || 0),
            0
        );

        const averageRating =
            numberOfRatings > 0
                ? Number((totalRating / numberOfRatings).toFixed(1))
                : 0;

        /* =====================
           IMAGE HANDLING (S3)
        ===================== */

        // You already store S3 URLs in DB
        // product.images = [ "https://hubkart-bucket.s3..." ]

        const images = product.images || [];

        /* =====================
           RESPONSE
        ===================== */

        res.json({
            product,
            images,
            numberOfRatings,
            numberOfReviews,
            averageRating,
        });
    } catch (error) {
        console.error("GET PRODUCT ERROR:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
        });
    }
};

// controller/productController.js

const getProductList = async (req, res) => {
    try {
        const { slug } = req.params;

        // 🔥 FIND BY SLUG (NOT NAME)
        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                slug,
            });
        }

        const products = await Product.find({
            category: category._id,
            isActive: true,
        });

        res.json({
            categoryName: category.categoryName,
            products,
        });
    } catch (error) {
        console.error("ProductList Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



const postReviews = async (req, res) => {
    try {

        if(req.isAuthenticated()){

        const productId = req.params.productId;
        const { rating, reviewText } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const newReview = {
            user: req.userame,
            rating,
            review: reviewText,
            reviewDate: new Date(),
        };

        product.reviews.push(newReview);
        await product.save();

        res.status(200).json({ product });

    }
    else{
        res.readdir('/user/login')
    }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};



const searchProducts= async (searchTerm)=>{
    try {
        // Search by product name
        const productsByName = await Product.find({ productName: { $regex: searchTerm, $options: 'i' } }).populate('category');

        // Search by category name
        const category = await Category.findOne({ categoryName: { $regex: searchTerm, $options: 'i' } });
        const productsByCategory = category ? await Product.find({ category: category._id }).populate('category') : [];

        // Combine and return the results
        const combinedResults = [...productsByName, ...productsByCategory];
   
        return combinedResults;
    } catch (error) {
        console.error(error);
        throw new Error('Search failed');
    }
}

module.exports = { getProductList, getProduct, postReviews, searchProducts };
