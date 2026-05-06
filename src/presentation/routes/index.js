import { Router } from "express";
import authRoutes from "./auth-routes.js";
import categoryRoutes from "./category-routes.js";
import reportRoutes from "./report-routes.js";
import transactionRoutes from "./transaction-routes.js";
import transferRoutes from "./transfer-routes.js";
import walletRoutes from "./wallet-routes.js";
import { authenticate } from "../middlewares/auth-middleware.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

router.use("/auth", authRoutes);
router.use("/wallets", authenticate, walletRoutes);
router.use("/categories", authenticate, categoryRoutes);
router.use("/transactions", authenticate, transactionRoutes);
router.use("/transfers", authenticate, transferRoutes);
router.use("/reports", authenticate, reportRoutes);

export default router;
