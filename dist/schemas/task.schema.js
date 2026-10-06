"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.listTasksQuerySchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const status = zod_1.z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const priority = zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]);
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Informe o título").max(120),
    description: zod_1.z.string().max(1000).optional(),
    status: status.optional(),
    priority: priority.optional(),
    dueDate: zod_1.z.coerce.date().optional(),
});
exports.updateTaskSchema = exports.createTaskSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
});
exports.listTasksQuerySchema = zod_1.z.object({
    status: status.optional(),
    priority: priority.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    sortBy: zod_1.z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
    order: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
