import { beforeEach, afterAll } from "vitest";
import { prisma } from "../src/lib/prisma";

// trava de segurança: nunca roda contra um banco que não seja de teste
if (!process.env.DATABASE_URL?.includes("test")) {
  throw new Error("DATABASE_URL não aponta para um banco de teste. Abortando.");
}

beforeEach(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});