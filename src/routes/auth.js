import express from "express";
import bcrypt from "bcryptjs";
import { auth } from "../config/auth.js";
import { User } from "../models/User.js";
import { applyAuthHeaders, asyncHandler } from "../utils/http.js";

export const authRouter = express.Router();

authRouter.post(
  "/register",
  asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;

    const { headers, response: authResponse } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: { name, email, password },
    });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    applyAuthHeaders(response, headers);

    response.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      session: authResponse,
    });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return response.status(401).json({ message: "Invalid credentials" });
    }

    const { headers, response: authResponse } = await auth.api.signInEmail({
      returnHeaders: true,
      body: { email, password },
    });

    applyAuthHeaders(response, headers);

    response.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, image: user.image },
      session: authResponse,
    });
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (request, response) => {
    const { headers, response: authResponse } = await auth.api.signOut({
      returnHeaders: true,
      headers: request.headers,
    });

    applyAuthHeaders(response, headers);
    response.json({ message: "Logged out", session: authResponse });
  })
);

authRouter.get(
  "/session",
  asyncHandler(async (request, response) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return response.json({ session: null });
    }

    const normalizedEmail = session.user.email.toLowerCase();
    const fallbackName = normalizedEmail.split("@")[0];
    const profile = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          name: session.user.name || fallbackName,
          image: session.user.image || "",
          authUserId: session.user.id || "",
        },
        $setOnInsert: {
          email: normalizedEmail,
          password: "",
          role: "user",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    response.json({
      session: {
        ...session,
        user: {
          ...session.user,
          role: profile?.role || session.user.role || "user",
          image: profile?.image || session.user.image || "",
        },
      },
    });
  })
);
