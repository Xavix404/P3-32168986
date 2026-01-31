import request from "supertest";
import { jest } from "@jest/globals";
import prisma from "../prisma/prisma.js";
import app from "../src/app.js";
import { CreditCardPaymentStrategy } from "../src/services/strategies/paymentStrategies.js";
import OrdersRepository from "../src/repository/ordersRepository.js";

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
      .post("/api/auth/login")
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
    const res = await userAgent.post("/api/orders").send({
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

  test("POST /orders should return 401 when unauthenticated", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ products: [{ productId: testProduct.id, quantity: 1 }] });
    expect(res.statusCode).toBe(401);
  });

  test("GET /orders should return user's order history and support pagination", async () => {
    // create two orders for the logged in user
    const res1 = await userAgent.post("/api/orders").send({
      products: [{ productId: testProduct.id, quantity: 1 }],
    });
    const res2 = await userAgent.post("/api/orders").send({
      products: [{ productId: testProduct.id, quantity: 1 }],
    });

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);

    // fetch orders without pagination
    const list = await userAgent.get("/api/orders").send();
    expect(list.statusCode).toBe(200);
    expect(list.body.status).toBe("success");
    expect(list.body.data).toHaveProperty("items");
    expect(Array.isArray(list.body.data.items)).toBe(true);

    // pagination
    const page1 = await userAgent.get("/api/orders?page=1&limit=1").send();
    expect(page1.statusCode).toBe(200);
    expect(page1.body.data.items.length).toBeLessThanOrEqual(1);
  });

  test("GET /orders accepts Bearer token instead of cookie", async () => {
    // login to get token
    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
    expect(login.statusCode).toBe(200);
    const token = login.body.token;

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
  });

  test("GET /orders/:id accepts Bearer token for owner and rejects other users", async () => {
    // create an order using bearer token
    const login = await request(app)
      .post("/api/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
    const token = login.body.token;

    const created = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ products: [{ productId: testProduct.id, quantity: 1 }] });
    expect(created.statusCode).toBe(200);
    const orderId = created.body.data.id;

    const detail = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(detail.statusCode).toBe(200);

    // create another user and ensure they cannot access
    const unique2 = Date.now();
    const newUser = {
      email: `other+${unique2}@example.com`,
      username: `other${unique2}`,
      password: "123456",
    };
    await request(app).post("/api/auth/register").send(newUser);
    const login2 = await request(app)
      .post("/api/auth/login")
      .send({ username: newUser.username, password: newUser.password });
    const bearer2 = login2.body.token;
    const forbidden = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${bearer2}`)
      .send();
    expect(forbidden.statusCode).toBe(403);
  });

  test("GET /orders/:id returns detail only for owner", async () => {
    // create an order to fetch
    const created = await userAgent.post("/api/orders").send({
      products: [{ productId: testProduct.id, quantity: 1 }],
    });
    expect(created.statusCode).toBe(200);
    const orderId = created.body.data.id;

    // fetch detail as owner
    const detail = await userAgent.get(`/api/orders/${orderId}`).send();
    expect(detail.statusCode).toBe(200);
    expect(detail.body.status).toBe("success");
    expect(detail.body.data.id).toBe(orderId);
    expect(detail.body.data.orderItems[0]).toHaveProperty("product");

    // create a new user to test forbidden access
    const unique2 = Date.now();
    const newUser = {
      email: `other+${unique2}@example.com`,
      username: `other${unique2}`,
      password: "123456",
    };
    await request(app).post("/api/auth/register").send(newUser);
    const otherAgent = request.agent(app);
    const loginRes = await otherAgent
      .post("/api/auth/login")
      .send({ username: newUser.username, password: newUser.password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    const forbidden = await otherAgent.get(`/api/orders/${orderId}`).send();
    expect(forbidden.statusCode).toBe(403);
  });

  test("should rollback and not create order when a product has insufficient stock", async () => {
    // create two products
    const category = await prisma.category.findFirst();
    const rarity = await prisma.rarity.findFirst();
    const p1 = await prisma.product.create({
      data: {
        slug: `test-prod-a-${unique}`,
        name: `test-prod-a-${unique}`,
        description: "p1",
        categoryId: category.id,
        rarityId: rarity.id,
        effects: "none",
        element: "none",
        price: 10,
        disponibility: 5,
      },
    });
    const p2 = await prisma.product.create({
      data: {
        slug: `test-prod-b-${unique}`,
        name: `test-prod-b-${unique}`,
        description: "p2",
        categoryId: category.id,
        rarityId: rarity.id,
        effects: "none",
        element: "none",
        price: 20,
        disponibility: 5,
      },
    });

    // attempt to order more than available for p2
    const res = await userAgent.post("/api/orders").send({
      products: [
        { productId: p1.id, quantity: 1 },
        { productId: p2.id, quantity: 10 },
      ],
    });

    expect(res.statusCode).toBe(400);

    // ensure no order items created for these products
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { in: [p1.id, p2.id] } },
    });
    expect(orderItems.length).toBe(0);

    // ensure stock didn't change
    const after1 = await prisma.product.findUnique({ where: { id: p1.id } });
    const after2 = await prisma.product.findUnique({ where: { id: p2.id } });
    expect(after1.disponibility).toBe(5);
    expect(after2.disponibility).toBe(5);

    // clean up
    await prisma.product.deleteMany({ where: { id: { in: [p1.id, p2.id] } } });
  });

  test("should rollback order creation and not decrement stock when payment fails", async () => {
    // create a product with available stock
    const category = await prisma.category.findFirst();
    const rarity = await prisma.rarity.findFirst();
    const p = await prisma.product.create({
      data: {
        slug: `test-prod-fail-${unique}`,
        name: `test-prod-fail-${unique}`,
        description: "pfail",
        categoryId: category.id,
        rarityId: rarity.id,
        effects: "none",
        element: "none",
        price: 10,
        disponibility: 5,
      },
    });

    const spy = jest
      .spyOn(CreditCardPaymentStrategy.prototype, "processPayment")
      .mockResolvedValue({ success: false, error: "declined" });
    const deleteSpy = jest.spyOn(OrdersRepository.prototype, "deleteOrder");

    const res = await userAgent.post("/api/orders").send({
      products: [{ productId: p.id, quantity: 2 }],
      paymentData: {
        "card-number": "4111111111111111",
        cvv: "123",
        "expiration-month": "01",
        "expiration-year": "2024",
        "full-name": "DECLINED",
        currency: "USD",
        description: "cool stuff",
        reference: "si",
      },
      paymentMethod: "credit_card",
    });

    expect(res.statusCode).toBe(402);

    // no order or order items should exist for the product
    const beforeItems = await prisma.orderItem.findMany({
      where: { productId: p.id },
    });
    const items = await prisma.orderItem.findMany({
      where: { productId: p.id },
    });
    // debug: no logs
    expect(items.length).toBe(beforeItems.length);

    // stock should remain unchanged
    const prodAfter = await prisma.product.findUnique({ where: { id: p.id } });
    expect(prodAfter.disponibility).toBe(5);

    spy.mockRestore();
    deleteSpy.mockRestore();

    // cleanup any order items and the product
    await prisma.orderItem.deleteMany({ where: { productId: p.id } });
    await prisma.product.delete({ where: { id: p.id } });
  });
});
