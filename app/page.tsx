/**
 * Projects Dashboard
 *
 * TODO: Build a projects list page that:
 * - Fetches projects from GET /api/projects (can use a Server Component or client-side fetch)
 * - Displays each project as a card with name, description, status, and task count
 * - Links to /projects/[id] for the detail view
 * - Includes a way to create new projects
 *
 * Consider using Server Components for the initial data fetch and
 * Client Components for interactive elements (forms, dialogs).
 */
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Task Tracker</h1>
      <p className="text-muted-foreground">Replace this with your projects dashboard.</p>
    </main>
  );
}
