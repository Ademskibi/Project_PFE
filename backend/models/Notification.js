import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    dateSent: { type: Date, default: Date.now },
    type: { type: String, required: true }
});

export default mongoose.model('Notification', NotificationSchema);
