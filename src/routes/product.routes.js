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

/**
 * @swagger
 * /product:
 *   get:
 *     summary: List products (public)
 *     tags:
 *       - Products
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (max 20)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category id or name to filter
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma separated list of tag ids
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: integer
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or description
 *     responses:
 *       '200':
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 */
router.get("/", getProduct);

/**
 * @swagger
 * /product/{id}-{slug}:
 *   get:
 *     summary: Get a product by id and slug (public, canonical URL)
 *     tags:
 *       - Products
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: slug
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get("/:id-:slug", getProductBySlug);

router.use(validateAuthorization);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by id (protected)
 *     tags:
 *       - Products
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
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a product (protected)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.post("/", createProduct);

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product (protected)
 *     tags:
 *       - Products
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product (protected)
 *     tags:
 *       - Products
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
 *         description: Deleted
 *       '401':
 *         description: Unauthorized
 */
router.delete("/:id", deleteProduct);

export default router;
