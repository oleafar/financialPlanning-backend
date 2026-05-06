import { prisma } from "../../../infrastructure/database/prisma.js";
import { CategoryRepository } from "../../../infrastructure/repositories/category-repository.js";
import { TransactionRepository } from "../../../infrastructure/repositories/transaction-repository.js";
import { WalletRepository } from "../../../infrastructure/repositories/wallet-repository.js";
import {
  assertCategoryMatchesTransaction,
  assertPositiveAmount,
  getWalletDelta,
} from "../../../domain/services/financial-rules.js";
import { ensureResource } from "../../../shared/errors.js";

const walletRepository = new WalletRepository();
const categoryRepository = new CategoryRepository();
const transactionRepository = new TransactionRepository();

async function resolveTransactionDependencies(userId, data, db) {
  const [wallet, category] = await Promise.all([
    walletRepository.findByIdAndUserId(data.walletId, userId, db),
    categoryRepository.findByIdAndUserId(data.categoryId, userId, db),
  ]);

  ensureResource(wallet, "Wallet not found");
  ensureResource(category, "Category not found");
  assertCategoryMatchesTransaction(category.type, data.type);

  return { wallet, category };
}

export async function createTransaction(userId, data) {
  assertPositiveAmount(data.amount);

  return prisma.$transaction(async (tx) => {
    await resolveTransactionDependencies(userId, data, tx);

    const transaction = await transactionRepository.create(
      {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
        userId,
      },
      tx,
    );

    await walletRepository.updateBalance(
      data.walletId,
      getWalletDelta(data.type, data.amount),
      tx,
    );

    return transaction;
  });
}

export function listTransactions(userId, filters) {
  return transactionRepository.findManyByUserId(userId, filters);
}

export async function updateTransaction(userId, transactionId, data) {
  return prisma.$transaction(async (tx) => {
    const existingTransaction = await transactionRepository.findByIdAndUserId(
      transactionId,
      userId,
      tx,
    );

    ensureResource(existingTransaction, "Transaction not found");

    const nextPayload = {
      title: data.title ?? existingTransaction.title,
      amount: Number(data.amount ?? existingTransaction.amount),
      type: data.type ?? existingTransaction.type,
      date: data.date ?? existingTransaction.date,
      categoryId: data.categoryId ?? existingTransaction.categoryId,
      walletId: data.walletId ?? existingTransaction.walletId,
    };

    assertPositiveAmount(nextPayload.amount);
    await resolveTransactionDependencies(userId, nextPayload, tx);

    await walletRepository.updateBalance(
      existingTransaction.walletId,
      getWalletDelta(existingTransaction.type, existingTransaction.amount) * -1,
      tx,
    );

    await walletRepository.updateBalance(
      nextPayload.walletId,
      getWalletDelta(nextPayload.type, nextPayload.amount),
      tx,
    );

    return transactionRepository.update(
      transactionId,
      {
        ...nextPayload,
        date: new Date(nextPayload.date),
      },
      tx,
    );
  });
}

export async function deleteTransaction(userId, transactionId) {
  return prisma.$transaction(async (tx) => {
    const transaction = await transactionRepository.findByIdAndUserId(
      transactionId,
      userId,
      tx,
    );

    ensureResource(transaction, "Transaction not found");

    await walletRepository.updateBalance(
      transaction.walletId,
      getWalletDelta(transaction.type, transaction.amount) * -1,
      tx,
    );

    return transactionRepository.delete(transactionId, tx);
  });
}
