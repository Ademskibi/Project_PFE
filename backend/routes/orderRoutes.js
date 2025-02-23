import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getAllOrders); 
router.get("/orders/:id", getOrderById); 
router.put("/orders/:id/status", updateOrderStatus); 
router.delete("/orders/:id", deleteOrder); 

export default router;
