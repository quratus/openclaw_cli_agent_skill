import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, it, before, after } from "node:test";

// Load compiled auth module
const loadVerify = async () => {
  const mod = await import("../../bin/auth/verify.js");
  return mod;
};

describe("verifyConfigExists", () => {
  let tmpDir;
  let origKimiHome;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kimi-verify-"));
    origKimiHome = process.env.KIMI_HOME;
    process.env.KIMI_HOME = tmpDir;
  });

  after(() => {
    process.env.KIMI_HOME = origKimiHome;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns ok: false when config.toml does not exist", async () => {
    const { verifyConfigExists } = await loadVerify();
    const result = verifyConfigExists();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.reason, "config_missing");
  });

  it("returns ok: true when config.toml exists", async () => {
    fs.writeFileSync(path.join(tmpDir, "config.toml"), "# test");
    const { verifyConfigExists } = await loadVerify();
    const result = verifyConfigExists();
    assert.strictEqual(result.ok, true);
  });
});

describe("verifyCredentials", () => {
  let tmpDir;
  let origKimiHome;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kimi-creds-"));
    origKimiHome = process.env.KIMI_HOME;
    process.env.KIMI_HOME = tmpDir;
  });

  after(() => {
    process.env.KIMI_HOME = origKimiHome;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns ok: false when credentials dir is missing", async () => {
    fs.writeFileSync(path.join(tmpDir, "config.toml"), "# test");
    const { verifyCredentials } = await loadVerify();
    const result = verifyCredentials();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.reason, "credentials_missing");
  });

  it("returns ok: true when credentials dir has a file", async () => {
    fs.writeFileSync(path.join(tmpDir, "config.toml"), "# test");
    const credsDir = path.join(tmpDir, "credentials");
    fs.mkdirSync(credsDir, { recursive: true });
    fs.writeFileSync(path.join(credsDir, "kimi-code.json"), "{}");
    const { verifyCredentials } = await loadVerify();
    const result = verifyCredentials();
    assert.strictEqual(result.ok, true);
  });
});
