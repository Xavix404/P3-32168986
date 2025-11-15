import { Router } from "express";
import {
  getRarity,
  getRarityById,
  createRarity,
  updateRarity,
  deleteRarity,
} from "../controllers/rarityController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

/**
 * @swagger
 * /rarity:
 *   get:
 *     summary: Obtener lista de rarezas (protegido)
 *     tags:
 *       - Rarity
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de rarezas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/", getRarity);
/**
 * @swagger
 * /rarity/{id}:
 *   get:
 *     summary: Obtener una rareza por id (protegido)
 *     tags:
 *       - Rarity
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
 *         description: Rareza encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/:id", getRarityById);
/**
 * @swagger
 * /rarity:
 *   post:
 *     summary: Crear una rareza (protegido)
 *     tags:
 *       - Rarity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rarity'
 *     responses:
 *       '201':
 *         description: Rareza creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.post("/", createRarity);
/**
 * @swagger
 * /rarity/{id}:
 *   put:
 *     summary: Actualizar una rareza (protegido)
 *     tags:
 *       - Rarity
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
 *             $ref: '#/components/schemas/Rarity'
 *     responses:
 *       '200':
 *         description: Rareza actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.put("/:id", updateRarity);
/**
 * @swagger
 * /rarity/{id}:
 *   delete:
 *     summary: Eliminar una rareza (protegido)
 *     tags:
 *       - Rarity
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
 *         description: Rareza eliminada
 *       '401':
 *         description: No autorizado
 */
router.delete("/:id", deleteRarity);

export default router;
