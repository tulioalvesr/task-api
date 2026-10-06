"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../utils/AppError");
// ADMIN enxerga tudo; USER só as próprias tarefas
const scope = (user) => user.role === "ADMIN" ? {} : { userId: user.id };
async function list(user, query) {
    const { status, priority, page, limit, sortBy, order } = query;
    const where = { ...scope(user), status, priority };
    const [data, total] = await Promise.all([
        prisma_1.prisma.task.findMany({
            where,
            orderBy: { [sortBy]: order },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma_1.prisma.task.count({ where }),
    ]);
    return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
}
async function getById(user, id) {
    const task = await prisma_1.prisma.task.findFirst({
        where: { id, ...scope(user) },
    });
    // 404 também quando a tarefa é de outro usuário, para não revelar que ela existe
    if (!task)
        throw new AppError_1.AppError(404, "Tarefa não encontrada");
    return task;
}
function create(user, data) {
    return prisma_1.prisma.task.create({ data: { ...data, userId: user.id } });
}
async function update(user, id, data) {
    await getById(user, id);
    return prisma_1.prisma.task.update({ where: { id }, data });
}
async function remove(user, id) {
    await getById(user, id);
    await prisma_1.prisma.task.delete({ where: { id } });
}
