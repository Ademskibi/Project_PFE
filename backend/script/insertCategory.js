import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js"; // Utiliser un nom approprié
import Product from "../models/Product.js";

dotenv.config();

connectDB();
const insertCategory = async () => {
  try {
    const newCategory =await Category.create({
        categoryId: "2", 
        name:"Electronics",
       items:['67adb2905e0f538159678505']
    });

    console.log("✅ product Inserted:", newCategory);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
  mongoose.connection.close();
  }
};
insertCategory()