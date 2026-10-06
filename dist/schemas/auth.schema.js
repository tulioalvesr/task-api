"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
    email: zod_1.z.email("E-mail inválido"),
    password: zod_1.z.string().min(8, "A senha precisa ter ao menos 8 caracteres"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("E-mail inválido"),
    password: zod_1.z.string().min(1, "Informe a senha"),
});
