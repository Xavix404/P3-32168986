import prisma from "../../prisma/prisma.js";

export default class OrdersRepository {
  constructor() {
    this.model = prisma.order;
  }

  async createOrder(data) {
    let total = 0;
    data.items.forEach((item) => {
      total += item.price * item.quantity;
    });

    return await this.model.create({
      data: {
        userId: data.userId,
        totalAmount: total,
        orderItems: {
          createMany: {
            data: data.items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
          },
        },
        state: "pending",
      },
      include: {
        orderItems: { include: { product: true } },
      },
    });
  }

  async updateOrder(data) {
    return await this.model.update({
      where: {
        id: parseInt(data.id),
      },
      data: data.body,
      include: { orderItems: { include: { product: true } } },
    });
  }

  async deleteOrder(id) {
    // delete related order items first to avoid FK constraint
    await prisma.orderItem.deleteMany({ where: { orderId: parseInt(id) } });
    return await this.model.delete({ where: { id: parseInt(id) } });
  }

  async findByUser(userId, page = 1, limit = 20) {
    const pg = Math.max(1, parseInt(page) || 1);
    const lim = Math.max(1, parseInt(limit) || 20);
    const skip = (pg - 1) * lim;

    const where = { userId: parseInt(userId) };
    const total = await this.model.count({ where });
    const items = await this.model.findMany({
      where: where,
      skip,
      take: lim,
      include: { orderItems: { include: { product: true } } },
      orderBy: { id: "desc" },
    });

    return {
      items,
      meta: { total, limit: lim, page: pg, pages: Math.ceil(total / lim) || 0 },
    };
  }

  async getOrderById(id) {
    return await this.model.findUnique({
      where: { id: parseInt(id) },
      include: { orderItems: { include: { product: true } } },
    });
  }
}
