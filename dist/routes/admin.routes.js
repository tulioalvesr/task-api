"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middlewares/auth");
exports.adminRoutes = (0, express_1.Router)();
exports.adminRoutes.use(auth_1.authenticate, (0, auth_1.authorize)("ADMIN"));
exports.adminRoutes.get("/users", async (_req, res) => {
    const users = await prisma_1.prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { id: "asc" },
    });
    res.json(users);
});
