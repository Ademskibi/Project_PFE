import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js"; // Adjust the path if needed

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname"; // Update with your DB name

const products = [
    {
        itemId: "P001",
        name: "Office Desk",
        categoryId: "67b85f8ad5afa5a6f826c1e4", // "Bureaux et Tables"
        quantity: 10,
        imgUrl: "https://via.placeholder.com/150",
    },
    {
        itemId: "P002",
        name: "Laptop",
        categoryId: "67b8602ae26cd0038db06156", // "Electronics"
        quantity: 20,
        imgUrl: "https://via.placeholder.com/150",
    },
    {
        itemId: "P003",
        name: "Smartphone",
        categoryId: "67b8602ae26cd0038db06156", // "Electronics"
        quantity: 15,
        imgUrl: "https://via.placeholder.com/150",
    },
    {
        itemId: "P004",
        name: "Office Chair",
        categoryId: "67b85f8ad5afa5a6f826c1e4", // "Bureaux et Tables"
        quantity: 8,
        imgUrl: "https://via.placeholder.com/150",
    },
    {
        itemId: "P005",
        name: "Tablet",
        categoryId: "67b8602ae26cd0038db06156", // "Electronics"
        quantity: 12,
        imgUrl: "https://via.placeholder.com/150",
    },
    {
        itemId: "P006",
        name: "Wireless Mouse",
        categoryId: "67b87031043d877630a13d78", // "New Category"
        quantity: 30,
        imgUrl: "https://via.placeholder.com/150",
    }
];

const insertProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        await Product.insertMany(products);
        console.log("🎉 Products inserted successfully!");

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error inserting products:", error);
        mongoose.connection.close();
    }
};

insertProducts();
