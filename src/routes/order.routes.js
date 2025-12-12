import { Router } from "express";
import {
  processOrder,
  getOrders,
  getOrderById,
} from "../controllers/ordersController.js";

const router = Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create an order (Transactional)
 *     description: |
 *       Creates an order and attempts payment using `paymentMethod`. This endpoint is
 *       transactional: it will rollback the created order and not change product stock
 *       if payment fails. Include `paymentMethod` and `paymentData` in the request body
 *       to process payments (e.g. `credit_card`).
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       '200':
 *         description: Order created and paid
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
 *       '400':
 *         description: Validation failed or Insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 *       '402':
 *         description: Payment failed / declined
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.post("/", processOrder);
/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get user's orders (paginated)
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Page size
 *     responses:
 *       '200':
 *         description: Paginated list of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendOrderList'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get("/", getOrders);
/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order detail (owner only)
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order id
 *     responses:
 *       '200':
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendOrder'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.get("/:id", getOrderById);

export default router;
