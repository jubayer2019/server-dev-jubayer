import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";
const authSecret = process.env.BETTER_AUTH_SECRET || "dev-only-secret-change-before-deploy";
const authBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:5000/api/auth";
const trustedOrigins = [
  process.env.CLIENT_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
  "http://localhost:3001",
]
  .filter(Boolean)
  .map((origin) => origin.trim());
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const mongoClient = new MongoClient(mongoUri);
const database = mongoClient.db();

export const auth = betterAuth({
  baseURL: authBaseUrl,
  secret: authSecret,
  database: mongodbAdapter(database, { client: mongoClient }),
  trustedOrigins,
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          prompt: "select_account",
        },
      }
    : {},
  session: {
    cookie: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      image: {
        type: "string",
        required: false,
      },
    },
  },
});
