import express, { Router } from "express";
import { getCategories, getCategoryById, createCategory, deleteCategory , updateCategory} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/category/:id", getCategoryById);
router.post("/create-category", createCategory);
router.delete("/delete-category/:id", deleteCategory);
router.put("/update-category/:id", updateCategory);

export default router;
