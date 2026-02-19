import assert from "node:assert";
import { describe, it } from "node:test";

describe("createWorktree", () => {
  it("rejects invalid taskId (path traversal, no shell injection)", async () => {
    const { createWorktree } = await import("../../bin/worktree/create.js");
    await assert.rejects(
      () => createWorktree("/tmp/repo", "../../etc", "HEAD"),
      /Invalid taskId/
    );
  });

  it("rejects taskId with path separators", async () => {
    const { createWorktree } = await import("../../bin/worktree/create.js");
    await assert.rejects(
      () => createWorktree("/tmp/repo", "openclaw/../evil", "HEAD"),
      /Invalid taskId/
    );
  });

  it("rejects empty taskId", async () => {
    const { createWorktree } = await import("../../bin/worktree/create.js");
    await assert.rejects(
      () => createWorktree("/tmp/repo", "", "HEAD"),
      /Invalid taskId/
    );
  });
});
