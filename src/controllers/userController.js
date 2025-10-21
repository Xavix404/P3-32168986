import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function getUsers(_req, res) {
  const user = await prisma.user.findMany();
  res.json(user);
}

export async function getUserById(req, res) {
  const userFound = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(userFound);
}

export async function createUser(req, res) {
  req.body.password = await bcrypt.hash(req.body.password.toString(), 10);

  const createdUser = await prisma.user.create({
    data: req.body,
  });
  res.json(createdUser);
}

export async function updateUser(req, res) {
  const userChanged = await prisma.user.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: req.body,
  });
  res.json(userChanged);
}

export async function deleteUser(req, res) {
  const userDeleted = await prisma.user.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(userDeleted);
}
