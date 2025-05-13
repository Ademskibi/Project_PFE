import express from "express";
import { getAdminStats ,getUserStats } from "../controllers/statsController.js";

const router = express.Router();

router.get("/", getAdminStats);
router.get("/user/:id", getUserStats);

export default router;
