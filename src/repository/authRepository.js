import prisma from "../../prisma/prisma.js";

export default class AuthRepository {
  constructor() {
    this.model = prisma.user;
  }

  async register(req, res) {
    return await prisma.user.create({
      data: req.body,
    });
  }

  async login(req, res) {
    return await prisma.user.findFirst({
      where: {
        username: req.body.username,
      },
    });
  }
}
