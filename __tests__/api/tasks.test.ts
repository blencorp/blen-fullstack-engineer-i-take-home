import { createRequest, parseResponse } from "../helpers/request";
import { GET, POST } from "@/app/api/tasks/route";
import {
  GET as GET_BY_ID,
  PATCH as PATCH_BY_ID,
  DELETE as DELETE_BY_ID,
} from "@/app/api/tasks/[id]/route";
import { db } from "@/lib/db";
import { projects, tasks } from "@/lib/schema";
import type { Task } from "@/lib/schema";
import type { PaginatedResponse } from "@/lib/types";

/** Helper to create a project directly in the database. */
async function seedProject(name = "Test Project") {
  const [project] = await db
    .insert(projects)
    .values({ name, description: "Test" })
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
      assignee: overrides.assignee ?? null,
    })
    .returning();
  return task;
}

// ---------------------------------------------------------------------------
// POST /api/tasks
// ---------------------------------------------------------------------------

describe("POST /api/tasks", () => {
  it("should create a task and return 201", async () => {
    const p = await seedProject();
    const req = createRequest("/api/tasks", {
      method: "POST",
      body: { title: "New Task", projectId: p.id, priority: "high" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseResponse<Task>(res);
    expect(body.title).toBe("New Task");
    expect(body.priority).toBe("high");
    expect(body.status).toBe("open");
    expect(body.projectId).toBe(p.id);
  });

  it("should return 400 when title is missing", async () => {
    const p = await seedProject();
    const req = createRequest("/api/tasks", {
      method: "POST",
      body: { projectId: p.id },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 when projectId is missing", async () => {
    const req = createRequest("/api/tasks", {
      method: "POST",
      body: { title: "No Project" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 400 when projectId does not exist", async () => {
    const req = createRequest("/api/tasks", {
      method: "POST",
      body: {
        title: "Bad Project",
        projectId: "00000000-0000-0000-0000-000000000000",
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should apply default values for optional fields", async () => {
    const p = await seedProject();
    const req = createRequest("/api/tasks", {
      method: "POST",
      body: { title: "Defaults", projectId: p.id },
    });
    const res = await POST(req);
    const body = await parseResponse<Task>(res);
    expect(body.status).toBe("open");
    expect(body.priority).toBe("medium");
    expect(body.assignee).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// GET /api/tasks
// ---------------------------------------------------------------------------

describe("GET /api/tasks", () => {
  it("should return paginated tasks", async () => {
    const p = await seedProject();
    for (let i = 0; i < 15; i++) {
      await seedTask(p.id, { title: `Task ${i}` });
    }

    const req = createRequest("/api/tasks", {
      searchParams: { page: "1", pageSize: "10" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await parseResponse<PaginatedResponse<Task>>(res);
    expect(body.data).toHaveLength(10);
    expect(body.pagination.total).toBe(15);
    expect(body.pagination.totalPages).toBe(2);
  });

  it("should filter by status", async () => {
    const p = await seedProject();
    await seedTask(p.id, { title: "Open", status: "open" });
    await seedTask(p.id, { title: "Done", status: "completed" });

    const req = createRequest("/api/tasks", {
      searchParams: { status: "open" },
    });
    const res = await GET(req);
    const body = await parseResponse<PaginatedResponse<Task>>(res);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("Open");
  });

  it("should filter by priority", async () => {
    const p = await seedProject();
    await seedTask(p.id, { title: "Low", priority: "low" });
    await seedTask(p.id, { title: "High", priority: "high" });

    const req = createRequest("/api/tasks", {
      searchParams: { priority: "high" },
    });
    const res = await GET(req);
    const body = await parseResponse<PaginatedResponse<Task>>(res);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("High");
  });

  it("should filter by assignee", async () => {
    const p = await seedProject();
    await seedTask(p.id, { title: "Alice Task", assignee: "Alice" });
    await seedTask(p.id, { title: "Bob Task", assignee: "Bob" });

    const req = createRequest("/api/tasks", {
      searchParams: { assignee: "Alice" },
    });
    const res = await GET(req);
    const body = await parseResponse<PaginatedResponse<Task>>(res);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].assignee).toBe("Alice");
  });

  it("should filter by projectId", async () => {
    const p1 = await seedProject("Project 1");
    const p2 = await seedProject("Project 2");
    await seedTask(p1.id, { title: "P1 Task" });
    await seedTask(p2.id, { title: "P2 Task" });

    const req = createRequest("/api/tasks", {
      searchParams: { projectId: p1.id },
    });
    const res = await GET(req);
    const body = await parseResponse<PaginatedResponse<Task>>(res);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("P1 Task");
  });
});

// ---------------------------------------------------------------------------
// GET /api/tasks/:id
// ---------------------------------------------------------------------------

describe("GET /api/tasks/:id", () => {
  it("should return a task with its project", async () => {
    const p = await seedProject("My Project");
    const t = await seedTask(p.id, { title: "Detail Task" });

    const req = createRequest(`/api/tasks/${t.id}`);
    const res = await GET_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);

    const body = await parseResponse<Task & { project: { name: string } }>(res);
    expect(body.title).toBe("Detail Task");
    expect(body.project.name).toBe("My Project");
  });

  it("should return 404 for unknown id", async () => {
    const req = createRequest(
      "/api/tasks/00000000-0000-0000-0000-000000000000",
    );
    const res = await GET_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/tasks/:id — status transitions
// ---------------------------------------------------------------------------

describe("PATCH /api/tasks/:id — status transitions", () => {
  it("should allow open → in_progress", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "open" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "in_progress" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);

    const body = await parseResponse<Task>(res);
    expect(body.status).toBe("in_progress");
  });

  it("should allow in_progress → in_review", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "in_progress" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "in_review" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);
    expect((await parseResponse<Task>(res)).status).toBe("in_review");
  });

  it("should allow in_review → completed", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "in_review" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "completed" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);
    expect((await parseResponse<Task>(res)).status).toBe("completed");
  });

  it("should allow completed → in_progress", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "completed" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "in_progress" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);
    expect((await parseResponse<Task>(res)).status).toBe("in_progress");
  });

  it("should allow same-status PATCH as a no-op (idempotent)", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "open" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "open" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);
    expect((await parseResponse<Task>(res)).status).toBe("open");
  });

  it("should reject open → completed (invalid transition)", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "open" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "completed" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(400);
  });

  it("should reject open → in_review (invalid transition)", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { status: "open" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { status: "in_review" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/tasks/:id — non-status updates
// ---------------------------------------------------------------------------

describe("PATCH /api/tasks/:id — non-status fields", () => {
  it("should update non-status fields", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id, { title: "Old Title" });

    const req = createRequest(`/api/tasks/${t.id}`, {
      method: "PATCH",
      body: { title: "New Title", priority: "critical", assignee: "Eve" },
    });
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);

    const body = await parseResponse<Task>(res);
    expect(body.title).toBe("New Title");
    expect(body.priority).toBe("critical");
    expect(body.assignee).toBe("Eve");
  });

  it("should return 404 for unknown task", async () => {
    const req = createRequest(
      "/api/tasks/00000000-0000-0000-0000-000000000000",
      {
        method: "PATCH",
        body: { title: "Nope" },
      },
    );
    const res = await PATCH_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/tasks/:id", () => {
  it("should delete a task", async () => {
    const p = await seedProject();
    const t = await seedTask(p.id);

    const req = createRequest(`/api/tasks/${t.id}`, { method: "DELETE" });
    const res = await DELETE_BY_ID(req, {
      params: Promise.resolve({ id: t.id }),
    });
    expect(res.status).toBe(200);
  });

  it("should return 404 for unknown task", async () => {
    const req = createRequest(
      "/api/tasks/00000000-0000-0000-0000-000000000000",
      { method: "DELETE" },
    );
    const res = await DELETE_BY_ID(req, {
      params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }),
    });
    expect(res.status).toBe(404);
  });
});
