import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { taskRoutes } from "./routes/task.routes";
import { adminRoutes } from "./routes/admin.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);