import assert from "node:assert";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { getConfig } from "../../bin/config.js";

describe("getConfig", () => {
  it("returns empty object when config path does not exist", () => {
    const orig = process.env.OPENCLAW_CONFIG;
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-config-"));
    process.env.OPENCLAW_CONFIG = path.join(tmpDir, "nonexistent.json");
    try {
      const config = getConfig();
      assert.strictEqual(typeof config, "object");
      assert.strictEqual(Object.keys(config).length, 0);
    } finally {
      if (orig !== undefined) process.env.OPENCLAW_CONFIG = orig;
      else delete process.env.OPENCLAW_CONFIG;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("returns parsed config when file exists with valid JSON", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-config-"));
    const configPath = path.join(tmpDir, "openclaw.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({ worktree: { basePath: "/custom/path" } })
    );
    const orig = process.env.OPENCLAW_CONFIG;
    process.env.OPENCLAW_CONFIG = configPath;
    try {
      const config = getConfig();
      assert.strictEqual(config.worktree?.basePath, "/custom/path");
    } finally {
      if (orig !== undefined) process.env.OPENCLAW_CONFIG = orig;
      else delete process.env.OPENCLAW_CONFIG;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
