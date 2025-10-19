import app from "../src/app.js";
import request from "supertest";

describe("GET /about", () => {
  test("deveria devolver un statusCode 200", async () => {
    const response = await request(app).get("/about").send();
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /ping", () => {
  test("deveria devolver un statusCode 200", async () => {
    const response = await request(app).get("/ping").send();
    expect(response.statusCode).toBe(200);
  });
});
