import { Router } from "express";
import { me } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";

export const userRoutes = Router();

userRoutes.get("/me", authenticate, me);