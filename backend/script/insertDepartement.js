import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Department from "../models/Department.js"; // Assurez-vous que le modèle est bien défini

dotenv.config();

connectDB();

const insertDepartments = async () => {
  try {
    const departments = [
      { departmentId: "1", name: "Direction Centrale Ressources" },
      { departmentId: "2", name: "Direction Centrale des Opérations Nouvelles" },
      { departmentId: "3", name: "Direction Centrale Technique" },
      { departmentId: "4", name: "Direction Centrale Finance" },
      { departmentId: "5", name: "Division Exploration" },
      { departmentId: "6", name: "Division Production" },
      { departmentId: "7", name: "Direction Stratégies et Planification" },
      { departmentId: "8", name: "Direction Affaires Juridiques" },
      { departmentId: "9", name: "Direction Informatique" },
      { departmentId: "10", name: "Direction Ressources Humaines (D_Rh)" },
      { departmentId: "11", name: "Direction Contrôle de Gestion" },
      { departmentId: "12", name: "Direction Financière" }
    ];

    const insertedDepartments = await Department.insertMany(departments);
    console.log("✅ Departments Inserted:", insertedDepartments);
  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertDepartments();
