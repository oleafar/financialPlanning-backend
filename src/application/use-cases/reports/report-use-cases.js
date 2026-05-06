import { TransactionRepository } from "../../../infrastructure/repositories/transaction-repository.js";
import { WalletRepository } from "../../../infrastructure/repositories/wallet-repository.js";

const transactionRepository = new TransactionRepository();
const walletRepository = new WalletRepository();

function inDateRange(filters) {
  return {
    startDate: filters.startDate,
    endDate: filters.endDate,
    take: 1000,
    skip: 0,
    order: "asc",
  };
}

function periodKey(date, period) {
  const parsedDate = new Date(date);
  const iso = parsedDate.toISOString();

  if (period === "day") {
    return iso.slice(0, 10);
  }

  return iso.slice(0, 7);
}

export async function getSummaryReport(userId, filters = {}) {
  const [wallets, transactions] = await Promise.all([
    walletRepository.findManyByUserId(userId),
    transactionRepository.findManyByUserId(userId, inDateRange(filters)),
  ]);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

  return {
    totalBalance,
    income,
    expense,
    net: income - expense,
    wallets: wallets.map((wallet) => ({
      id: wallet.id,
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance,
    })),
  };
}

export async function getCategoryReport(userId, filters = {}) {
  const transactions = await transactionRepository.findManyByUserId(
    userId,
    inDateRange(filters),
  );

  const grouped = transactions.reduce((acc, transaction) => {
    const key = transaction.category.id;

    if (!acc[key]) {
      acc[key] = {
        categoryId: transaction.category.id,
        categoryName: transaction.category.name,
        type: transaction.category.type,
        total: 0,
      };
    }

    acc[key].total += transaction.amount;
    return acc;
  }, {});

  return Object.values(grouped);
}

export async function getPeriodReport(userId, filters = {}) {
  const period = filters.period ?? "month";
  const transactions = await transactionRepository.findManyByUserId(
    userId,
    inDateRange(filters),
  );

  const grouped = transactions.reduce((acc, transaction) => {
    const key = periodKey(transaction.date, period);

    if (!acc[key]) {
      acc[key] = {
        period: key,
        income: 0,
        expense: 0,
      };
    }

    acc[key][transaction.type] += transaction.amount;
    return acc;
  }, {});

  return Object.values(grouped).map((entry) => ({
    ...entry,
    net: entry.income - entry.expense,
  }));
}
