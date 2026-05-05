"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = getTransactions;
exports.getTransactionById = getTransactionById;
exports.createTransaction = createTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
const store_1 = require("../store");
function getTransactions(req, res) {
    const { type, category, startDate, endDate } = req.query;
    let result = Array.from(store_1.transactions.values());
    if (type) {
        result = result.filter((t) => t.type === type);
    }
    if (category) {
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
function getTransactionById(req, res) {
    const { id } = req.params;
    const transaction = store_1.transactions.get(id);
    if (!transaction) {
        res.status(404).json({ error: `Transaction with id "${id}" not found` });
        return;
    }
    res.json(transaction);
}
function createTransaction(req, res) {
    const { type, amount, description, category, date } = req.body;
    const transaction = {
        id: crypto.randomUUID(),
        type,
        amount,
        description: description.trim(),
        category: category.trim(),
        date,
        createdAt: new Date().toISOString(),
    };
    store_1.transactions.set(transaction.id, transaction);
    res.status(201).json(transaction);
}
function updateTransaction(req, res) {
    const { id } = req.params;
    const existing = store_1.transactions.get(id);
    if (!existing) {
        res.status(404).json({ error: `Transaction with id "${id}" not found` });
        return;
    }
    const { type, amount, description, category, date } = req.body;
    const updated = {
        ...existing,
        ...(type !== undefined && { type }),
        ...(amount !== undefined && { amount }),
        ...(description !== undefined && { description: description.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(date !== undefined && { date }),
    };
    store_1.transactions.set(id, updated);
    res.json(updated);
}
function deleteTransaction(req, res) {
    const { id } = req.params;
    if (!store_1.transactions.has(id)) {
        res.status(404).json({ error: `Transaction with id "${id}" not found` });
        return;
    }
    store_1.transactions.delete(id);
    res.status(204).send();
}
//# sourceMappingURL=transactionController.js.map