import { Router } from "express";
import * as transactionController from "../controllers/transaction-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  idOnlySchema,
  transactionCreateSchema,
  transactionListSchema,
  transactionUpdateSchema,
} from "./schemas.js";

const router = Router();

router.post("/", validateRequest(transactionCreateSchema), asyncHandler(transactionController.create));
router.get("/", validateRequest(transactionListSchema), asyncHandler(transactionController.list));
router.patch("/:id", validateRequest(transactionUpdateSchema), asyncHandler(transactionController.update));
router.delete("/:id", validateRequest(idOnlySchema), asyncHandler(transactionController.remove));

export default router;
