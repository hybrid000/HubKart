const mongoose = require("mongoose");

/* ======================
   REVIEW SCHEMA
====================== */
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        review: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

/* ======================
   PRODUCT SCHEMA
====================== */
const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
        },

        descriptionPoints: [String],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },

        price: {
            type: Number,
            required: true,
        },

        discountedPrice: {
            type: Number,
        },

        offers: [String],
        images: [
            {
                type: String, // S3 / CDN URLs
                required: true,
            },
        ],

        stock: {
            type: Number,
            required: true,
            default: 0,
        },

        warranty: {
            type: String,
        },

        stripePriceId: {
            type: String,
            index: true,
        },

        reviews: [reviewSchema],

        ratingsAverage: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        ratingsCount: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

/* ======================
   INDEXES
====================== */
productSchema.index({ productName: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);