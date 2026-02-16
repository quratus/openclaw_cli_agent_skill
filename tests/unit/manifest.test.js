import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it, before, after } from "node:test";
import { writeManifest } from "../../bin/manifest/write.js";
import { validateManifest } from "../../bin/manifest/schema.js";

describe("writeManifest", () => {
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-"));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes .openclaw/task.manifest.json with correct structure", () => {
    const taskId = "test-task-123";
    const task = {
      prompt: "Do something",
      worktreePath: tmpDir,
      constraints: ["Constraint A"],
      successCriteria: ["Success B"],
    };
    const manifestPath = writeManifest(taskId, task, tmpDir);
    assert.ok(fs.existsSync(manifestPath));
    const content = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    assert.strictEqual(content.task_id, taskId);
    assert.strictEqual(content.protocol_version, "1.0");
    assert.deepStrictEqual(content.context.constraints, ["Constraint A"]);
    assert.ok(content.execution_context.worktree_path === tmpDir);
    assert.ok(content.execution_context.report_path);
  });
});

describe("validateManifest", () => {
  it("accepts valid manifest", () => {
    const m = {
      protocol_version: "1.0",
      task_id: "x",
      context: {},
      execution_context: { worktree_path: "/tmp" },
    };
    assert.strictEqual(validateManifest(m), true);
  });

  it("rejects non-object", () => {
    assert.strictEqual(validateManifest(null), false);
    assert.strictEqual(validateManifest("x"), false);
  });

  it("rejects wrong protocol_version", () => {
    const m = {
      protocol_version: "2.0",
      task_id: "x",
      context: {},
      execution_context: { worktree_path: "/tmp" },
    };
    assert.strictEqual(validateManifest(m), false);
  });

  it("rejects missing execution_context.worktree_path", () => {
    const m = {
      protocol_version: "1.0",
      task_id: "x",
      context: {},
      execution_context: {},
    };
    assert.strictEqual(validateManifest(m), false);
  });
});
