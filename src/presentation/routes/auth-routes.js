import { Router } from "express";
import * as authController from "../controllers/auth-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { loginSchema, registerSchema } from "./schemas.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), asyncHandler(authController.register));
router.post("/login", validateRequest(loginSchema), asyncHandler(authController.login));

export default router;
