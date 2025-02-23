import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Corrected category reference
    quantity: { type: Number, required: true, min: 0 },
    imgUrl: { type: String }, // Stores Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
