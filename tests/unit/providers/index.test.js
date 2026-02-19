import assert from "node:assert";
import { describe, it, before, after } from "node:test";

describe("getProvider", () => {
  it("returns kimi provider for 'kimi'", async () => {
    const { getProvider } = await import("../../../bin/providers/index.js");
    const provider = getProvider("kimi");
    assert.strictEqual(provider.id, "kimi");
  });

  it("returns claude provider for 'claude'", async () => {
    const { getProvider } = await import("../../../bin/providers/index.js");
    const provider = getProvider("claude");
    assert.strictEqual(provider.id, "claude");
  });

  it("returns opencode provider for 'opencode'", async () => {
    const { getProvider } = await import("../../../bin/providers/index.js");
    const provider = getProvider("opencode");
    assert.strictEqual(provider.id, "opencode");
  });

  it("throws for unknown provider", async () => {
    const { getProvider } = await import("../../../bin/providers/index.js");
    assert.throws(() => getProvider("unknown"), /Unknown provider/);
  });
});

describe("isValidProviderId", () => {
  it("returns true for valid providers", async () => {
    const { isValidProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    assert.strictEqual(isValidProviderId("kimi"), true);
    assert.strictEqual(isValidProviderId("claude"), true);
    assert.strictEqual(isValidProviderId("opencode"), true);
  });

  it("returns false for invalid providers", async () => {
    const { isValidProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    assert.strictEqual(isValidProviderId("unknown"), false);
    assert.strictEqual(isValidProviderId(""), false);
    assert.strictEqual(isValidProviderId("gpt"), false);
  });
});

describe("resolveProviderId", () => {
  let origEnv;

  before(() => {
    origEnv = process.env.OPENCLAW_CLI_PROVIDER;
  });

  after(() => {
    if (origEnv === undefined) {
      delete process.env.OPENCLAW_CLI_PROVIDER;
    } else {
      process.env.OPENCLAW_CLI_PROVIDER = origEnv;
    }
  });

  it("returns cliFlag when provided and valid", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    const result = resolveProviderId({}, "claude");
    assert.strictEqual(result, "claude");
  });

  it("returns env var when cliFlag not provided", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    process.env.OPENCLAW_CLI_PROVIDER = "opencode";
    const result = resolveProviderId({});
    assert.strictEqual(result, "opencode");
    delete process.env.OPENCLAW_CLI_PROVIDER;
  });

  it("cliFlag takes precedence over env var", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    process.env.OPENCLAW_CLI_PROVIDER = "opencode";
    const result = resolveProviderId({}, "claude");
    assert.strictEqual(result, "claude");
    delete process.env.OPENCLAW_CLI_PROVIDER;
  });

  it("returns config cliWorker.provider when no flag or env", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    delete process.env.OPENCLAW_CLI_PROVIDER;
    const result = resolveProviderId({ cliWorker: { provider: "claude" } });
    assert.strictEqual(result, "claude");
  });

  it("returns config skills['cli-worker'].provider when no flag or env", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    delete process.env.OPENCLAW_CLI_PROVIDER;
    const result = resolveProviderId({
      skills: { "cli-worker": { provider: "opencode" } },
    });
    assert.strictEqual(result, "opencode");
  });

  it("cliFlag takes precedence over config", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    delete process.env.OPENCLAW_CLI_PROVIDER;
    const result = resolveProviderId({ cliWorker: { provider: "opencode" } }, "claude");
    assert.strictEqual(result, "claude");
  });

  it("returns default 'kimi' when nothing set", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    delete process.env.OPENCLAW_CLI_PROVIDER;
    const result = resolveProviderId({});
    assert.strictEqual(result, "kimi");
  });

  it("ignores invalid cliFlag and falls through", async () => {
    const { resolveProviderId } = await import(
      "../../../bin/providers/index.js"
    );
    delete process.env.OPENCLAW_CLI_PROVIDER;
    const result = resolveProviderId({}, "invalid");
    assert.strictEqual(result, "kimi");
  });
});

describe("getProviderFromConfig", () => {
  it("returns correct provider instance", async () => {
    const { getProviderFromConfig } = await import(
      "../../../bin/providers/index.js"
    );
    const provider = getProviderFromConfig({ cliWorker: { provider: "claude" } });
    assert.strictEqual(provider.id, "claude");
  });
});

describe("VALID_PROVIDER_IDS", () => {
  it("contains all valid provider IDs", async () => {
    const { VALID_PROVIDER_IDS } = await import(
      "../../../bin/providers/index.js"
    );
    assert.deepStrictEqual(VALID_PROVIDER_IDS.sort(), ["claude", "kimi", "opencode"]);
  });
});
