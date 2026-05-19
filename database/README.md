# ProjectNest Database

Phase 1 initializes the core relational schema for logical multi-tenant isolation.

## Tables

- `users`: platform identities.
- `workspaces`: tenant boundary, owned by a user.
- `memberships`: explicit user-to-workspace junction with roles.
- `projects`: workspace-scoped projects.
- `tasks`: workspace-scoped Kanban task records with status, priority, assignee, and attachment fields.

## Run

```bash
psql "$DATABASE_URL" -f database/init.sql
```

Optional Phase 2 demo data:

```bash
psql "$DATABASE_URL" -f database/seed.sql
```

The Express app reads the database connection from `DATABASE_URL`.
