const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../connectDB");
const Product = require("../models/product");
const Category = require("../models/category");

const seedProducts = async () => {
    try {
        await connectDB();

        const categories = await Category.find({
            categoryName: { $in: ["Laptops", "Smartphones", "Tablets", "Accessories"] },
        });

        if (!categories.length) {
            console.log("❌ No categories found");
            process.exit(1);
        }

        const getCategoryId = (name) =>
            categories.find((c) => c.categoryName === name)._id;

        const s3 = "https://hubkart-bucket.s3.ap-south-1.amazonaws.com/products";

        const products = [
            {
                productName: "Apple MacBook Air M1",
                slug: "apple-macbook-air-m1",
                description: "Powerful, lightweight MacBook with Apple M1 chip.",
                descriptionPoints: [
                    "13.3 inch Retina Display",
                    "Apple M1 Chip",
                    "Up to 18 hours battery",
                ],
                category: getCategoryId("Laptops"),
                price: 120990,
                discountedPrice: 117900,
                offers: ["No Cost EMI"],
                images: [
                    `${s3}/apple-macbook-air-m1/main.png`,
                    `${s3}/apple-macbook-air-m1/1.png`,
                    `${s3}/apple-macbook-air-m1/2.png`,
                    `${s3}/apple-macbook-air-m1/3.png`,
                ],
                stock: 50,
                warranty: "1 Year Manufacturer Warranty",
            },

            {
                productName: "Samsung Galaxy S23",
                slug: "samsung-galaxy-s23",
                description: "Flagship Samsung smartphone with high-end specs.",
                descriptionPoints: [
                    "6.1 inch AMOLED",
                    "Snapdragon 8 Gen 2",
                    "Triple Camera Setup",
                ],
                category: getCategoryId("Smartphones"),
                price: 79999,
                discountedPrice: 74999,
                offers: ["No Cost EMI", "Exchange Offer"],
                images: [
                    `${s3}/samsung-galaxy-s23/main.png`,
                    `${s3}/samsung-galaxy-s23/1.png`,
                    `${s3}/samsung-galaxy-s23/2.png`,
                    `${s3}/samsung-galaxy-s23/3.png`,
                ],
                stock: 100,
                warranty: "1 Year Manufacturer Warranty",
            },

            {
                productName: "Apple iPad Air",
                slug: "apple-ipad-air",
                description: "Lightweight tablet with powerful performance.",
                descriptionPoints: [
                    "10.9 inch Liquid Retina Display",
                    "A14 Bionic Chip",
                    "Touch ID",
                ],
                category: getCategoryId("Tablets"),
                price: 54999,
                discountedPrice: 52999,
                offers: ["No Cost EMI"],
                images: [
                    `${s3}/apple-ipad-air/main.png`,
                    `${s3}/apple-ipad-air/1.png`,
                    `${s3}/apple-ipad-air/2.png`,
                    `${s3}/apple-ipad-air/3.png`,
                ],
                stock: 75,
                warranty: "1 Year Manufacturer Warranty",
            },

            {
                productName: "Logitech Wireless Mouse",
                slug: "logitech-wireless-mouse",
                description: "Ergonomic wireless mouse for comfortable usage.",
                descriptionPoints: [
                    "Wireless Connectivity",
                    "Long Battery Life",
                    "Compact Design",
                ],
                category: getCategoryId("Accessories"),
                price: 2499,
                discountedPrice: 1999,
                offers: ["No Cost EMI"],
                images: [
                    `${s3}/logitech-wireless-mouse/main.png`,
                    `${s3}/logitech-wireless-mouse/1.png`,
                    `${s3}/logitech-wireless-mouse/2.png`,
                    `${s3}/logitech-wireless-mouse/3.png`,
                ],
                stock: 200,
                warranty: "6 Months Manufacturer Warranty",
            },
        ];

        await Product.deleteMany({});
        console.log("🗑️ Existing products cleared");

        await Product.insertMany(products);
        console.log("✅ Products seeded with multiple images");

        process.exit(0);
    } catch (error) {
        console.error("❌ Product seed failed:", error);
        process.exit(1);
    }
};

seedProducts();