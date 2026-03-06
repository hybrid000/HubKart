// backend/seed/category.seed.js
const mongoose = require('mongoose');

const connectDB = require('../connectDB');
const Category = require('../models/category');

const categories = [
    {
        categoryName: 'Laptops',
        categoryDescription: 'Desktops, Laptops, Monitors, and more',
    },
    {
        categoryName: 'Smartphones',
        categoryDescription: 'Latest smartphones from top brands',
    },
    {
        categoryName: 'Tablets',
        categoryDescription: 'Tablets for work, study, and entertainment',
    },
    {
        categoryName: 'Accessories',
        categoryDescription: 'All kinds of accessories: headphones, chargers, keyboards',
    },
];

const seedCategories = async () => {
    try {
        await connectDB();

        // Insert new categories
        const inserted = await Category.insertMany(categories);
        console.log(`✅ ${inserted.length} categories seeded successfully`);

    } catch (error) {
        console.error('❌ Error seeding categories:', error);
    } finally {
        mongoose.connection.close();
        console.log('🔒 DB connection closed');
    }
};

seedCategories();