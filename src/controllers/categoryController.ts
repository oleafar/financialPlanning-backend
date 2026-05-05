import { Request, Response } from 'express';
import { categories } from '../store';
import { Category, CategoryType } from '../types';

function isDuplicateCategory(name: string, type: CategoryType, excludeId?: string): boolean {
  return Array.from(categories.values()).some(
    (c) => c.name.toLowerCase() === name.toLowerCase() && c.type === type && c.id !== excludeId
  );
}

export function getCategories(req: Request, res: Response): void {
  const result = Array.from(categories.values());
  result.sort((a, b) => a.name.localeCompare(b.name));
  res.json(result);
}

export function createCategory(req: Request, res: Response): void {
  const { name, type } = req.body;
  const trimmedName = (name as string).trim();

  if (isDuplicateCategory(trimmedName, type as CategoryType)) {
    res.status(409).json({ error: `Category "${trimmedName}" with type "${type}" already exists` });
    return;
  }

  const category: Category = {
    id: crypto.randomUUID(),
    name: trimmedName,
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
    const targetType: CategoryType = type !== undefined ? (type as CategoryType) : existing.type;
    if (isDuplicateCategory((name as string).trim(), targetType, id)) {
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
