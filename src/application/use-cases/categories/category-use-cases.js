import { CategoryRepository } from "../../../infrastructure/repositories/category-repository.js";
import { ensureResource } from "../../../shared/errors.js";

const categoryRepository = new CategoryRepository();

export function createCategory(userId, data) {
  return categoryRepository.create({
    ...data,
    userId,
  });
}

export function listCategories(userId) {
  return categoryRepository.findManyByUserId(userId);
}

export async function updateCategory(userId, categoryId, data) {
  const category = await categoryRepository.findByIdAndUserId(categoryId, userId);
  ensureResource(category, "Category not found");

  return categoryRepository.update(categoryId, data);
}

export async function deleteCategory(userId, categoryId) {
  const category = await categoryRepository.findByIdAndUserId(categoryId, userId);
  ensureResource(category, "Category not found");

  return categoryRepository.delete(categoryId);
}
