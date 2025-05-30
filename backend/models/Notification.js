import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    dateSent: { type: Date, default: Date.now },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    type: { 
        type: String, 
        enum: ["approve", "reject","ready to pick up","wainting"], 
        required: true 
    }
});

export default mongoose.model("Notification", NotificationSchema);
