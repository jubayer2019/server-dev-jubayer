import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { attachSession, syncRoleToSession } from "./middleware/session.js";
import { errorHandler, notFound } from "./middleware/error.js";

import { userRouter } from "./routes/users.js";
import { serviceRouter } from "./routes/services.js";
import { orderRouter } from "./routes/orders.js";
import { contactRouter } from "./routes/contact.js";

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = [process.env.CLIENT_URL, process.env.NEXT_PUBLIC_APP_URL].filter(Boolean).map((value) => value.trim());

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

  if (/^http:\/\/localhost:\d+$/i.test(origin)) {
    return true;
  }

  return false;
}


export function buildApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked for origin ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(cookieParser());

  

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

  
  app.use("/users", attachSession, syncRoleToSession, userRouter);
  app.use("/services", attachSession, syncRoleToSession, serviceRouter);
  app.use("/orders", attachSession, syncRoleToSession, orderRouter);
  app.use("/contact", contactRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
