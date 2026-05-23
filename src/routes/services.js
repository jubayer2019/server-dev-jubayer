import express from "express";
import { Service } from "../models/Service.js";
import { asyncHandler } from "../utils/http.js";
import { requireAdmin } from "../middleware/session.js";

export const serviceRouter = express.Router();

serviceRouter.get(
  "/",
  asyncHandler(async (request, response) => {
    const services = await Service.find().sort({ createdAt: -1 });
    response.json({ services });
  })
);

serviceRouter.post(
  "/",
  requireAdmin,
  asyncHandler(async (request, response) => {
    const service = await Service.create(request.body);
    response.status(201).json({ service });
  })
);

serviceRouter.patch(
  "/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    const service = await Service.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    response.json({ service });
  })
);

serviceRouter.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (request, response) => {
    await Service.findByIdAndDelete(request.params.id);
    response.json({ message: "Service deleted" });
  })
);
