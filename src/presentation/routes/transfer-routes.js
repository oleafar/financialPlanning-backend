import { Router } from "express";
import * as transferController from "../controllers/transfer-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { transferCreateSchema } from "./schemas.js";

const router = Router();

router.post("/", validateRequest(transferCreateSchema), asyncHandler(transferController.create));

export default router;
