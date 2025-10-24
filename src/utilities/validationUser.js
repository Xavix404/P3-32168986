import { check } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserRules = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          email: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("username")
    .exists()
    .withMessage("Username is required")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("rol")
    .exists()
    .withMessage("rol is required")
    .notEmpty()
    .withMessage("rol cannot be empty")
    .custom((value) => {
      if (value !== "user" && value !== "admin") {
        throw new Error("Invalid role");
      }
      return true;
    }),
];

export const registerUserRules = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          email: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("username")
    .exists()
    .withMessage("Username is required")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const changeUserRules = [
  check("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          email: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .custom(async (value) => {
      const userFound = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });
      if (userFound) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("rol")
    .notEmpty()
    .withMessage("rol cannot be empty")
    .custom((value) => {
      if (value !== "user" && value !== "admin") {
        throw new Error("Invalid role");
      }
      return true;
    }),
];
