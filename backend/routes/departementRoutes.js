import express from "express";
import {  getAllDepartments,  getADepartment,  createDepartment,  deleteDepartment,} from "../controllers/departementController.js";

const router = express.Router();

router.get("/departments", getAllDepartments);
router.get("/department", getADepartment);
router.post("/create-department", createDepartment);
router.delete("/delete", deleteDepartment);

export default router;
