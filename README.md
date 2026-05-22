# ProjectNest

ProjectNest is a decoupled multi-tenant project management platform built with React, Express, and PostgreSQL.

## Phase 3 Dev Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and a long random `JWT_SECRET`.
3. Apply the database schema and optional seed data:

```bash
psql "$DATABASE_URL" -f database/init.sql
psql "$DATABASE_URL" -f database/seed.sql
```

4. Start the API and client in separate terminals:

```bash
npm run server:dev
npm run client:dev
```

The seed users use `Password123!`.

## Phase 3 API

- `POST /api/auth/register`: create a user, default workspace, owner membership, and JWT.
- `POST /api/auth/login`: verify password with `bcryptjs` and return a JWT.
- `GET /api/auth/me`: return the authenticated user.
- `POST /api/upload?workspaceId=<id>&taskId=<id>`: upload an `attachment` file with Multer and save the returned secure workspace file URL on a task.
- `GET /api/workspaces/:workspaceId/uploads/:filename`: authenticated workspace-scoped file download.

Workspace board and task APIs require a valid JWT and verified workspace membership.

## Phase 4 And 5

- `GET /api/workspaces/:workspaceId/analytics`: raw Postgres analytics for velocity, backlog, and allocations.
- `GET /api/workspaces/:workspaceId/members`: owner-only member management data.
- `PATCH /api/workspaces/:workspaceId/members/:userId`: owner-only role update.
- `DELETE /api/workspaces/:workspaceId/tasks/:taskId`: owner-only task deletion.

Run cross-tenant checks after applying seed data and starting the API:

```bash
npm run security:cross-tenant
```
