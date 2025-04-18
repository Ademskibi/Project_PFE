import Order from "../models/Order.js";
import Product from "../models/Product.js";

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
    try {
        const { employeeId, departmentId, status, items } = req.body;

        if (!employeeId || !departmentId || !status || !items ) {
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


export const getOrderByStatus = async (req, res) => {
    try {
        const status = decodeURIComponent(req.params.status); // ✅ Decode URL-encoded status
        console.log("Searching for status:", status);

        const orders = await Order.find({ status })
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
export const getOrdersByEmployeeId = async (req, res) => {
    try {
        const orders = await Order.find({ employeeId: req.params.employeeId })
            .populate("employeeId", "name")
            .populate("departmentId", "name")
            .populate("items.productId", "name");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "❌ No orders found for this employee" });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching orders", error: error.message });
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
export const Create_Waiting_List_Order = async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "❌ Order not found" });
        }

        // Find the ordered item
        const item = order.items.find(
            i => i.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "❌ Item not found in order" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        

        const waitingQty = item.quantity;

        const waitingOrder = new Order({
            employeeId: order.employeeId,
            departmentId: order.departmentId,
            status: "Waiting list",
            items: [
                {
                    productId: productId,
                    quantity: waitingQty,
                }
            ]
        });

        await waitingOrder.save();

        res.status(201).json({
            message: "✅ Over-ordered item detected and waiting list order created",
            originalItem: item,
            waitingOrder
        });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
};
export const remove_Order_Item = async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "❌ Order not found" });
        }

        const originalLength = order.items.length;

        // Remove item
        order.items = order.items.filter(
            (item) => item.productId.toString() !== productId
        );

        if (order.items.length === originalLength) {
            return res.status(404).json({ message: "❌ Item not found in the order" });
        }

        await order.save();

        res.status(200).json({
            message: "✅ Item removed from order successfully!",
            order
        });

    } catch (error) {
        res.status(500).json({ message: "❌ Error removing item from order", error: error.message });
    }
};
