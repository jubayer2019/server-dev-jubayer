import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
