import { Router } from "express";
import * as walletController from "../controllers/wallet-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { idOnlySchema, walletCreateSchema, walletUpdateSchema } from "./schemas.js";

const router = Router();

router.post("/", validateRequest(walletCreateSchema), asyncHandler(walletController.create));
router.get("/", asyncHandler(walletController.list));
router.patch("/:id", validateRequest(walletUpdateSchema), asyncHandler(walletController.update));
router.delete("/:id", validateRequest(idOnlySchema), asyncHandler(walletController.remove));

export default router;
