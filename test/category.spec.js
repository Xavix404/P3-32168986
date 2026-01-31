import request from "supertest";

import app from "../src/app.js";

const agent = request.agent(app);

describe("CRUD de categories con validaciones de token invalido", () => {
  test("get all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(401);
  });
  test("get a categories by id", async () => {
    const res = await request(app).get("/api/categories/1");
    expect(res.statusCode).toBe(401);
  });
  test("post a categories", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send({ name: "blue" });
    expect(res.statusCode).toBe(401);
  });
  test("put a categories", async () => {
    const res = await request(app)
      .put("/api/categories/1")
      .send({ name: "green" });
    expect(res.statusCode).toBe(401);
  });
  test("delete a categories", async () => {
    const res = await request(app).delete("/api/categories/1");
    expect(res.statusCode).toBe(401);
  });
});

describe("CRUD de categories con validaciones de token valido", () => {
  test("login with correct credentials should return 200", async () => {
    const res = await agent
      .post("/api/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
    expect(res.statusCode).toBe(200);
  });
  test("get all categories", async () => {
    const res = await agent.get("/api/categories");
    expect(res.statusCode).toBe(200);
  });
  test("get a categories by id", async () => {
    const res = await agent.get("/api/categories/1");
    expect(res.statusCode).toBe(200);
  });
  test("post a categories", async () => {
    const res = await agent
      .post("/api/categories")
      .send({ id: 1, name: Date.now().toString(), description: "jaja salu2" });
    expect(res.statusCode).toBe(200);
  });
  test("put a categories", async () => {
    const res = await agent.put("/api/categories/1").send({
      name: "weapons",
      description: "amazing weapons to fight monsters",
    });
    expect(res.statusCode).toBe(200);
  });
  test("delete a categories", async () => {
    const res = await agent.delete("/api/categories/1");
    expect(res.statusCode).toBe(200);
  });
});
