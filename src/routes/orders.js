import express from "express";
import { Order } from "../models/Order.js";
import { asyncHandler } from "../utils/http.js";
import { requireAdmin, requireAuth } from "../middleware/session.js";

export const orderRouter = express.Router();

orderRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const query = request.profile?.role === "admin" ? {} : { userEmail: request.session.user.email };
    const orders = await Order.find(query).populate("serviceId").sort({ createdAt: -1 });
    response.json({ orders });
  })
);

orderRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const order = await Order.create({
      userEmail: request.session.user.email,
      serviceId: request.body.serviceId,
      status: request.body.status || "Pending",
      paymentStatus: request.body.paymentStatus || "Unpaid",
    });

    response.status(201).json({ order });
  })
);

orderRouter.patch(
  "/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    const order = await Order.findByIdAndUpdate(request.params.id, request.body, { new: true });
    response.json({ order });
  })
);

orderRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    await Order.findByIdAndDelete(request.params.id);
    response.json({ message: "Order deleted" });
  })
);
