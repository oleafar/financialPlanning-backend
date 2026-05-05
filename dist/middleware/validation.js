"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = validateTransaction;
exports.validateTransactionUpdate = validateTransactionUpdate;
exports.validateCategory = validateCategory;
exports.validateCategoryUpdate = validateCategoryUpdate;
function validateTransaction(req, res, next) {
    const { type, amount, description, category, date } = req.body;
    if (!type || !['income', 'expense'].includes(type)) {
        res.status(400).json({ error: 'type must be "income" or "expense"' });
        return;
    }
    if (amount === undefined || amount === null) {
        res.status(400).json({ error: 'amount is required' });
        return;
    }
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'amount must be a positive number' });
        return;
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
        res.status(400).json({ error: 'description is required' });
        return;
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
        res.status(400).json({ error: 'category is required' });
        return;
    }
    if (!date || typeof date !== 'string' || isNaN(Date.parse(date))) {
        res.status(400).json({ error: 'date must be a valid date string' });
        return;
    }
    next();
}
function validateTransactionUpdate(req, res, next) {
    const { type, amount, description, category, date } = req.body;
    if (type !== undefined && !['income', 'expense'].includes(type)) {
        res.status(400).json({ error: 'type must be "income" or "expense"' });
        return;
    }
    if (amount !== undefined) {
        if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
            res.status(400).json({ error: 'amount must be a positive number' });
            return;
        }
    }
    if (description !== undefined) {
        if (typeof description !== 'string' || description.trim() === '') {
            res.status(400).json({ error: 'description must be a non-empty string' });
            return;
        }
    }
    if (category !== undefined) {
        if (typeof category !== 'string' || category.trim() === '') {
            res.status(400).json({ error: 'category must be a non-empty string' });
            return;
        }
    }
    if (date !== undefined) {
        if (typeof date !== 'string' || isNaN(Date.parse(date))) {
            res.status(400).json({ error: 'date must be a valid date string' });
            return;
        }
    }
    next();
}
function validateCategory(req, res, next) {
    const { name, type } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'name is required' });
        return;
    }
    if (!type || !['income', 'expense', 'both'].includes(type)) {
        res.status(400).json({ error: 'type must be "income", "expense", or "both"' });
        return;
    }
    next();
}
function validateCategoryUpdate(req, res, next) {
    const { name, type } = req.body;
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            res.status(400).json({ error: 'name must be a non-empty string' });
            return;
        }
    }
    if (type !== undefined && !['income', 'expense', 'both'].includes(type)) {
        res.status(400).json({ error: 'type must be "income", "expense", or "both"' });
        return;
    }
    next();
}
//# sourceMappingURL=validation.js.map