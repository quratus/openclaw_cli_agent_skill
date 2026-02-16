import assert from "node:assert";
import path from "node:path";
import os from "node:os";
import { describe, it } from "node:test";
import { parseWorktreeListOutput } from "../../bin/worktree/list.js";

describe("parseWorktreeListOutput", () => {
  const basePath = path.join(os.tmpdir(), "openclaw-wt");
  const repoPath = "/repo";

  it("returns worktrees under basePath", () => {
    const output = [
      "/repo (HEAD)",
      `${basePath}/task-1  abc123`,
      `${basePath}/task-2  def456`,
      "/other/path  xyz",
    ].join("\n");
    const result = parseWorktreeListOutput(output, basePath, repoPath);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].taskId, "task-1");
    assert.strictEqual(result[1].taskId, "task-2");
  });

  it("returns empty when no worktrees under basePath", () => {
    const output = "/repo (HEAD)\n/other/path  xyz\n";
    const result = parseWorktreeListOutput(output, basePath, repoPath);
    assert.strictEqual(result.length, 0);
  });
});
