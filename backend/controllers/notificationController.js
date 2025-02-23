import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import User from "../models/User.js";

// 📌 Create a new notification
export const createNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;

        if (!userId || !message || !["approve", "reject"].includes(type)) {
            return res.status(400).json({ success: false, message: "❌ Invalid input. Type must be 'approve' or 'reject'." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "❌ User not found" });
        }

        const newNotification = new Notification({ userId, message, type });
        await newNotification.save();

        res.status(201).json({ success: true, message: "✅ Notification created successfully", notification: newNotification });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to create notification", error: error.message });
    }
};

// 📌 Get all notifications
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate("userId", "name email");
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to retrieve notifications", error: error.message });
    }
};

// 📌 Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Validate if userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "❌ Invalid user ID format" });
        }

        const notifications = await Notification.find({ userId }).sort({ dateSent: -1 });

        if (!notifications.length) {
            return res.status(404).json({ success: false, message: "No notifications found for this user" });
        }

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to retrieve notifications", error: error.message });
    }
};
// 📌 Get notifications by type
export const getNotificationsByType = async (req, res) => {
    try {
        const { type } = req.params;

        if (!["approve", "reject"].includes(type)) {
            return res.status(400).json({ success: false, message: "❌ Invalid type. Must be 'approve' or 'reject'." });
        }

        const notifications = await Notification.find({ type }).sort({ dateSent: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to retrieve notifications", error: error.message });
    }
};

// 📌 Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: "❌ Notification not found" });
        }

        res.status(200).json({ success: true, message: "✅ Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to delete notification", error: error.message });
    }
};
