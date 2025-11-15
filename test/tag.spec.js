import request from "supertest";

import app from "../src/app.js";

const agent = request.agent(app);

describe("CRUD de tag con validaciones de token invalido", () => {
  test("get all tags", async () => {
    const res = await request(app).get("/tags");
    expect(res.statusCode).toBe(401);
  });
  test("get a tag by id", async () => {
    const res = await request(app).get("/tags/1");
    expect(res.statusCode).toBe(401);
  });
  test("post a tag", async () => {
    const res = await request(app).post("/tags").send({ name: "blue" });
    expect(res.statusCode).toBe(401);
  });
  test("put a tag", async () => {
    const res = await request(app).put("/tags/1").send({ name: "green" });
    expect(res.statusCode).toBe(401);
  });
  test("delete a tag", async () => {
    const res = await request(app).delete("/tags/1");
    expect(res.statusCode).toBe(401);
  });
});

describe("CRUD de tag con validaciones de token valido", () => {
  test("login with correct credentials should return 200", async () => {
    const res = await agent
      .post("/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
    expect(res.statusCode).toBe(200);
  });
  test("get all tags", async () => {
    const res = await agent.get("/tags");
    expect(res.statusCode).toBe(200);
  });
  test("get a tag by id", async () => {
    const res = await agent.get("/tags/1");
    expect(res.statusCode).toBe(200);
  });
  test("post a tag", async () => {
    const res = await agent
      .post("/tags")
      .send({ id: 1, name: Date.now().toString() });
    expect(res.statusCode).toBe(200);
  });
  test("put a tag", async () => {
    const res = await agent.put("/tags/1").send({ name: "green" });
    expect(res.statusCode).toBe(200);
  });
  test("delete a tag", async () => {
    const res = await agent.delete("/tags/1");
    expect(res.statusCode).toBe(200);
  });
});
