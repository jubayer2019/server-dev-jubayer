export function notFound(request, response) {
  response.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || "Internal server error";

  response.status(statusCode).json({ message });
}
