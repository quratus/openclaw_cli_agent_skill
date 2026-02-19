import assert from "node:assert";
import { describe, it } from "node:test";

describe("isSafeTaskId", () => {
  it("accepts UUID-style and alphanumeric-hyphen ids", async () => {
    const { isSafeTaskId } = await import("../../bin/safe-task-id.js");
    assert.strictEqual(isSafeTaskId("550e8400-e29b-41d4-a716-446655440000"), true);
    assert.strictEqual(isSafeTaskId("abc-123"), true);
    assert.strictEqual(isSafeTaskId("a"), true);
  });

  it("rejects path traversal and path separators", async () => {
    const { isSafeTaskId } = await import("../../bin/safe-task-id.js");
    assert.strictEqual(isSafeTaskId("../../../../etc/passwd"), false);
    assert.strictEqual(isSafeTaskId(".."), false);
    assert.strictEqual(isSafeTaskId("task/id"), false);
    assert.strictEqual(isSafeTaskId("task\\id"), false);
    assert.strictEqual(isSafeTaskId("."), false);
  });

  it("rejects empty and invalid", async () => {
    const { isSafeTaskId } = await import("../../bin/safe-task-id.js");
    assert.strictEqual(isSafeTaskId(""), false);
    assert.strictEqual(isSafeTaskId("-leading"), false);
  });
});

describe("resolveTaskIdPath", () => {
  it("resolves under base and returns path", async () => {
    const { resolveTaskIdPath } = await import("../../bin/safe-task-id.js");
    const base = "/tmp/worktrees";
    assert.strictEqual(
      resolveTaskIdPath(base, "550e8400-e29b-41d4-a716-446655440000"),
      "/tmp/worktrees/550e8400-e29b-41d4-a716-446655440000"
    );
  });

  it("returns null for invalid taskId", async () => {
    const { resolveTaskIdPath } = await import("../../bin/safe-task-id.js");
    assert.strictEqual(resolveTaskIdPath("/tmp/base", "../../etc"), null);
    assert.strictEqual(resolveTaskIdPath("/tmp/base", "a/b"), null);
  });
});
