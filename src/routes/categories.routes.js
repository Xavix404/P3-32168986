import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
