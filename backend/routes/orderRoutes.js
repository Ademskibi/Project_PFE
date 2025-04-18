import express from "express";
import { createOrder, getAllOrders, Create_Waiting_List_Order,remove_Order_Item  ,getOrdersByEmployeeId, updateOrderStatus, deleteOrder,getOrderByStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/orders", getAllOrders); 
router.get("/orders/employee/:employeeId", getOrdersByEmployeeId);
router.put("/orders/:id/status", updateOrderStatus); 
router.delete("/orders/:id", deleteOrder); 
router.get("/orders/status/:status", getOrderByStatus);
router.post("/waiting/:orderId/:productId", Create_Waiting_List_Order );
router.delete("/remove-item/:orderId/:productId", remove_Order_Item);

export default router;
