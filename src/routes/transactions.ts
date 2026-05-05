import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { validateTransaction, validateTransactionUpdate } from '../middleware/validation';

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', validateTransaction, createTransaction);
router.put('/:id', validateTransactionUpdate, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
