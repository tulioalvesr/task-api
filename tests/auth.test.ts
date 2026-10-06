import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createUser } from "./helpers";

const user = { name: "Tulio", email: "tulio@teste.com", password: "12345678" };

describe("Autenticação", () => {
  it("cadastra usuário sem expor a senha", async () => {
    const res = await request(app).post("/auth/register").send(user);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: user.email, role: "USER" });
    expect(res.body).not.toHaveProperty("password");
  });

  it("rejeita e-mail duplicado com 409", async () => {
    await request(app).post("/auth/register").send(user);
    const res = await request(app).post("/auth/register").send(user);

    expect(res.status).toBe(409);
  });

  it("rejeita senha curta com 400", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ ...user, password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.details[0].field).toBe("password");
  });

  it("faz login e devolve um token", async () => {
    await request(app).post("/auth/register").send(user);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("rejeita senha errada com 401", async () => {
    await request(app).post("/auth/register").send(user);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "senha_errada" });

    expect(res.status).toBe(401);
  });

  it("protege /users/me", async () => {
    const semToken = await request(app).get("/users/me");
    expect(semToken.status).toBe(401);

    const { auth } = await createUser("outro@teste.com");
    const comToken = await request(app).get("/users/me").set("Authorization", auth);
    expect(comToken.status).toBe(200);
    expect(comToken.body.email).toBe("outro@teste.com");
  });
});