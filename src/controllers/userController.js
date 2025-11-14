import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserRepository from "../repository/userRepository.js";

const userRepo = new UserRepository();

export async function getUsers(req, res) {
  try {
    const users = await userRepo.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users" });
  }
}

export async function getUserById(req, res) {
  try {
    const userFound = await userRepo.getUserById(req, res);
    res.status(200).json(userFound);
  } catch (error) {
    res.status(500).json({ error: "Error getting user" });
  }
}

export async function createUser(req, res) {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    req.body.password = await bcrypt.hash(req.body.password.toString(), 10);

    const createdUser = await userRepo.createUser(req, res);
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
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password.toString(), 10);
    }
    const userChanged = await userRepo.updateUser(req, res);
    res.status(200).json(userChanged);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const userDeleted = await userRepo.deleteUser(req, res);
    res.status(200).json(userDeleted);
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
}
