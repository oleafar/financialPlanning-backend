"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
const store_1 = require("../store");
function getSummary(_req, res) {
    const all = Array.from(store_1.transactions.values());
    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeMap = new Map();
    const expensesMap = new Map();
    for (const t of all) {
        if (t.type === 'income') {
            totalIncome += t.amount;
            const entry = incomeMap.get(t.category) ?? { total: 0, count: 0 };
            incomeMap.set(t.category, { total: entry.total + t.amount, count: entry.count + 1 });
        }
        else {
            totalExpenses += t.amount;
            const entry = expensesMap.get(t.category) ?? { total: 0, count: 0 };
            expensesMap.set(t.category, { total: entry.total + t.amount, count: entry.count + 1 });
        }
    }
    const toBreakdown = (map) => Array.from(map.entries())
        .map(([category, { total, count }]) => ({ category, total, count }))
        .sort((a, b) => b.total - a.total);
    const summary = {
        totalIncome: Math.round(totalIncome * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        balance: Math.round((totalIncome - totalExpenses) * 100) / 100,
        incomeByCategory: toBreakdown(incomeMap),
        expensesByCategory: toBreakdown(expensesMap),
    };
    res.json(summary);
}
//# sourceMappingURL=summaryController.js.map