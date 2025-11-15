import prisma from "../../prisma/prisma.js";

export default class TagsRepository {
  constructor() {
    this.model = prisma.tags;
  }

  async getAllTags() {
    return await this.model.findMany();
  }

  async getTagsById(req, res) {
    return await this.model.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }

  async createTags(req, res) {
    return await this.model.create({
      data: req.body,
    });
  }

  async updateTags(req, res) {
    return await this.model.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
  }

  async deleteTags(req, res) {
    return await this.model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }
}
