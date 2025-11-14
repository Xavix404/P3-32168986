import prisma from "../../prisma/prisma.js";

export default class CategoryRepository {
  constructor() {
    this.model = prisma.category;
  }

  async getAllCategories() {
    return await this.model.findMany();
  }

  async getCategoryById(req, res) {
    return await this.model.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }

  async createCategory(req, res) {
    return await this.model.create({
      data: req.body,
    });
  }

  async updateCategory(req, res) {
    return await this.model.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });
  }

  async deleteCategory(req, res) {
    return await this.model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }
}
