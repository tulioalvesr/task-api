import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: err.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      })),
    });
  }

  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
}