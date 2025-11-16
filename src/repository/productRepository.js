import prisma from "../../prisma/prisma.js";

export default class ProductRepository {
  constructor() {
    // Defensive: ensure Prisma client and model exist. On some deploys the
    // generated client may be missing if `prisma generate` wasn't run.
    if (!prisma || !prisma.product) {
      // Keep a clear error for runtime logs to help debugging deploy issues
      // (missing generated client or wrong Prisma schema on the host).
      console.error(
        "Prisma client or `product` model is not available. Did you run `prisma generate` on the deploy host?"
      );
      this.model = undefined;
    } else {
      this.model = prisma.product;
    }
  }

  async findProducts(options = {}) {
    if (!this.model) {
      throw new Error(
        "Prisma model `product` is not available. Check server logs and ensure Prisma Client is generated (prisma generate) and the correct DATABASE_URL is set."
      );
    }
    const {
      page,
      rarity,
      effects,
      element,
      category,
      tags,
      price_min,
      price_max,
      search,
    } = options;

    const where = {};
    const limit = 20;
    const pg = Math.max(1, parseInt(page) || 1);
    const skip = (pg - 1) * limit;

    // Element can be a name
    if (element !== undefined && element !== null && element !== "") {
      where.element = {
        contains: element.toString(),
      };
    }

    // Effects can be a name
    if (effects !== undefined && effects !== null && effects !== "") {
      where.effects = {
        contains: effects.toString(),
      };
    }

    // Rarity can be id or name
    if (rarity !== undefined && rarity !== null && rarity !== "") {
      const rarityId = parseInt(rarity);
      if (!isNaN(rarityId)) {
        where.rarityId = rarityId;
      } else {
        where.rarity = {
          name: { contains: rarity.toString() },
        };
      }
    }

    // Category can be id or name
    if (category !== undefined && category !== null && category !== "") {
      const catId = parseInt(category);
      if (!isNaN(catId)) {
        where.categoryId = catId;
      } else {
        where.category = {
          name: { contains: category.toString() },
        };
      }
    }

    // Tags: accept comma separated string or array of ids
    if (tags !== undefined && tags !== null && tags !== "") {
      let ids = [];
      if (Array.isArray(tags))
        ids = tags.map((t) => parseInt(t)).filter((n) => !isNaN(n));
      else if (typeof tags === "string")
        ids = tags
          .split(",")
          .map((t) => parseInt(t))
          .filter((n) => !isNaN(n));

      if (ids.length > 0) {
        where.productsTag = { some: { tagId: { in: ids } } };
      }
    }

    // Price range
    if (
      (price_min !== undefined && price_min !== null && price_min !== "") ||
      (price_max !== undefined && price_max !== null && price_max !== "")
    ) {
      where.price = {};
      const pmin = parseInt(price_min);
      const pmax = parseInt(price_max);
      if (!isNaN(pmin)) where.price.gte = pmin;
      if (!isNaN(pmax)) where.price.lte = pmax;
    }

    // Search in name or description
    if (search !== undefined && search !== null && search !== "") {
      where.OR = [
        { name: { contains: search.toString() } },
        { description: { contains: search.toString() } },
      ];
    }

    const total = await this.model.count({ where });

    const items = await this.model.findMany({
      skip,
      take: limit,
      where,
      include: {
        productsTag: { include: { tag: true } },
        category: true,
        rarity: true,
      },
      orderBy: { id: "asc" },
    });

    return {
      items,
      meta: {
        total,
        limit: limit,
        page: pg,
        pages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async getProductById(req, res) {
    return await this.model.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        productsTag: { include: { tag: true } },
        category: true,
        rarity: true,
      },
    });
  }

  async createProduct(req, res) {
    const { tagIds, ...productData } = req.body;

    const data = { ...productData };

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      data.productsTag = {
        create: tagIds.map((tagId) => ({
          tag: { connect: { id: parseInt(tagId) } },
        })),
      };
    }

    return await this.model.create({
      data,
      include: {
        productsTag: { include: { tag: true } },
        category: true,
        rarity: true,
      },
    });
  }

  async updateProduct(req, res) {
    const { tagIds, ...productData } = req.body;

    const data = { ...productData };

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      data.productsTag = {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tag: { connect: { id: parseInt(tagId) } },
        })),
      };
    }

    return await this.model.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: {
        productsTag: { include: { tag: true } },
        category: true,
        rarity: true,
      },
    });
  }

  async deleteProduct(req, res) {
    return await this.model.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });
  }
}
