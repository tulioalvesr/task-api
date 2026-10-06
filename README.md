# Task API

API REST para gerenciamento de tarefas, com autenticação JWT e controle de acesso por perfil (USER e ADMIN). Projeto de portfólio focado em back-end.

> Em desenvolvimento.

## Tecnologias

- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT e bcrypt (autenticação)
- Zod (validação)

## Funcionalidades

- [x] Cadastro de usuários com senha criptografada
- [x] Login com JWT
- [x] Rota protegida (`/users/me`)
- [x] Middleware de permissão por perfil
- [x] Validação de entrada e tratamento de erros padronizado
- [ ] CRUD de tarefas com filtros e paginação
- [ ] Testes automatizados
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

## Endpoints

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/health` | Verifica se a API está no ar | Não |
| POST | `/auth/register` | Cadastra usuário | Não |
| POST | `/auth/login` | Retorna o JWT | Não |
| GET | `/users/me` | Dados do usuário logado | Sim |

### Exemplo

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tulio","email":"tulio@teste.com","password":"12345678"}'
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
└── utils/
```

## Autor

Túlio Alves — [GitHub](https://github.com/tulioalvesr)