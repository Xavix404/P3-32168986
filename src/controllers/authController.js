import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import AuthRepository from "../repository/authRepository.js";

const authRepo = new AuthRepository();

export async function register(req, res) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);
    req.body.rol = "user";

    const createdUser = await authRepo.register(req, res);
    res.status(200).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await authRepo.login(req, res);
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
      { expiresIn: "1h" },
    );
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .send({ token });
  } catch (error) {
    res.status(400).json({ errors: error.message });
  }
}
