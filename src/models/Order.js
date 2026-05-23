import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
