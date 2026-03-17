import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import postgres from "postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Dropping public schema...");
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Database reset complete.");

  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
