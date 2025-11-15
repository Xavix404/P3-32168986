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

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener lista de categorías (protegido)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/", getCategories);
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener una categoría por id (protegido)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/:id", getCategoryById);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una categoría (protegido)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '201':
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.post("/", createCategory);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría (protegido)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.put("/:id", updateCategory);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría (protegido)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Categoría eliminada
 *       '401':
 *         description: No autorizado
 */
router.delete("/:id", deleteCategory);

export default router;
