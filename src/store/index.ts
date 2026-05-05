import { Transaction, Category } from '../types';

const transactions = new Map<string, Transaction>();

const categories = new Map<string, Category>();

const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Salary', type: 'income' },
  { name: 'Investment', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Housing', type: 'expense' },
  { name: 'Health', type: 'expense' },
  { name: 'Entertainment', type: 'expense' },
  { name: 'Education', type: 'expense' },
  { name: 'Other', type: 'both' },
];

for (const cat of defaultCategories) {
  const id = crypto.randomUUID();
  categories.set(id, { id, ...cat, createdAt: new Date().toISOString() });
}

export { transactions, categories };
