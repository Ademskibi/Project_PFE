import Order from "../models/Order.js";
import Product from "../models/Product.js";

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
    try {
        const { employeeId, departmentId, status, items } = req.body;

        if (!employeeId || !departmentId || !status || !items || items.length === 0) {
            return res.status(400).json({ message: "❌ All fields are required, including items." });
        }

        // ✅ Check if all products exist before saving
        for (let item of items) {
            const productExists = await Product.findById(item.productId);
            if (!productExists) {
                return res.status(400).json({ message: `❌ Product with ID ${item.productId} does not exist.` });
            }
        }

        // ✅ Auto-increment OrderId, no need to pass it manually
        const order = new Order({ employeeId, departmentId, status, items });
        await order.save();

        res.status(201).json({ message: "✅ Order created successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "❌ Error creating order", error: error.message });
    }
};

/**
 * Get all orders
 */
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("employeeId", "name")
            .populate("departmentId", "name")
            .populate("items.productId", "name");

        if (!orders.length) {
            return res.status(404).json({ message: "❌ No orders found" });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching orders", error: error.message });
    }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("employeeId", "name")
            .populate("departmentId", "name")
            .populate("items.productId", "name");

        if (!order) {
            return res.status(404).json({ message: "❌ Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching order", error: error.message });
    }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "❌ Status is required" });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "❌ Order not found" });
        }

        res.json({ message: "✅ Order status updated successfully!", order });
    } catch (error) {
        res.status(500).json({ message: "❌ Error updating order status", error: error.message });
    }
};

/**
 * Delete order
 */
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "❌ Order not found" });
        }

        res.json({ message: "✅ Order deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error deleting order", error: error.message });
    }
};
