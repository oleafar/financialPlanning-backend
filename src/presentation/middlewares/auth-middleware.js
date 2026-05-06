import { verifyToken } from "../../application/use-cases/auth/auth-use-cases.js";
import { AppError } from "../../shared/errors.js";

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Authentication token missing", 401));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError("Invalid authentication token", 401));
  }
}
