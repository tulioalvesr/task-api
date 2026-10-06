import { Router } from "express";
import * as controller from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

export const taskRoutes = Router();

taskRoutes.use(authenticate);

taskRoutes.get("/", controller.list);
taskRoutes.post("/", validate(createTaskSchema), controller.create);
taskRoutes.get("/:id", controller.getById);
taskRoutes.put("/:id", validate(updateTaskSchema), controller.update);
taskRoutes.delete("/:id", controller.remove);