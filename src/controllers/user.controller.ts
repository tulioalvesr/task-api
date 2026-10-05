import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError(404, "Usuário não encontrado");
  res.json(user);
}