import request from "supertest";

import app from "../src/app.js";

describe("peticiones de products con validaciones de token invalido", () => {
  test("get a products by id", async () => {
    const res = await request(app).get("/products/1");
    expect(res.statusCode).toBe(401);
  });
  test("post a products", async () => {
    const res = await request(app)
      .post("/products")
      .send({
        name: "Dark-Sword",
        description: "Powerfull sword born of dark magic",
        categoryId: 2,
        tagIds: [2, 5, 6, 7, 9, 24, 28],
        rarityId: 4,
        effects: "dark magic",
        element: "dark",
        price: 1000,
        disponibility: 1,
      });
    expect(res.statusCode).toBe(401);
  });
  test("put a products", async () => {
    const res = await request(app).put("/products/1").send({ name: "green" });
    expect(res.statusCode).toBe(401);
  });
  test("delete a products", async () => {
    const res = await request(app).delete("/products/1");
    expect(res.statusCode).toBe(401);
  });
});

describe("peticiones de products publicas general y por slug", () => {
  test("get products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
  });
  test("get products by slug", async () => {
    const res = await request(app).get("/products/1-dark-sword");
    expect(res.statusCode).toBe(200);
  });
  test("get products by slug", async () => {
    const res = await request(app).get("/products/1-dark");
    expect(res.statusCode).toBe(301);
  });
});

describe("pruebas de filtros :D", () => {
  test("get products by category", async () => {
    const res = await request(app).get("/products?category=1");
    expect(res.statusCode).toBe(200);
  });
  test("get products by tags", async () => {
    const res = await request(app).get("/products?tags=34, 35");
    expect(res.statusCode).toBe(200);
  });
  test("get products by search", async () => {
    const res = await request(app).get("/products?search=sword");
    expect(res.statusCode).toBe(200);
  });
  test("get products by rarity", async () => {
    const res = await request(app).get("/products?rarity=rare");
    expect(res.statusCode).toBe(200);
  });
  test("get products by effects", async () => {
    const res = await request(app).get("/products?effects=toDo");
    expect(res.statusCode).toBe(200);
  });
  test("get products by elements", async () => {
    const res = await request(app).get("/products?element=fire");
    expect(res.statusCode).toBe(200);
  });
  test("get products by min,max price", async () => {
    const res = await request(app).get("/products?min_price=500&max_price=800");
    expect(res.statusCode).toBe(200);
  });
});
