const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../config/db");
const User = require("../models/User"); // Ensure this is correctly imported

beforeAll(async () => {
    //process.env.MONGO_URI = process.env.TEST_DB_URI; // Ensure it uses the test DB
     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event_test');


    // Create a test user
    global.testUser = await User.create({ 
        name: "Test User", 
        email: "test@example.com", 
        password: "password123" 
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase(); // Clear test data
    await disconnectDB();
});
