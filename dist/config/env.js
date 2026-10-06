"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function required(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Variável de ambiente ausente: ${name}`);
    return value;
}
exports.env = {
    port: Number(process.env.PORT ?? 3000),
    jwtSecret: required("JWT_SECRET"),
};
