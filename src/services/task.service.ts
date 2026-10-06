import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import {
  CreateTaskInput,
  UpdateTaskInput,
  ListTasksQuery,
} from "../schemas/task.schema";

type AuthUser = NonNullable<Express.Request["user"]>;

// ADMIN enxerga tudo; USER só as próprias tarefas
const scope = (user: AuthUser) =>
  user.role === "ADMIN" ? {} : { userId: user.id };

export async function list(user: AuthUser, query: ListTasksQuery) {
  const { status, priority, page, limit, sortBy, order } = query;
  const where = { ...scope(user), status, priority };

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export async function getById(user: AuthUser, id: number) {
  const task = await prisma.task.findFirst({
    where: { id, ...scope(user) },
  });
  // 404 também quando a tarefa é de outro usuário, para não revelar que ela existe
  if (!task) throw new AppError(404, "Tarefa não encontrada");
  return task;
}

export function create(user: AuthUser, data: CreateTaskInput) {
  return prisma.task.create({ data: { ...data, userId: user.id } });
}

export async function update(user: AuthUser, id: number, data: UpdateTaskInput) {
  await getById(user, id);
  return prisma.task.update({ where: { id }, data });
}

export async function remove(user: AuthUser, id: number) {
  await getById(user, id);
  await prisma.task.delete({ where: { id } });
}