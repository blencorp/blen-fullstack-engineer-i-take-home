import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/tasks
 *
 * Returns a paginated list of tasks, ordered by creation date (newest first).
 *
 * Query parameters:
 *   - page (optional): Page number, defaults to 1
 *   - pageSize (optional): Items per page, defaults to 20
 *   - status (optional): Filter by task status
 *   - priority (optional): Filter by task priority
 *   - assignee (optional): Filter by assignee name
 *   - projectId (optional): Filter by project ID
 *
 * Response: PaginatedResponse<Task>
 *   {
 *     data: Task[],
 *     pagination: { page, pageSize, total, totalPages }
 *   }
 *
 * Drizzle hints:
 *   - Build conditions array with `and()` for multiple filters
 *   - Use `.limit(pageSize).offset((page - 1) * pageSize)` for pagination
 *   - Use a separate count query for total
 */
export async function GET(_request: NextRequest) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * POST /api/tasks
 *
 * Creates a new task.
 *
 * Request body:
 *   - title (required): Task title — return 400 if missing
 *   - projectId (required): UUID of the parent project — return 400 if missing or project not found
 *   - description (optional): Task description
 *   - status (optional): Defaults to "open"
 *   - priority (optional): Defaults to "medium"
 *   - assignee (optional): Assignee name
 *   - dueDate (optional): ISO date string
 *   - labels (optional): Array of label strings
 *
 * Response: 201 with the created Task
 *
 * Drizzle hints:
 *   - Verify projectId exists: `db.query.projects.findFirst({ where: eq(projects.id, projectId) })`
 *   - Use `db.insert(tasks).values({ ... }).returning()`
 */
export async function POST(_request: NextRequest) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}
