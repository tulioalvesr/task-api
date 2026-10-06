import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { createUser, createTask } from "./helpers";

describe("Tarefas", () => {
  it("exige autenticação", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(401);
  });

  it("cria tarefa com valores padrão", async () => {
    const { auth } = await createUser("a@teste.com");
    const res = await createTask(auth, { title: "Estudar Prisma" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Estudar Prisma",
      status: "PENDING",
      priority: "MEDIUM",
    });
  });

  it("valida os dados de entrada", async () => {
    const { auth } = await createUser("a@teste.com");

    const semTitulo = await createTask(auth, { priority: "HIGH" });
    expect(semTitulo.status).toBe(400);

    const limiteAbsurdo = await request(app)
      .get("/tasks?limit=500")
      .set("Authorization", auth);
    expect(limiteAbsurdo.status).toBe(400);
  });

  it("pagina e filtra a listagem", async () => {
    const { auth } = await createUser("a@teste.com");
    await createTask(auth, { title: "T1", status: "DONE" });
    await createTask(auth, { title: "T2" });
    await createTask(auth, { title: "T3" });

    const pagina = await request(app)
      .get("/tasks?limit=2&page=1")
      .set("Authorization", auth);
    expect(pagina.body.data).toHaveLength(2);
    expect(pagina.body).toMatchObject({ total: 3, totalPages: 2 });

    const filtrada = await request(app)
      .get("/tasks?status=DONE")
      .set("Authorization", auth);
    expect(filtrada.body.total).toBe(1);
    expect(filtrada.body.data[0].title).toBe("T1");
  });

  it("atualiza e remove uma tarefa", async () => {
    const { auth } = await createUser("a@teste.com");
    const { body: tarefa } = await createTask(auth, { title: "Antiga" });

    const atualizada = await request(app)
      .put(`/tasks/${tarefa.id}`)
      .set("Authorization", auth)
      .send({ status: "DONE" });
    expect(atualizada.status).toBe(200);
    expect(atualizada.body.status).toBe("DONE");

    const removida = await request(app)
      .delete(`/tasks/${tarefa.id}`)
      .set("Authorization", auth);
    expect(removida.status).toBe(204);

    const busca = await request(app)
      .get(`/tasks/${tarefa.id}`)
      .set("Authorization", auth);
    expect(busca.status).toBe(404);
  });

  it("isola as tarefas entre usuários", async () => {
    const a = await createUser("a@teste.com");
    const b = await createUser("b@teste.com");
    const { body: tarefa } = await createTask(a.auth, { title: "Privada" });

    const lista = await request(app).get("/tasks").set("Authorization", b.auth);
    expect(lista.body.total).toBe(0);

    const busca = await request(app)
      .get(`/tasks/${tarefa.id}`)
      .set("Authorization", b.auth);
    expect(busca.status).toBe(404);

    const edita = await request(app)
      .put(`/tasks/${tarefa.id}`)
      .set("Authorization", b.auth)
      .send({ title: "Invadida" });
    expect(edita.status).toBe(404);

    const apaga = await request(app)
      .delete(`/tasks/${tarefa.id}`)
      .set("Authorization", b.auth);
    expect(apaga.status).toBe(404);
  });

  it("permite que ADMIN veja tarefas de todos", async () => {
    const user = await createUser("a@teste.com");
    const admin = await createUser("admin@teste.com", "ADMIN");
    await createTask(user.auth, { title: "Do usuário" });

    const res = await request(app).get("/tasks").set("Authorization", admin.auth);
    expect(res.body.total).toBe(1);
  });
});

describe("Rotas de admin", () => {
  it("bloqueia USER com 403", async () => {
    const { auth } = await createUser("a@teste.com");
    const res = await request(app).get("/admin/users").set("Authorization", auth);
    expect(res.status).toBe(403);
  });

  it("lista usuários para ADMIN", async () => {
    await createUser("a@teste.com");
    const admin = await createUser("admin@teste.com", "ADMIN");

    const res = await request(app).get("/admin/users").set("Authorization", admin.auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});