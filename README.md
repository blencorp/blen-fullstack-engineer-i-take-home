# BLEN Corp — Senior Software Developer I (Full Stack) Take-Home

## Overview

Build a **Task Tracker** application with a REST API and a dashboard UI. The project skeleton is provided: database schema, migrations, seed data, and a full test suite. Your job is to implement the API route handlers and build a polished dashboard.

## What's Provided

| Layer | Details |
| --- | --- |
| **Database** | PostgreSQL 16 via Docker, Drizzle ORM schema with `projects` and `tasks` tables |
| **Migrations** | Auto-generated SQL migration and helper scripts (`db:migrate`, `db:seed`, `db:reset`) |
| **Test suite** | 35 Jest tests covering all API endpoints, status transitions, and edge cases |
| **API scaffolds** | Route files with detailed JSDoc comments and `501 Not Implemented` stubs |
| **UI foundation** | Next.js 16 with shadcn/ui, dark mode, Tailwind CSS, and lucide-react icons |

## What to Build

### 1. API Endpoints (all tests must pass)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | List projects (optional `status` filter and `includeTasks` flag) |
| `POST` | `/api/projects` | Create a project (unique name required) |
| `GET` | `/api/projects/:id` | Get project with task counts |
| `PATCH` | `/api/projects/:id` | Update project fields |
| `DELETE` | `/api/projects/:id` | Delete project (blocked if it has active tasks) |
| `GET` | `/api/tasks` | Paginated task list with filters (status, priority, assignee, projectId) |
| `POST` | `/api/tasks` | Create a task (title and valid projectId required) |
| `GET` | `/api/tasks/:id` | Get task with parent project |
| `PATCH` | `/api/tasks/:id` | Update task fields with status transition validation |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**Status transition rules** (enforced on task updates):
```
open -> in_progress
in_progress -> in_review | open
in_review -> completed | in_progress
completed -> in_progress
```

### 2. Dashboard UI

Use **Next.js App Router patterns** — file-system routing, Server Components for data fetching, Client Components for interactivity.

Two page scaffolds are provided:
- **`app/page.tsx`** — Projects list (the dashboard home)
- **`app/projects/[id]/page.tsx`** — Project detail with task management

Build a multi-page dashboard that allows users to:

- View all projects with task count summaries
- Navigate to `/projects/[id]` using `next/link` for the detail view
- Create new projects
- View a project's tasks in a filterable table
- Create and edit tasks
- Transition task status using the allowed transitions
- Delete projects and tasks with confirmation
- Filter tasks by status, priority, and assignee

Use shadcn/ui components (`Card`, `Table`, `Dialog`, `Badge`, `Button`, `Select`, etc.) and follow the existing design tokens for dark mode support.

### 3. Solution Design (SOLUTION_DESIGN.md)

Answer the three architectural questions in `SOLUTION_DESIGN.md`.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (package manager and runtime)
- [Docker](https://www.docker.com/) (for PostgreSQL only)

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Start the database
docker compose up -d

# 3. Copy environment variables
cp .env.example .env

# 4. Run migrations
bun run db:migrate

# 5. Seed sample data
bun run db:seed

# 6. Start the dev server
bun run dev
```

The app runs at **http://localhost:3001**.

### Running Tests

```bash
# Run all tests (35 total)
bun test

# Run tests in watch mode
bun run test:watch

# Run full check (typecheck + lint + test)
bun run check
```

### Resetting the Database

```bash
bun run db:reset && bun run db:seed
```

## Submission

1. Implement all API routes (replace the `TODO` stubs)
2. Build the dashboard UI
3. Answer the questions in `SOLUTION_DESIGN.md`
4. Ensure all 35 tests pass, typecheck is clean, and lint passes
5. Push your solution to a branch named `solution`

## Evaluation Criteria

| Category | Weight | What We Look For |
| --- | --- | --- |
| **Tests passing** | 40% | All 35 tests green. Correct HTTP status codes, validation, and edge cases. |
| **Code quality** | 25% | Clean TypeScript, proper error handling, no shortcuts, good separation of concerns. |
| **UI/UX** | 20% | Functional dashboard, good use of shadcn/ui, responsive design, dark mode support. |
| **Solution design** | 15% | Thoughtful, practical answers to the architectural questions. |

Good luck!
