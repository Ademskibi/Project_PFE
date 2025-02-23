import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    dateSent: { type: Date, default: Date.now },
    type: { 
        type: String, 
        enum: ["approve", "reject"], 
        required: true 
    }
});

export default mongoose.model("Notification", NotificationSchema);
