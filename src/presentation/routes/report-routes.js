import { Router } from "express";
import * as reportController from "../controllers/report-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { reportQuerySchema } from "./schemas.js";

const router = Router();

router.get("/summary", validateRequest(reportQuerySchema), asyncHandler(reportController.summary));
router.get("/by-category", validateRequest(reportQuerySchema), asyncHandler(reportController.byCategory));
router.get("/by-period", validateRequest(reportQuerySchema), asyncHandler(reportController.byPeriod));

export default router;
