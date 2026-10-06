"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../utils/AppError");
async function me(req, res) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user)
        throw new AppError_1.AppError(404, "Usuário não encontrado");
    res.json(user);
}
