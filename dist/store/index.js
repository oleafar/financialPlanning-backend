"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.transactions = void 0;
const transactions = new Map();
exports.transactions = transactions;
const categories = new Map();
exports.categories = categories;
const defaultCategories = [
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
//# sourceMappingURL=index.js.map