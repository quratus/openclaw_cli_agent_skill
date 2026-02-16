import assert from "node:assert";
import { describe, it } from "node:test";
import { generateAgentsMd } from "../../bin/templates/agents-md.js";

describe("generateAgentsMd", () => {
  it("includes task prompt and worktree path", async () => {
    const task = {
      prompt: "Create hello.py",
      worktreePath: "/tmp/wt",
    };
    const out = generateAgentsMd(task);
    assert.ok(out.includes("Create hello.py"));
    assert.ok(out.includes("/tmp/wt"));
  });

  it("includes constraints and success criteria when provided", async () => {
    const task = {
      prompt: "Refactor X",
      worktreePath: "/tmp/wt",
      constraints: ["Use Python 3.11", "No globals"],
      successCriteria: ["Tests pass", "Lint clean"],
    };
    const out = generateAgentsMd(task);
    assert.ok(out.includes("Use Python 3.11"));
    assert.ok(out.includes("No globals"));
    assert.ok(out.includes("Tests pass"));
    assert.ok(out.includes("Lint clean"));
  });

  it("includes relevant files when provided", async () => {
    const task = {
      prompt: "Fix bug",
      worktreePath: "/tmp/wt",
      relevantFiles: ["src/main.ts", "src/util.ts"],
    };
    const out = generateAgentsMd(task);
    assert.ok(out.includes("src/main.ts"));
    assert.ok(out.includes("src/util.ts"));
  });

  it("includes report path when provided", async () => {
    const task = {
      prompt: "Task",
      worktreePath: "/tmp/wt",
      reportPath: ".openclaw/kimi-reports/abc.json",
    };
    const out = generateAgentsMd(task);
    assert.ok(out.includes(".openclaw/kimi-reports/abc.json"));
  });
});
