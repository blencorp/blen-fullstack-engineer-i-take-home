import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/projects/:id
 *
 * Returns a single project by ID, including task counts.
 *
 * Response fields:
 *   - All project fields
 *   - taskCount: total number of tasks
 *   - completedTaskCount: number of tasks with status "completed"
 *
 * Return 404 if the project does not exist.
 *
 * Drizzle hints:
 *   - Use `db.query.projects.findFirst()` with `where: eq(projects.id, id)`
 *   - Query task counts separately: `db.select({ count: count() }).from(tasks).where(...)`
 */
export async function GET(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * PATCH /api/projects/:id
 *
 * Updates a project's fields. Any subset of fields can be sent.
 *
 * Request body (all optional):
 *   - name: New project name — return 409 if duplicate
 *   - description: New description
 *   - status: New status ("active" | "completed" | "archived")
 *
 * Return 404 if the project does not exist.
 * Set updatedAt to current timestamp on every update.
 *
 * Drizzle hints:
 *   - Use `db.update(projects).set({ ... }).where(eq(projects.id, id)).returning()`
 *   - Catch unique constraint violations (error code "23505") and return 409
 */
export async function PATCH(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * DELETE /api/projects/:id
 *
 * Deletes a project by ID.
 *
 * Business rules:
 *   - Return 404 if the project does not exist
 *   - Return 409 if the project has any non-completed tasks (status != "completed")
 *     with message: "Cannot delete project with active tasks"
 *   - Projects with only completed tasks (or no tasks) can be deleted
 *
 * Drizzle hints:
 *   - First check if project exists
 *   - Count non-completed tasks: `db.select({ count: count() }).from(tasks).where(and(eq(...), ne(tasks.status, "completed")))`
 *   - Use `db.delete(projects).where(eq(projects.id, id))`
 */
export async function DELETE(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}
