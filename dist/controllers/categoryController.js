"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const store_1 = require("../store");
function getCategories(req, res) {
    const result = Array.from(store_1.categories.values());
    result.sort((a, b) => a.name.localeCompare(b.name));
    res.json(result);
}
function createCategory(req, res) {
    const { name, type } = req.body;
    const duplicate = Array.from(store_1.categories.values()).find((c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.type === type);
    if (duplicate) {
        res.status(409).json({ error: `Category "${name}" with type "${type}" already exists` });
        return;
    }
    const category = {
        id: crypto.randomUUID(),
        name: name.trim(),
        type,
        createdAt: new Date().toISOString(),
    };
    store_1.categories.set(category.id, category);
    res.status(201).json(category);
}
function updateCategory(req, res) {
    const { id } = req.params;
    const existing = store_1.categories.get(id);
    if (!existing) {
        res.status(404).json({ error: `Category with id "${id}" not found` });
        return;
    }
    const { name, type } = req.body;
    if (name !== undefined) {
        const targetType = type !== undefined ? type : existing.type;
        const duplicate = Array.from(store_1.categories.values()).find((c) => c.id !== id && c.name.toLowerCase() === name.trim().toLowerCase() && c.type === targetType);
        if (duplicate) {
            res.status(409).json({ error: `Category "${name}" with type "${targetType}" already exists` });
            return;
        }
    }
    const updated = {
        ...existing,
        ...(name !== undefined && { name: name.trim() }),
        ...(type !== undefined && { type }),
    };
    store_1.categories.set(id, updated);
    res.json(updated);
}
function deleteCategory(req, res) {
    const { id } = req.params;
    if (!store_1.categories.has(id)) {
        res.status(404).json({ error: `Category with id "${id}" not found` });
        return;
    }
    store_1.categories.delete(id);
    res.status(204).send();
}
//# sourceMappingURL=categoryController.js.map