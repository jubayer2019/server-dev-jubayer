import express from "express";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/http.js";

export const contactRouter = express.Router();

contactRouter.post(
  "/",
  asyncHandler(async (request, response) => {
    const message = await Message.create(request.body);
    response.status(201).json({ message: "Thanks for reaching out", data: message });
  })
);
