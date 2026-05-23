import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { auth } from "./config/auth.js";
import { attachSession, syncRoleToSession } from "./middleware/session.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/users.js";
import { serviceRouter } from "./routes/services.js";
import { orderRouter } from "./routes/orders.js";
import { contactRouter } from "./routes/contact.js";
import { toNodeHandler } from "better-auth/node";

export function buildApp() {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
    })
  );
  app.use(cookieParser());

  app.all("/api/auth/*splat", toNodeHandler(auth));

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (request, response) => {
    const dbConnected = mongoose.connection.readyState === 1;
    response.json({
      ok: dbConnected,
      message: dbConnected ? "Portfolio API is running" : "Portfolio API is running but database is disconnected",
      database: {
        status: dbConnected ? "connected" : "disconnected",
      },
    });
  });

  app.use("/auth", authRouter);
  app.use("/users", attachSession, syncRoleToSession, userRouter);
  app.use("/services", attachSession, syncRoleToSession, serviceRouter);
  app.use("/orders", attachSession, syncRoleToSession, orderRouter);
  app.use("/contact", contactRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
