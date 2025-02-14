import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    categoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] // Array of product references
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);
