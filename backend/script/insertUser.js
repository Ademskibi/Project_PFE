import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import bcrypt from "bcrypt";
import User from "../models/User.js";
import Department from "../models/Department.js";

console.log("MONGO_URI:", process.env.TZ.
);  // Log the value of MONGO_URI

const MONGO_URI = process.env.MONGO_URI;
const insertUser = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Vérifier si un département existe et récupérer son ID
    const department = await Department.findOne({ name: "Direction Contrôle de Gestion" });
    if (!department) {
      console.error("❌ Aucun département trouvé !");
      return;
    }

    // Inserting multiple users
    const users = [
      {
        userId: "admin123",
        name: "Admin User",
        email: "admin@example.com",
        password: "administrator",
        role: "administrator",
        departmentId: "67b6e90506feba5829071efd"
      },
      {
        userId: "storekeeper123",
        name: "Storekeeper User",
        email: "storekeeper@example.com",
        password: "storekeeper",
        role: "storekeeper",
        departmentId: "67b6e90506feba5829071efe"
      },
      {
        userId: "manager123",
        name: "Manager User",
        email: "manager@example.com",
        password: "manager",
        role: "manager",
        departmentId: "67b6e90506feba5829071eff"
      },
      {
        userId: "employee123",
        name: "Employee User",
        email: "employee@example.com",
        password: "employee",
        role: "employee",
        departmentId: "67b6e90506feba5829071f01"
      },
      {
        userId: "drh123",
        name: "D_Rh User",
        email: "drh@example.com",
        password: "D_Rh",
        role: "D_Rh",
        departmentId: "67b6e90506feba5829071f00"
      }
    ];

    // Hash passwords for each user and insert them into the DB
    const hashedUsers = [];
    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);  // Hash password
      hashedUsers.push({ ...user, password: hashedPassword });  // Add hashed password
    }

    // Insert all users at once
    await User.insertMany(hashedUsers);

    console.log("✅ Multiple Users Inserted:", hashedUsers);

  } catch (error) {
    console.error("❌ Insert Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertUser();
