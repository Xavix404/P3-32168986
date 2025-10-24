import { Router } from "express";
import { getAbout } from "../controllers/aboutController.js";

const router = Router();

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Devuelve información pública del autor del proyecto
 *     description: |
 *       Retorna un objeto JSON que representa los datos públicos del autor.
 *       Este endpoint se usa para exponer metadata simple (nombre completo,
 *       número de cédula y sección) que pueden consumir clientes o tests.
 *     tags:
 *       - Información
 *     responses:
 *       200:
 *         description: Respuesta exitosa con los datos del autor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       example: Victor Xavier Misel Marquez
 *                     cedula:
 *                       type: string
 *                       example: 32.168.986
 *                     seccion:
 *                       type: string
 *                       example: "2"
 *       500:
 *         description: Error interno del servidor al obtener los datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error al leer los datos
 */

router.get("/", getAbout);

export default router;
