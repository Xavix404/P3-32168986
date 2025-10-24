import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
}

export async function getUserById(req, res) {
  try {
    const userFound = await prisma.user.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(userFound);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
}

export async function createUser(req, res) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);

    const createdUser = await prisma.user.create({
      data: req.body,
    });
    res.status(200).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
}

export async function updateUser(req, res) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);
    const userChanged = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    res.status(200).json(userChanged);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userDeleted = await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.status(200).json(userDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
}
