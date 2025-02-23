import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js"; // Utiliser un nom approprié
import Product from "../models/Product.js";

dotenv.config();

connectDB();
const insertProduct = async () => {
  try {
    const newProduct = await Product.create({
          itemId: "15", 
          name:"test",
          categoryId:"1" ,
          quantity: 10
       
    });

    console.log("✅ product Inserted:", newProduct);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
  mongoose.connection.close();
  }
};
insertProduct()