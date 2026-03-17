/**
 * Project Detail Page
 *
 * TODO: Build a project detail page that:
 * - Uses the [id] param to fetch the project from GET /api/projects/:id
 * - Displays project info and task counts summary
 * - Lists all tasks with status/priority badges
 * - Allows creating, editing, and deleting tasks
 * - Supports filtering tasks by status, priority, and assignee
 * - Handles task status transitions (open -> in_progress -> in_review -> completed)
 *
 * The params are async in Next.js 16: const { id } = await params;
 */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Project Detail</h1>
      <p className="text-muted-foreground">Project ID: {id}</p>
      <p className="text-muted-foreground">Replace this with your project detail view.</p>
    </main>
  );
}
