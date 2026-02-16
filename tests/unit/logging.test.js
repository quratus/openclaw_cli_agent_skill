import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it, before, after } from "node:test";

describe("logging", () => {
  let logDir;
  let origLogDir;

  before(() => {
    logDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-log-"));
    origLogDir = process.env.OPENCLAW_LOG_DIR;
    process.env.OPENCLAW_LOG_DIR = logDir;
  });

  after(() => {
    process.env.OPENCLAW_LOG_DIR = origLogDir;
    if (logDir && fs.existsSync(logDir)) fs.rmSync(logDir, { recursive: true, force: true });
  });

  it("writes log line with timestamp and level", async () => {
    const { log } = await import("../../bin/logging.js");
    log("INFO", "test message");
    const logPath = path.join(logDir, "kimi-worker.log");
    assert.ok(fs.existsSync(logPath));
    const content = fs.readFileSync(logPath, "utf-8");
    assert.ok(content.includes("[INFO]"));
    assert.ok(content.includes("test message"));
  });

  it("rotates log when file exceeds 10MB", async () => {
    const logPath = path.join(logDir, "kimi-worker.log");
    fs.writeFileSync(logPath, "x".repeat(11 * 1024 * 1024), "utf-8"); // 11MB
    const { log } = await import("../../bin/logging.js");
    log("INFO", "after rotate");
    assert.ok(fs.existsSync(logPath));
    const content = fs.readFileSync(logPath, "utf-8");
    assert.ok(content.includes("after rotate"));
    const files = fs.readdirSync(logDir);
    const bak = files.find((f) => f.endsWith(".bak"));
    assert.ok(bak, "expected a .bak rotated file");
  });
});
