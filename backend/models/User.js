import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['administrator', 'storekeeper', 'manager', 'employee','D_Rh'], required: true },
   departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

export default mongoose.model("User", UserSchema); 
