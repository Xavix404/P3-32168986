import prisma from "../../prisma/prisma.js";

export default class RarityRepository {
  constructor() {
    this.model = prisma.rarity;
  }

  async getAllRarity() {
    return await this.model.findMany();
  }

  async getRarityById(req, res) {
    return await this.model.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }

  async createRarity(req, res) {
    return await this.model.create({
      data: req.body,
    });
  }

  async updateRarity(req, res) {
    return await this.model.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
  }

  async deleteRarity(req, res) {
    return await this.model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }
}
