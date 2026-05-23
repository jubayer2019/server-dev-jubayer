import dotenv from "dotenv";
dotenv.config();

import { buildApp } from "./app.js";
import { connectDatabaseWithFallback } from "./config/db.js";

const port = process.env.PORT || 5000;
const app = buildApp();

let databaseConnected = false;

try {
  await connectDatabaseWithFallback(process.env.MONGODB_URI, process.env.MONGODB_FALLBACK_URI);
  databaseConnected = true;
} catch (error) {
  console.error("Database connection failed. Server will start, but database-backed routes may fail.");
  console.error(error?.message || error);
}

app.locals.databaseConnected = databaseConnected;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Database status: ${databaseConnected ? "connected" : "disconnected"}`);
});
