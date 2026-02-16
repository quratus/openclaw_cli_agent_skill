import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it, before, after } from "node:test";
import { writeManifest } from "../../bin/manifest/write.js";
import { generateAgentsMd } from "../../bin/templates/agents-md.js";

describe("AGENTS.md and manifest in worktree (S2-T4)", () => {
  let worktreePath;

  before(() => {
    worktreePath = fs.mkdtempSync(path.join(os.tmpdir(), "worktree-"));
  });

  after(() => {
    fs.rmSync(worktreePath, { recursive: true, force: true });
  });

  it("writes AGENTS.md and manifest to worktree root before spawn", async () => {
    const taskId = "int-test-1";
    const task = {
      prompt: "Create hello.py",
      worktreePath,
      taskId,
      reportPath: path.join(worktreePath, ".openclaw", "kimi-reports", `${taskId}.json`),
    };
    writeManifest(taskId, task, worktreePath, task.reportPath);
    const agentsMd = generateAgentsMd(task);
    fs.writeFileSync(path.join(worktreePath, "AGENTS.md"), agentsMd, "utf-8");

    assert.ok(fs.existsSync(path.join(worktreePath, "AGENTS.md")));
    assert.ok(fs.existsSync(path.join(worktreePath, ".openclaw", "task.manifest.json")));
    const manifest = JSON.parse(
      fs.readFileSync(path.join(worktreePath, ".openclaw", "task.manifest.json"), "utf-8")
    );
    assert.strictEqual(manifest.execution_context.worktree_path, worktreePath);
  });
});
