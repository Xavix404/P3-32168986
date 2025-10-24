import { Router } from "express";
import { getPing } from "../controllers/pingController.js";

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Endpoint de salud (health check)
 *     description: |
 *       Endpoint ligero utilizado para comprobar que el servicio está activo.
 *       Devuelve un 200 OK con un cuerpo vacío para minimizar el ancho de
 *       banda y el tiempo de respuesta. Útil en probes de Kubernetes o tests.
 *     tags:
 *       - Salud
 *     responses:
 *       200:
 *         description: Servicio activo.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ""
 */

router.get("/", getPing);

export default router;
