"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/', transactionController_1.getTransactions);
router.get('/:id', transactionController_1.getTransactionById);
router.post('/', validation_1.validateTransaction, transactionController_1.createTransaction);
router.put('/:id', validation_1.validateTransactionUpdate, transactionController_1.updateTransaction);
router.delete('/:id', transactionController_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transactions.js.map