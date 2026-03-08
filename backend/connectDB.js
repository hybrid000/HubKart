const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ MongoDB Connected (Atlas)');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.log(process.env.MONGO_URI)
        process.exit(1);
    }
};

module.exports = connectDB;
