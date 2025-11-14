import prisma from "../../prisma/prisma.js";

export default class UserRepository {
  constructor() {
    this.model = prisma.user;
  }

  async getAllUsers() {
    return await this.model.findMany();
  }

  async getUserById(req, res) {
    return await this.model.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }

  async createUser(req, res) {
    return await this.model.create({
      data: req.body,
    });
  }

  async updateUser(req, res) {
    return await this.model.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
  }

  async deleteUser(req, res) {
    return await this.model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }
}
