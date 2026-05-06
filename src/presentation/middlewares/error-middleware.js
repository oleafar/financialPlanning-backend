import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors.js";

export function errorMiddleware(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const map = {
      P2002: { statusCode: 409, message: "Unique constraint violation" },
      P2003: { statusCode: 409, message: "Operation blocked by related records" },
      P2025: { statusCode: 404, message: "Resource not found" },
    };

    const mapped = map[error.code] ?? {
      statusCode: 500,
      message: "Database error",
    };

    return res.status(mapped.statusCode).json({
      success: false,
      message: mapped.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
