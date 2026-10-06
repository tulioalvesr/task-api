# Task API

API REST para gerenciamento de tarefas, com autenticação JWT, controle de acesso por perfil (USER e ADMIN) e testes automatizados. Projeto de portfólio focado em back-end.

> Em desenvolvimento.

## Tecnologias

- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT e bcrypt (autenticação)
- Zod (validação)
- Vitest + Supertest (testes)

## Funcionalidades

- [x] Cadastro de usuários com senha criptografada
- [x] Login com JWT
- [x] Rota protegida (`/users/me`)
- [x] Permissão por perfil (USER e ADMIN)
- [x] Validação de entrada e tratamento de erros padronizado
- [x] CRUD de tarefas com filtros, ordenação e paginação
- [x] Isolamento de dados: cada usuário acessa apenas as próprias tarefas (ADMIN acessa todas)
- [x] Testes automatizados de integração
- [ ] Documentação Swagger
- [ ] Docker e CI/CD

## Como rodar localmente

**Pré-requisitos:** Node.js 20.19+ (ou 22.12+) e PostgreSQL.

```bash
git clone git@github.com:tulioalvesr/task-api.git
cd task-api
npm install
```

Crie um arquivo `.env` na raiz (veja o `.env.example`):

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskdb"
JWT_SECRET="uma_frase_longa_e_aleatoria"
PORT=3000
```

Crie as tabelas, gere o client do Prisma e suba o servidor:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

O servidor sobe em `http://localhost:3000`.

> O client do Prisma é gerado em `src/generated` e não é versionado, por isso o `npx prisma generate` é necessário após clonar o projeto.

## Testes

Os testes são de integração e rodam contra um **banco separado**, pois limpam as tabelas a cada execução. Há uma trava que aborta a execução se a `DATABASE_URL` não apontar para um banco de teste.

1. Crie o banco de testes:

```sql
CREATE DATABASE taskdb_test OWNER usuario;
```

2. Crie o arquivo `.env.test` na raiz:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskdb_test"
JWT_SECRET="segredo_de_teste"
PORT=3001
```

3. Aplique as migrations no banco de testes e rode:

```bash
npm run test:db
npm test
```

Cobertura dos testes: cadastro e login, validações, rotas protegidas, CRUD de tarefas, filtros e paginação, isolamento entre usuários e permissões de ADMIN.

## Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/health` | Verifica se a API está no ar | Não |
| POST | `/auth/register` | Cadastra usuário | Não |
| POST | `/auth/login` | Retorna o JWT | Não |
| GET | `/users/me` | Dados do usuário logado | Sim |
| GET | `/tasks` | Lista tarefas com filtros e paginação | Sim |
| POST | `/tasks` | Cria tarefa | Sim |
| GET | `/tasks/:id` | Busca uma tarefa | Sim |
| PUT | `/tasks/:id` | Atualiza tarefa | Sim |
| DELETE | `/tasks/:id` | Remove tarefa | Sim |
| GET | `/admin/users` | Lista todos os usuários | ADMIN |

A autenticação usa o header `Authorization: Bearer <token>`.

### Filtros da listagem (`GET /tasks`)

| Parâmetro | Valores | Padrão |
|---|---|---|
| `status` | `PENDING`, `IN_PROGRESS`, `DONE` | - |
| `priority` | `LOW`, `MEDIUM`, `HIGH` | - |
| `page` | número inteiro ≥ 1 | `1` |
| `limit` | 1 a 100 | `10` |
| `sortBy` | `createdAt`, `dueDate`, `priority` | `createdAt` |
| `order` | `asc`, `desc` | `desc` |

Exemplo de resposta:

```json
{
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 0
}
```

### Exemplos

```bash
# cadastrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tulio","email":"tulio@teste.com","password":"12345678"}'

# criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar Prisma","priority":"HIGH","dueDate":"2026-10-20"}'

# listar com filtro
curl "http://localhost:3000/tasks?priority=HIGH&page=1&limit=5" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Estrutura

```
src/
├── config/        # variáveis de ambiente
├── controllers/   # recebem a requisição e devolvem a resposta
├── services/      # regras de negócio
├── middlewares/   # autenticação, validação e erros
├── routes/
├── schemas/       # validações com Zod
├── lib/           # cliente do Prisma
├── types/
└── utils/
prisma/            # schema e migrations
tests/             # testes de integração
```

## Decisões técnicas

- **404 em vez de 403** quando um usuário tenta acessar a tarefa de outro, para não revelar que ela existe.
- **Camadas separadas** (rota, controller, service) para isolar as regras de negócio do HTTP.
- **Senhas com hash (bcrypt)** e nunca retornadas nas respostas.
- **Banco de testes isolado**, com trava de segurança contra execução no banco de desenvolvimento.

## Autor

Túlio Alves, [GitHub](https://github.com/tulioalvesr)