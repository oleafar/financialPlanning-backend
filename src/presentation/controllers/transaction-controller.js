import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../../application/use-cases/transactions/transaction-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function create(req, res) {
  const transaction = await createTransaction(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Transaction created successfully",
    data: transaction,
  });
}

export async function list(req, res) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 20);
  const transactions = await listTransactions(req.user.id, {
    type: req.query.type,
    categoryId: req.query.categoryId,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    order: req.query.order ?? "desc",
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return sendSuccess(res, {
    data: {
      items: transactions,
      page,
      pageSize,
    },
  });
}

export async function update(req, res) {
  const transaction = await updateTransaction(req.user.id, req.params.id, req.body);
  return sendSuccess(res, {
    message: "Transaction updated successfully",
    data: transaction,
  });
}

export async function remove(req, res) {
  await deleteTransaction(req.user.id, req.params.id);
  return sendSuccess(res, {
    message: "Transaction deleted successfully",
  });
}
