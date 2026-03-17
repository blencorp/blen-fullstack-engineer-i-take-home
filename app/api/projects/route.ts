import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/projects
 *
 * Returns a list of all projects, ordered by creation date (newest first).
 *
 * Query parameters:
 *   - status (optional): Filter by project status ("active" | "completed" | "archived")
 *   - includeTasks (optional): When "true", include taskCount and completedTaskCount
 *
 * Response: Project[] (with optional taskCount and completedTaskCount fields)
 *
 * Drizzle hints:
 *   - Use `db.select()` from the projects table
 *   - For task counts, use `db.select({ ... count(tasks.id) ... })` with left join and groupBy
 *   - Use `eq()` for filtering, `desc()` for ordering
 */
export async function GET(_request: NextRequest) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}

/**
 * POST /api/projects
 *
 * Creates a new project.
 *
 * Request body:
 *   - name (required): Unique project name — return 400 if missing, 409 if duplicate
 *   - description (optional): Project description
 *   - status (optional): Defaults to "active"
 *
 * Response: 201 with the created Project
 *
 * Drizzle hints:
 *   - Use `db.insert(projects).values({ ... }).returning()`
 *   - Catch unique constraint violations (error code "23505") and return 409
 */
export async function POST(_request: NextRequest) {
  // TODO: Implement
  return NextResponse.json(
    { error: "Not implemented" },
    { status: 501 },
  );
}
