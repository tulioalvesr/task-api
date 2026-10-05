import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Token não informado");
  }

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    throw new AppError(401, "Token inválido ou expirado");
  }
}

export const authorize =
  (...roles: Array<"USER" | "ADMIN">) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "Sem permissão para esta ação");
    }
    next();
  };