import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/takehome";

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

beforeEach(async () => {
  // Clean tables before each test (tasks first due to FK constraint)
  await db.delete(schema.tasks);
  await db.delete(schema.projects);
});

afterAll(async () => {
  await client.end();
});
