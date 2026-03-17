import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, tasks } from "../lib/schema";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding database...");

  // Create projects
  const [alpha, beta, legacy] = await db
    .insert(projects)
    .values([
      {
        name: "Project Alpha",
        description: "A next-generation web platform for real-time analytics.",
        status: "active",
      },
      {
        name: "Project Beta",
        description: "Mobile-first e-commerce application with AI recommendations.",
        status: "active",
      },
      {
        name: "Legacy Migration",
        description: "Migrate legacy monolith services to microservices architecture.",
        status: "completed",
      },
    ])
    .returning();

  // Create tasks
  await db.insert(tasks).values([
    {
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment.",
      status: "completed",
      priority: "high",
      assignee: "Alice",
      labels: ["devops", "infrastructure"],
      projectId: alpha.id,
    },
    {
      title: "Design database schema",
      description: "Create ERD and implement PostgreSQL schema with Drizzle ORM.",
      status: "in_review",
      priority: "critical",
      assignee: "Bob",
      labels: ["backend", "database"],
      projectId: alpha.id,
    },
    {
      title: "Implement authentication",
      description: "Add JWT-based auth with refresh tokens and role-based access.",
      status: "in_progress",
      priority: "high",
      assignee: "Alice",
      labels: ["backend", "security"],
      projectId: alpha.id,
    },
    {
      title: "Build product catalog API",
      description: "REST endpoints for product CRUD with search and filtering.",
      status: "open",
      priority: "medium",
      assignee: "Charlie",
      labels: ["backend", "api"],
      projectId: beta.id,
    },
    {
      title: "Design mobile UI mockups",
      description: "Create Figma mockups for all core screens.",
      status: "in_progress",
      priority: "medium",
      assignee: "Diana",
      labels: ["design", "mobile"],
      projectId: beta.id,
    },
    {
      title: "Decompose user service",
      description: "Extract user management from monolith into standalone service.",
      status: "completed",
      priority: "critical",
      assignee: "Bob",
      labels: ["backend", "migration"],
      projectId: legacy.id,
    },
    {
      title: "Data migration scripts",
      description: "Write and test scripts to migrate data from Oracle to PostgreSQL.",
      status: "completed",
      priority: "high",
      assignee: "Charlie",
      labels: ["database", "migration"],
      projectId: legacy.id,
    },
  ]);

  console.log("Seeded 3 projects and 7 tasks.");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
