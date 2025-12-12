import request from "supertest";
import { jest } from "@jest/globals";
import prisma from "../prisma/prisma.js";
import app from "../src/app.js";
import { CreditCardPaymentStrategy } from "../src/services/strategies/paymentStrategies.js";

describe("Orders integration tests", () => {
  const agent = request.agent(app);
  const unique = Date.now();
  let testProduct;
  let userAgent;

  beforeAll(async () => {
    // create a test product
    const category = await prisma.category.findFirst();
    const rarity = await prisma.rarity.findFirst();
    testProduct = await prisma.product.create({
      data: {
        slug: `test-product-${unique}`,
        name: `test-product-${unique}`,
        description: "test product",
        categoryId: category.id,
        rarityId: rarity.id,
        effects: "none",
        element: "none",
        price: 100,
        disponibility: 10,
      },
    });

    // login and create agent with cookie
    userAgent = request.agent(app);
    await userAgent
      .post("/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
  });

  afterAll(async () => {
    // cleanup
    const user = await prisma.user.findUnique({
      where: { username: "CoppyCat" },
    });
    if (user) {
      const orders = await prisma.order.findMany({
        where: { userId: user.id },
      });
      if (orders.length > 0) {
        const orderIds = orders.map((o) => o.id);
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
      }
      // delete the product only after orders/orderItems cleaned
      await prisma.product.deleteMany({ where: { name: testProduct.name } });
    }
    await prisma.$disconnect();
  });

  test("process order with credit_card strategy and mark as paid", async () => {
    // mock the payment strategy to avoid external network call
    const spy = jest
      .spyOn(CreditCardPaymentStrategy.prototype, "processPayment")
      .mockResolvedValue({ success: true, transactionId: "tx123" });

    // create order
    const res = await userAgent.post("/orders").send({
      products: [{ productId: testProduct.id, quantity: 2 }],
      paymentData: {
        "card-number": "4111111111111111",
        cvv: "123",
        "expiration-month": "01",
        "expiration-year": "2024",
        "full-name": "APROVED",
        currency: "USD",
        description: "cool stuff",
        reference: "si",
      },
      paymentMethod: "credit_card",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    const order = res.body.data;
    expect(order.state).toBe("paid");

    // check product stock decreased
    const productAfter = await prisma.product.findUnique({
      where: { id: testProduct.id },
    });
    expect(productAfter.disponibility).toBe(testProduct.disponibility - 2);

    spy.mockRestore();
  });
});
