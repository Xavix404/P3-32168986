import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export async function getUsers(req, res) {
  const user = await prisma.user.findMany();
  res.status(200).json(user);
}

export async function getUserById(req, res) {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.status(200).json(userFound);
}

export async function createUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);

    const createdUser = await prisma.user.create({
      data: req.body,
    });
    res.status(200).json(createdUser);
  }
}

export async function updateUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    const userChanged = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
    res.status(200).json(userChanged);
  }
}

export async function deleteUser(req, res) {
  const userDeleted = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.status(200).json(userDeleted);
}
