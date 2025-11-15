import { Router } from "express";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
} from "../controllers/productController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.get("/", getProduct);
router.get("/:id-:slug", getProductBySlug);

router.use(validateAuthorization);

router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
