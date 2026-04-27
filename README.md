# BLEN — Senior Software Developer I (Full Stack) Take-Home

## Candidate Info

> **Please fill this in before submitting.** This helps our reviewers identify your submission.

| Field | Your answer |
|-------|-------------|
| **Name** | <!-- Your full name --> |
| **Email** | <!-- Your email address --> |
| **GitHub** | <!-- Your GitHub username --> |
| **Date submitted** | <!-- e.g. 2026-03-24 --> |

---

## Overview

Build a **Task Tracker** application with a REST API and a dashboard UI. The project skeleton is provided: database schema, migrations, seed data, and a full test suite. Your job is to implement the API route handlers and build a polished dashboard.

**Time expectation:** Please submit within 24 hours. Focus on clean, working code over polish.

## What's Provided

| Layer | Details |
| --- | --- |
| **Database** | PostgreSQL 16 via Docker, Drizzle ORM schema with `projects` and `tasks` tables |
| **Migrations** | Auto-generated SQL migration and helper scripts (`db:migrate`, `db:seed`, `db:reset`) |
| **Test suite** | 36 Jest tests covering all API endpoints, status transitions, and edge cases |
| **API scaffolds** | Route files with detailed JSDoc comments and `501 Not Implemented` stubs |
| **UI foundation** | Next.js 16 with shadcn/ui, dark mode, Tailwind CSS, and lucide-react icons |

## What to Build

### 1. API Endpoints (all tests must pass)

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/projects` | List projects with task counts (optional `status` filter) |
| `POST` | `/api/projects` | Create a project (unique name required) |
| `GET` | `/api/projects/:id` | Get project with task counts |
| `PATCH` | `/api/projects/:id` | Update project fields |
| `DELETE` | `/api/projects/:id` | Delete project (blocked if any task is not yet `completed`) |
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
# Run all tests (36 total)
bun run test

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

1. Click **"Use this template"** on GitHub to create a **private** copy of this repo
2. **Fill in the Candidate Info table at the top of this README**
3. Implement all API routes (replace the `TODO` stubs)
4. Build the dashboard UI
5. Answer the questions in `SOLUTION_DESIGN.md`
6. Ensure all 36 tests pass, typecheck is clean, and lint passes
7. Add the following GitHub users as **collaborators** on your repo ([how to add collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)):
   - `naodya` (Naod — Engineering)
   - `juliusoh` (Julius — Engineering)
8. Send the repo link to your BLEN recruiting contact

## Evaluation Criteria

| Category | Weight | What We Look For |
| --- | --- | --- |
| **Tests passing** | 35% | All 36 tests green. Correct HTTP status codes, validation, and edge cases. |
| **Code quality** | 30% | Clean TypeScript, proper error handling, no shortcuts, good separation of concerns. |
| **Solution design** | 20% | Thoughtful, practical answers to the architectural questions. |
| **UI/UX** | 15% | Functional dashboard, good use of shadcn/ui, responsive design, dark mode support. |

## Questions?

If anything is unclear, reach out. We'd rather you ask than guess.

Good luck!
