import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Department from "../models/Department.js"; // Utiliser un nom approprié

dotenv.config();

connectDB();
const insertDepartement = async () => {
  try {
    const newDepartment = await Department.create({
        departmentId: "3",
        name: "comptabilite"
    });

    console.log("✅ Department Inserted:", newDepartment);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
  mongoose.connection.close();
  }
};
insertDepartement()