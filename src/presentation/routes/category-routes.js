import { Router } from "express";
import * as categoryController from "../controllers/category-controller.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { categoryCreateSchema, categoryUpdateSchema, idOnlySchema } from "./schemas.js";

const router = Router();

router.post("/", validateRequest(categoryCreateSchema), asyncHandler(categoryController.create));
router.get("/", asyncHandler(categoryController.list));
router.patch("/:id", validateRequest(categoryUpdateSchema), asyncHandler(categoryController.update));
router.delete("/:id", validateRequest(idOnlySchema), asyncHandler(categoryController.remove));

export default router;
