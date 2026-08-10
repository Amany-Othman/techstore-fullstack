import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import products from "./data/product.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);

dotenv.config();
console.log(process.env.MONGO_URI);

try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Delete all existing products
    await Product.deleteMany({});

    // Insert sample products
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");

    // Close database connection
    await mongoose.connection.close();

    // Exit successfully
    process.exit(0);

} catch (error) {

    console.error("❌ Error seeding database:", error);

    // Close connection if it was opened
    await mongoose.connection.close();

    // Exit with failure
    process.exit(1);
}