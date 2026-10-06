import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middlewares/auth";

export const adminRoutes = Router();

adminRoutes.use(authenticate, authorize("ADMIN"));

adminRoutes.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { id: "asc" },
  });
  res.json(users);
});