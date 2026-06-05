import { buildApp } from "../src/app.js";

const app = buildApp();

export default function handler(request, response) {
  if (request.url?.startsWith("/api/")) {
    request.url = request.url.replace(/^\/api/, "") || "/";
  } else if (request.url === "/api") {
    request.url = "/";
  }

  return app(request, response);
}