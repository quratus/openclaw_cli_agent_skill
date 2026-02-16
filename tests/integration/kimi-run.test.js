import assert from "node:assert";
import { describe, it } from "node:test";
import { execSync } from "node:child_process";

function isKimiInstalled() {
  try {
    execSync("kimi --version", { encoding: "utf-8", stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

describe("Kimi run integration", () => {
  it("runKimi returns stdout lines containing JSON when Kimi is installed", { skip: !isKimiInstalled() }, async () => {
    const { runKimi } = await import("../../bin/spawn/run.js");
    const cwd = process.cwd();
    const result = await runKimi("Reply with exactly: OK", cwd, { timeoutMs: 60_000 });
    assert.strictEqual(result.exitCode, 0, result.stderr || "expected exit 0");
    const hasJson = result.stdoutLines.some((line) => {
      try {
        JSON.parse(line.trim());
        return true;
      } catch {
        return false;
      }
    });
    assert.ok(hasJson, "stdout should contain at least one JSON line");
  });
});
