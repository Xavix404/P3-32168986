import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { registerUserRules } from "../utilities/validationUser.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDTO'
 *     responses:
 *       '200':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '422':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendFail'
 */
router.post("/register", registerUserRules, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username and password and receive a JWT (cookie)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     security: []
 *     responses:
 *       '200':
 *         description: Login successful (sets access_token cookie)
 *         headers:
 *          Set-Cookie:
 *            description: JWT access token cookie
 *            schema:
 *              type: string
 *              example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly;
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *       '400':
 *          description: Invalid credentials
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               status: "error"
 *               message: "user doesn't exist or wrong password"
 */
router.post("/login", login);

export default router;
