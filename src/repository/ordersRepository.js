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
        orderItems: true,
      },
    });
  }

  async updateOrder(data) {
    return await this.model.update({
      where: {
        id: parseInt(data.id),
      },
      data: data.body,
      include: { orderItems: true },
    });
  }
}
