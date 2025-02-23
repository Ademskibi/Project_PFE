import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    departmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Department", DepartmentSchema);
