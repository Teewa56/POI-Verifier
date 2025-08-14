const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.DATABASE_URL;

const connectDB = async() => {
    try {
        await mongoose.connect(URI)
    } catch (error) {
        console.log('Error connecting to database: ', error);
        process.exit(1);
    }
}

module.exports = connectDB;