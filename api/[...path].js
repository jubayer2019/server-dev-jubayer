import { buildApp } from "../src/app.js";
import { connectDatabaseWithFallback } from "../src/config/db.js";

const app = buildApp();
let databaseConnectionPromise;

function ensureDatabaseConnection() {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = connectDatabaseWithFallback(process.env.MONGODB_URI, process.env.MONGODB_FALLBACK_URI);
  }

  return databaseConnectionPromise;
}

export default async function handler(request, response) {
  await ensureDatabaseConnection();

  if (request.url?.startsWith("/api/")) {
    request.url = request.url.replace(/^\/api/, "") || "/";
  } else if (request.url === "/api") {
    request.url = "/";
  }

  return app(request, response);
}