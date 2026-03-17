import { createRequest, parseResponse } from "../helpers/request";
import { GET, POST } from "@/app/api/projects/route";
import {
  GET as GET_BY_ID,
  PATCH as PATCH_BY_ID,
  DELETE as DELETE_BY_ID,
} from "@/app/api/projects/[id]/route";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/schema";
import type { Project } from "@/lib/schema";

/** Helper to create a project directly in the database. */
async function seedProject(
  overrides: Partial<typeof projects.$inferInsert> = {},
) {
  const [project] = await db
    .insert(projects)
    .values({
      name: overrides.name ?? "Test Project",
      description: overrides.description ?? "A test project",
      status: overrides.status ?? "active",
    })
    .returning();
  return project;
}

/** Helper to create a task for a project. */
async function seedTask(
  projectId: string,
  overrides: Partial<typeof tasks.$inferInsert> = {},
) {
  const [task] = await db
    .insert(tasks)
    .values({
      title: overrides.title ?? "Test Task",
      projectId,
      status: overrides.status ?? "open",
      priority: overrides.priority ?? "medium",
    })
    .returning();
  return task;
}

// ---------------------------------------------------------------------------
// POST /api/projects
// ---------------------------------------------------------------------------

describe("POST /api/projects", () => {
  it("should create a project and return 201", async () => {
    const req = createRequest("/api/projects", {
      method: "POST",
      body: { name: "New Project", description: "Desc" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseResponse<Project>(res);
    expect(body.name).toBe("New Project");
    expect(body.description).toBe("Desc");
    expect(body.status).toBe("active");
    expect(body.id).toBeDefined();
  });

  it("should return 400 when name is missing", async () => {
    const req = createRequest("/api/projects", {
      method: "POST",
      body: { description: "No name" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 409 when name is duplicate", async () => {
    await seedProject({ name: "Duplicate" });

    const req = createRequest("/api/projects", {
      method: "POST",
      body: { name: "Duplicate" },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects
// ---------------------------------------------------------------------------

describe("GET /api/projects", () => {
  it("should list all projects", async () => {
    await seedProject({ name: "P1" });
    await seedProject({ name: "P2" });

    const req = createRequest("/api/projects");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await parseResponse<Project[]>(res);
    expect(body).toHaveLength(2);
  });

  it("should filter projects by status", async () => {
    await seedProject({ name: "Active", status: "active" });
    await seedProject({ name: "Completed", status: "completed" });

    const req = createRequest("/api/projects", {
      searchParams: { status: "active" },
    });
    const res = await GET(req);
    const body = await parseResponse<Project[]>(res);
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe("Active");
  });

  it("should include task counts when requested", async () => {
    const p = await seedProject({ name: "WithTasks" });
    await seedTask(p.id, { status: "open" });
    await seedTask(p.id, { status: "completed" });

    const req = createRequest("/api/projects", {
      searchParams: { includeTasks: "true" },
    });
    const res = await GET(req);
    const body = await parseResponse<
      (Project & { taskCount: number; completedTaskCount: number })[]
    >(res);
    expect(body).toHaveLength(1);
    expect(body[0].taskCount).toBe(2);
    expect(body[0].completedTaskCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id
// ---------------------------------------------------------------------------

describe("GET /api/projects/:id", () => {
  it("should return a project with task counts", async () => {
    const p = await seedProject({ name: "Detail" });
    await seedTask(p.id, { status: "open" });
    await seedTask(p.id, { status: "in_progress" });
    await seedTask(p.id, { status: "completed" });

    const req = createRequest(`/api/projects/${p.id}`);
    const res = await GET_BY_ID(req, { params: Promise.resolve({ id: p.id }) });
    expect(res.status).toBe(200);

    const body = await parseResponse<
      Project & { taskCount: number; completedTaskCount: number }
    >(res);
    expect(body.name).toBe("Detail");
    expect(body.taskCount).toBe(3);
    expect(body.completedTaskCount).toBe(1);
  });

  it("should return 404 for unknown id", async () => {
    const req = createRequest(
      "/api/projects/00000000-0000-0000-0000-000000000000",
    );
    const res = await GET_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/projects/:id
// ---------------------------------------------------------------------------

describe("PATCH /api/projects/:id", () => {
  it("should update project fields", async () => {
    const p = await seedProject({ name: "Old Name" });

    const req = createRequest(`/api/projects/${p.id}`, {
      method: "PATCH",
      body: { name: "New Name", status: "completed" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: p.id }),
    });
    expect(res.status).toBe(200);

    const body = await parseResponse<Project>(res);
    expect(body.name).toBe("New Name");
    expect(body.status).toBe("completed");
  });

  it("should return 409 when updating to duplicate name", async () => {
    await seedProject({ name: "Existing" });
    const p = await seedProject({ name: "ToUpdate" });

    const req = createRequest(`/api/projects/${p.id}`, {
      method: "PATCH",
      body: { name: "Existing" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: p.id }),
    });
    expect(res.status).toBe(409);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/projects/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/projects/:id", () => {
  it("should delete a project with no active tasks", async () => {
    const p = await seedProject({ name: "ToDelete" });

    const req = createRequest(`/api/projects/${p.id}`, { method: "DELETE" });
    const res = await DELETE_BY_ID(req, {
      params: Promise.resolve({ id: p.id }),
    });
    expect(res.status).toBe(200);
  });

  it("should return 409 when project has active tasks", async () => {
    const p = await seedProject({ name: "HasTasks" });
    await seedTask(p.id, { status: "in_progress" });

    const req = createRequest(`/api/projects/${p.id}`, { method: "DELETE" });
    const res = await DELETE_BY_ID(req, {
      params: Promise.resolve({ id: p.id }),
    });
    expect(res.status).toBe(409);
  });

  it("should return 404 for unknown project", async () => {
    const req = createRequest(
      "/api/projects/00000000-0000-0000-0000-000000000000",
      { method: "DELETE" },
    );
    const res = await DELETE_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    expect(res.status).toBe(404);
  });
});
