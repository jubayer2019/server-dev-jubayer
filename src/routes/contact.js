import express from "express";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/http.js";
import { sendContactEmail } from "../utils/mail.js";

export const contactRouter = express.Router();

contactRouter.post(
  "/",
  asyncHandler(async (request, response) => {
    const message = await Message.create(request.body);

    let emailSent = false;
    try {
      await sendContactEmail(message);
      emailSent = true;
    } catch (error) {
      console.error("Contact email delivery failed:", error.message);
    }

    response.status(201).json({
      message: emailSent ? "Thanks for reaching out" : "Thanks for reaching out, but email delivery is not configured",
      emailSent,
      data: message,
    });
  })
);
