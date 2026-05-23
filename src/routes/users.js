import express from "express";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/http.js";
import { requireAdmin } from "../middleware/session.js";

export const userRouter = express.Router();

userRouter.get(
  "/",
  requireAdmin,
  asyncHandler(async (request, response) => {
    const users = await User.find().sort({ createdAt: -1 });
    response.json({ users });
  })
);

userRouter.patch(
  "/role/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    const { role } = request.body;
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { role },
      { new: true }
    );

    response.json({ user: updatedUser });
  })
);

userRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    await User.findByIdAndDelete(request.params.id);
    response.json({ message: "User removed" });
  })
);
