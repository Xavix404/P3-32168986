import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  createUserRules,
  changeUserRules,
} from "../utilities/validationUser.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get list of users (protected)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: JSend success with array of users
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
router.get("/", getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by id (protected)
 *     tags:
 *       - Users
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
 *         description: JSend success with a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user (protected)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       '201':
 *         description: User created (JSend)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.post("/", createUserRules, createUser);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user (protected)
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       '200':
 *         description: User updated (JSend)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.put("/:id", changeUserRules, updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user (protected)
 *     tags:
 *       - Users
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
 *         description: User deleted (JSend)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JSendSuccess'
 *       '401':
 *         description: Unauthorized
 */
router.delete("/:id", deleteUser);

export default router;
