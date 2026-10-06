"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
async function register({ name, email, password }) {
    const exists = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (exists)
        throw new AppError_1.AppError(409, "E-mail já cadastrado");
    const hash = await bcrypt_1.default.hash(password, 10);
    return prisma_1.prisma.user.create({
        data: { name, email, password: hash },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
}
async function login(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    const valid = user && (await bcrypt_1.default.compare(password, user.password));
    if (!user || !valid)
        throw new AppError_1.AppError(401, "Credenciais inválidas");
    const token = jsonwebtoken_1.default.sign({ role: user.role }, env_1.env.jwtSecret, {
        subject: String(user.id),
        expiresIn: "1d",
    });
    return { token };
}
