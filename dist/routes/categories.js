"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/', categoryController_1.getCategories);
router.post('/', validation_1.validateCategory, categoryController_1.createCategory);
router.put('/:id', validation_1.validateCategoryUpdate, categoryController_1.updateCategory);
router.delete('/:id', categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categories.js.map