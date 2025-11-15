import { Router } from "express";
import {
  getTags,
  getTagsById,
  createTags,
  updateTags,
  deleteTags,
} from "../controllers/tagsController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtener lista de tags (protegido)
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/", getTags);
/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtener un tag por id (protegido)
 *     tags:
 *       - Tags
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
 *         description: Tag encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.get("/:id", getTagsById);
/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crear un tag (protegido)
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       '201':
 *         description: Tag creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.post("/", createTags);
/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Actualizar un tag (protegido)
 *     tags:
 *       - Tags
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
 *             $ref: '#/components/schemas/Tag'
 *     responses:
 *       '200':
 *         description: Tag actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: No autorizado
 */
router.put("/:id", updateTags);
/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Eliminar un tag (protegido)
 *     tags:
 *       - Tags
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
 *         description: Tag eliminado
 *       '401':
 *         description: No autorizado
 */
router.delete("/:id", deleteTags);

export default router;
