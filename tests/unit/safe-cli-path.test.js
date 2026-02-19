import assert from "node:assert";
import { describe, it, before, after } from "node:test";

describe("getSafeKimiCliPath", () => {
  let orig;

  before(() => {
    orig = process.env.KIMI_CLI_PATH;
  });

  after(() => {
    if (orig !== undefined) process.env.KIMI_CLI_PATH = orig;
    else delete process.env.KIMI_CLI_PATH;
  });

  it("returns kimi when KIMI_CLI_PATH is unset", async () => {
    delete process.env.KIMI_CLI_PATH;
    const { getSafeKimiCliPath } = await import("../../bin/safe-cli-path.js");
    assert.strictEqual(getSafeKimiCliPath(), "kimi");
  });

  it("returns safe path when KIMI_CLI_PATH is a valid path", async () => {
    process.env.KIMI_CLI_PATH = "/usr/bin/kimi";
    const { getSafeKimiCliPath } = await import("../../bin/safe-cli-path.js");
    assert.strictEqual(getSafeKimiCliPath(), "/usr/bin/kimi");
  });

  it("returns kimi when KIMI_CLI_PATH contains shell metacharacters", async () => {
    process.env.KIMI_CLI_PATH = "kimi; rm -rf /";
    const { getSafeKimiCliPath } = await import("../../bin/safe-cli-path.js");
    assert.strictEqual(getSafeKimiCliPath(), "kimi");
  });

  it("returns kimi when KIMI_CLI_PATH contains spaces", async () => {
    process.env.KIMI_CLI_PATH = "/path/with spaces/kimi";
    const { getSafeKimiCliPath } = await import("../../bin/safe-cli-path.js");
    assert.strictEqual(getSafeKimiCliPath(), "kimi");
  });
});
