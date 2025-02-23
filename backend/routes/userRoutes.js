import express from "express";
import { getAllUsers, createUser , deleteUser , getUsersByRole,updateUser}  from "../controllers/userController.js";

const router = express.Router();


router.get("/users", getAllUsers);
router.post("/create-user", createUser);
router.delete("/delete",deleteUser);
router.get("/role",getUsersByRole);
router.put("/update-user",updateUser);
export default router;
