import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

export async function createUser(email: string, role: "USER" | "ADMIN" = "USER") {
  const password = "12345678";
  await request(app).post("/auth/register").send({ name: "Teste", email, password });

  if (role === "ADMIN") {
    await prisma.user.update({ where: { email }, data: { role } });
  }

  // o login vem depois do ajuste de perfil, pois o role vai dentro do token
  const res = await request(app).post("/auth/login").send({ email, password });
  return { auth: `Bearer ${res.body.token}` as string };
}

export function createTask(auth: string, body: Record<string, unknown>) {
  return request(app).post("/tasks").set("Authorization", auth).send(body);
}