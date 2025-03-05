import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

const OrderSchema = new mongoose.Schema(
  {
    OrderId: { type: Number, unique: true }, 
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    status: {
      type: String,
      enum: ["Ready to pick up", "Not approved yet", "Rejected", "Not ready","Delivered"],
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.plugin(AutoIncrement, { inc_field: "OrderId" });

export default mongoose.model("Order", OrderSchema);
