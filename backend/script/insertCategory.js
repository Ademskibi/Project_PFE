import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

dotenv.config();

connectDB();

const insertCategory = async () => {
  try {
    const categories = [
      { categoryId: "1", name: "paper" },
      { categoryId: "2", name: "stylo" },
      { categoryId: "3", name: "recharge" }
    ];

    const insertedCategories = await Category.insertMany(categories);
    console.log("✅ Categories Inserted:", insertedCategories);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertCategory();
