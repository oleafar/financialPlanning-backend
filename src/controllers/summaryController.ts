import { Request, Response } from 'express';
import { transactions } from '../store';
import { CategoryBreakdown, Summary } from '../types';

export function getSummary(_req: Request, res: Response): void {
  const all = Array.from(transactions.values());

  let totalIncome = 0;
  let totalExpenses = 0;

  const incomeMap = new Map<string, { total: number; count: number }>();
  const expensesMap = new Map<string, { total: number; count: number }>();

  for (const t of all) {
    if (t.type === 'income') {
      totalIncome += t.amount;
      const entry = incomeMap.get(t.category) ?? { total: 0, count: 0 };
      incomeMap.set(t.category, { total: entry.total + t.amount, count: entry.count + 1 });
    } else {
      totalExpenses += t.amount;
      const entry = expensesMap.get(t.category) ?? { total: 0, count: 0 };
      expensesMap.set(t.category, { total: entry.total + t.amount, count: entry.count + 1 });
    }
  }

  const toBreakdown = (map: Map<string, { total: number; count: number }>): CategoryBreakdown[] =>
    Array.from(map.entries())
      .map(([category, { total, count }]) => ({ category, total, count }))
      .sort((a, b) => b.total - a.total);

  const summary: Summary = {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
    incomeByCategory: toBreakdown(incomeMap),
    expensesByCategory: toBreakdown(expensesMap),
  };

  res.json(summary);
}
