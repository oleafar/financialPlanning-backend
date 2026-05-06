export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function ensureResource(resource, message = "Resource not found") {
  if (!resource) {
    throw new AppError(message, 404);
  }
}
