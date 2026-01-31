import request from "supertest";
import prisma from "../prisma/prisma.js";

// Ensure the app picks up .env via dotenv/config; JWT secret should be set there.
import app from "../src/app.js";

const agent = request.agent(app);

describe("Auth integration tests", () => {
  const unique = Date.now();
  const testUser = {
    email: `test+${unique}@example.com`,
    username: `testuser${unique}`,
    password: "password123",
  };

  afterAll(async () => {
    // cleanup any created test users
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  test("register should create a new user (200)", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(200);
    // verify created in DB
    const dbUser = await prisma.user.findFirst({
      where: { email: testUser.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser.email).toBe(testUser.email);
  });

  test("registering same email twice should return 422", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(422);
  });

  test("login with correct credentials should return 200 and set cookie", async () => {
    const res = await agent
      .post("/api/auth/login")
      .send({ username: "CoppyCat", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("access protected /user with cookie should return 200", async () => {
    const res = await agent.get("/api/users").send();
    expect(res.statusCode).toBe(200);
  });

  test("login with wrong password should return 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: testUser.username, password: "wrongpass" });
    expect(res.statusCode).toBe(400);
  });
});
