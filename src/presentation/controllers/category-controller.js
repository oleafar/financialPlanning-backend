import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "../../application/use-cases/categories/category-use-cases.js";
import { sendSuccess } from "../../shared/response.js";

export async function create(req, res) {
  const category = await createCategory(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: category,
  });
}

export async function list(req, res) {
  const categories = await listCategories(req.user.id);
  return sendSuccess(res, { data: categories });
}

export async function update(req, res) {
  const category = await updateCategory(req.user.id, req.params.id, req.body);
  return sendSuccess(res, {
    message: "Category updated successfully",
    data: category,
  });
}

export async function remove(req, res) {
  await deleteCategory(req.user.id, req.params.id);
  return sendSuccess(res, {
    message: "Category deleted successfully",
  });
}
