import { Router } from "express";
import aboutData from "../services/about.json" with { type: "json" };

var router = Router();

/**
 * @openapi
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

router.get("/about", (_req, res) => {
  res.json(aboutData);
});

/**
 * @openapi
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

router.get("/ping", (_req, res) => {
  res.status(200), res.send("");
});

export default router;
