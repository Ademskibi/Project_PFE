import express from "express";
import { getAllUsers, createUser, deleteUser, getUserById ,getUsersByRole, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getAllUsers); // Fetch all users
router.post("/create-user", createUser); // Create new user
router.delete("/delete", deleteUser); // Delete user
router.get("/role", getUsersByRole); // Get users by role
router.put("/update-user", updateUser); // Update user details
router.get("/user/:userId", getUserById);
export default router;
