import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { idParamSchema, listTasksQuerySchema } from "../schemas/task.schema";

export async function list(req: Request, res: Response) {
  const query = listTasksQuerySchema.parse(req.query);
  res.json(await taskService.list(req.user!, query));
}

export async function getById(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await taskService.getById(req.user!, id));
}

export async function create(req: Request, res: Response) {
  const task = await taskService.create(req.user!, req.body);
  res.status(201).json(task);
}

export async function update(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  res.json(await taskService.update(req.user!, id, req.body));
}

export async function remove(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  await taskService.remove(req.user!, id);
  res.status(204).send();
}