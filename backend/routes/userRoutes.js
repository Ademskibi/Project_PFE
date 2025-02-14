import express from "express";
import { getAllUsers, createUser , deleteUser , getUsersByRole}  from "../controllers/userController.js";

const router = express.Router();


router.get("/users", getAllUsers);
router.post("/crate_user", createUser);
router.delete("/delete",deleteUser);
router.get("/role",getUsersByRole)
export default router;
