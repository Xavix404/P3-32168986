import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function register(req, res) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);
    req.body.rol = "user";

    const createdUser = await prisma.user.create({
      data: req.body,
    });
    res.status(200).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "user doesn't exist" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(400)
        .json({ status: "error", message: "wrong password" });
    }
    const token = jwt.sign(
      { username: user.username, id: user.id, rol: user.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .send({ username });
  } catch (error) {
    res.status(400).json({ errors: error });
  }
}
