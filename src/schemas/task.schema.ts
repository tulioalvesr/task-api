import { z } from "zod";

const status = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const priority = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Informe o título").max(120),
  description: z.string().max(1000).optional(),
  status: status.optional(),
  priority: priority.optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export const listTasksQuerySchema = z.object({
  status: status.optional(),
  priority: priority.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;