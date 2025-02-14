import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    quantity: { type: Number, required: true, min: 0 } 
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
