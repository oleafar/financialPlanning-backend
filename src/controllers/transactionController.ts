import { Request, Response } from 'express';
import { transactions } from '../store';
import { Transaction, TransactionFilters } from '../types';

export function getTransactions(req: Request, res: Response): void {
  const { type, category, startDate, endDate } = req.query as TransactionFilters;

  let result = Array.from(transactions.values());

  if (type) {
    result = result.filter((t) => t.type === type);
  }

  if (category) {
    // Both the stored category and the filter parameter are normalized to lowercase for case-insensitive comparison
    result = result.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  if (startDate) {
    const start = new Date(startDate);
    result = result.filter((t) => new Date(t.date) >= start);
  }

  if (endDate) {
    const end = new Date(endDate);
    result = result.filter((t) => new Date(t.date) <= end);
  }

  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json(result);
}

export function getTransactionById(req: Request, res: Response): void {
  const { id } = req.params;
  const transaction = transactions.get(id);

  if (!transaction) {
    res.status(404).json({ error: `Transaction with id "${id}" not found` });
    return;
  }

  res.json(transaction);
}

export function createTransaction(req: Request, res: Response): void {
  const { type, amount, description, category, date } = req.body;

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    type,
    amount,
    description: description.trim(),
    category: category.trim(),
    date,
    createdAt: new Date().toISOString(),
  };

  transactions.set(transaction.id, transaction);
  res.status(201).json(transaction);
}

export function updateTransaction(req: Request, res: Response): void {
  const { id } = req.params;
  const existing = transactions.get(id);

  if (!existing) {
    res.status(404).json({ error: `Transaction with id "${id}" not found` });
    return;
  }

  const { type, amount, description, category, date } = req.body;

  const updated: Transaction = {
    ...existing,
    ...(type !== undefined && { type }),
    ...(amount !== undefined && { amount }),
    ...(description !== undefined && { description: description.trim() }),
    ...(category !== undefined && { category: category.trim() }),
    ...(date !== undefined && { date }),
  };

  transactions.set(id, updated);
  res.json(updated);
}

export function deleteTransaction(req: Request, res: Response): void {
  const { id } = req.params;

  if (!transactions.has(id)) {
    res.status(404).json({ error: `Transaction with id "${id}" not found` });
    return;
  }

  transactions.delete(id);
  res.status(204).send();
}
