import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it, before, after } from "node:test";

describe("getRepoPath", () => {
  it("returns cwd when no --repo flag", async () => {
    const { getRepoPath } = await import("../../bin/worktree/repo.js");
    const cwd = process.cwd();
    assert.strictEqual(getRepoPath(cwd), cwd);
    assert.strictEqual(getRepoPath(cwd, undefined), cwd);
  });

  it("returns resolved path when --repo flag set", async () => {
    const { getRepoPath } = await import("../../bin/worktree/repo.js");
    const cwd = process.cwd();
    assert.ok(getRepoPath(cwd, "/tmp/repo").endsWith("repo"));
  });
});

describe("getWorktreeBasePath", () => {
  let tmpDir;
  let origConfig;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-cfg-"));
    origConfig = process.env.OPENCLAW_CONFIG;
    const configPath = path.join(tmpDir, "openclaw.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({ worktree: { basePath: "/custom/worktrees" } }),
      "utf-8"
    );
    process.env.OPENCLAW_CONFIG = configPath;
  });

  after(() => {
    process.env.OPENCLAW_CONFIG = origConfig;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns config overridden base path", async () => {
    const { getWorktreeBasePath } = await import("../../bin/worktree/repo.js");
    const base = getWorktreeBasePath();
    assert.strictEqual(base, "/custom/worktrees");
  });
});
