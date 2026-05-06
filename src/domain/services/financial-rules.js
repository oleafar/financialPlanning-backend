import { AppError } from "../../shared/errors.js";

export function assertPositiveAmount(amount) {
  if (Number(amount) <= 0) {
    throw new AppError("Amount must be greater than zero", 400);
  }
}

export function assertCategoryMatchesTransaction(categoryType, transactionType) {
  if (categoryType !== transactionType) {
    throw new AppError("Category type must match transaction type", 400);
  }
}

export function getWalletDelta(type, amount) {
  return type === "income" ? Number(amount) : Number(amount) * -1;
}
