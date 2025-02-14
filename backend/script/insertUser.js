import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

dotenv.config();

const insertUser = async () => {
  try {
    await connectDB(); // Assure-toi que la connexion est établie

    // Vérifier si un département existe et récupérer son ID
    const department = await Department.findOne({ name: "informatique" });
    if (!department) {
      console.error("❌ Aucun département trouvé !");
      return;
    }

    // Créer l'utilisateur avec un ObjectId valide
    const newUser = await User.create({
      userId: "s69",
      name: "John Adams",
      email: "john@example.com",
      password: "securepassword",
      role: "administrator",
      departmentId: department._id, // Utilisation correcte d'un ObjectId
    });

    console.log("✅ User Inserted:", newUser);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertUser();
