"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new AppError_1.AppError(401, "Token não informado");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(header.slice(7), env_1.env.jwtSecret);
        req.user = { id: Number(payload.sub), role: payload.role };
        next();
    }
    catch {
        throw new AppError_1.AppError(401, "Token inválido ou expirado");
    }
}
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw new AppError_1.AppError(403, "Sem permissão para esta ação");
    }
    next();
};
exports.authorize = authorize;
