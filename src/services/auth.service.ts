import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export async function register({ name, email, password }: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError(409, "E-mail já cadastrado");

  const hash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!user || !valid) throw new AppError(401, "Credenciais inválidas");

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: "1d",
  });

  return { token };
}