import { Request, Response } from 'express';
import { categories } from '../store';
import { Category } from '../types';

export function getCategories(req: Request, res: Response): void {
  const result = Array.from(categories.values());
  result.sort((a, b) => a.name.localeCompare(b.name));
  res.json(result);
}

export function createCategory(req: Request, res: Response): void {
  const { name, type } = req.body;

  const duplicate = Array.from(categories.values()).find(
    (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.type === type
  );

  if (duplicate) {
    res.status(409).json({ error: `Category "${name}" with type "${type}" already exists` });
    return;
  }

  const category: Category = {
    id: crypto.randomUUID(),
    name: name.trim(),
    type,
    createdAt: new Date().toISOString(),
  };

  categories.set(category.id, category);
  res.status(201).json(category);
}

export function updateCategory(req: Request, res: Response): void {
  const { id } = req.params;
  const existing = categories.get(id);

  if (!existing) {
    res.status(404).json({ error: `Category with id "${id}" not found` });
    return;
  }

  const { name, type } = req.body;

  if (name !== undefined) {
    const targetType = type !== undefined ? type : existing.type;
    const duplicate = Array.from(categories.values()).find(
      (c) => c.id !== id && c.name.toLowerCase() === name.trim().toLowerCase() && c.type === targetType
    );
    if (duplicate) {
      res.status(409).json({ error: `Category "${name}" with type "${targetType}" already exists` });
      return;
    }
  }

  const updated: Category = {
    ...existing,
    ...(name !== undefined && { name: name.trim() }),
    ...(type !== undefined && { type }),
  };

  categories.set(id, updated);
  res.json(updated);
}

export function deleteCategory(req: Request, res: Response): void {
  const { id } = req.params;

  if (!categories.has(id)) {
    res.status(404).json({ error: `Category with id "${id}" not found` });
    return;
  }

  categories.delete(id);
  res.status(204).send();
}
