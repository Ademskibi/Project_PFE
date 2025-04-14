import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder,getOrderByStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/orders", getAllOrders); 
router.get("/orders/:id", getOrderById); 
router.put("/orders/:id/status", updateOrderStatus); 
router.delete("/orders/:id", deleteOrder); 
router.get("/orders/status/:status", getOrderByStatus);

export default router;
