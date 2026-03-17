import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/tasks/:id
 *
 * Returns a single task by ID, including its parent project.
 *
 * Response: Task & { project: Project }
 *
 * Return 404 if the task does not exist.
 *
 * Drizzle hints:
 *   - Use `db.query.tasks.findFirst({ where: eq(tasks.id, id), with: { project: true } })`
 */
export async function GET(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * PATCH /api/tasks/:id
 *
 * Updates a task's fields. Any subset of fields can be sent.
 *
 * Status transition rules (return 400 if violated):
 *   - open → in_progress
 *   - in_progress → in_review | open
 *   - in_review → completed | in_progress
 *   - completed → in_progress
 *
 * Use VALID_STATUS_TRANSITIONS from "@/lib/types" to validate.
 *
 * Non-status fields (title, description, priority, assignee, dueDate, labels)
 * can be updated freely.
 *
 * Return 404 if the task does not exist.
 * Set updatedAt to current timestamp on every update.
 *
 * Drizzle hints:
 *   - First fetch the task to check current status
 *   - Use `db.update(tasks).set({ ... }).where(eq(tasks.id, id)).returning()`
 */
export async function PATCH(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * DELETE /api/tasks/:id
 *
 * Deletes a task by ID.
 *
 * Return 404 if the task does not exist.
 * Return 200 with the deleted task on success.
 *
 * Drizzle hints:
 *   - Use `db.delete(tasks).where(eq(tasks.id, id)).returning()`
 *   - Check if the returned array is empty for 404
 */
export async function DELETE(_request: NextRequest, _context: RouteContext) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}
