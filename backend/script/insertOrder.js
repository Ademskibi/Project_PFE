import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js"; // Ensure the correct path to your Order model

dotenv.config();

const orders = [
  {
    employeeId: "67bc38ef1f20d27bccc731eb", // Example user ID
    departmentId: "67b6e90506feba5829071f01", // Example department ID
    status: "Not approved yet",
    items: [
      { productId: "67bd92f05e76de82ea962ef5", quantity: 2 },
      { productId: "67bd92f05e76de82ea962ef6", quantity: 1 },
    ],
  },
  {
    employeeId: "67bc39801f20d27bccc731f7",
    departmentId: "67b6e90506feba5829071f01",
    status: "Ready to pick up",
    items: [
      { productId: "67bd92f05e76de82ea962ef7", quantity: 3 },
      { productId: "67bd92f05e76de82ea962ef8", quantity: 1 },
    ],
  },
];

const insertOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const insertedOrders = await Order.insertMany(orders);
    console.log("Orders inserted:", insertedOrders);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting orders:", error);
    mongoose.connection.close();
  }
};

insertOrders();