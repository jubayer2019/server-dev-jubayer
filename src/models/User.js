import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    image: { type: String, default: "" },
    authUserId: { type: String, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
