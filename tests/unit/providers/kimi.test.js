import assert from "node:assert";
import { describe, it } from "node:test";

describe("KimiProvider", () => {
  it("has correct id and displayName", async () => {
    const { kimiProvider } = await import("../../../bin/providers/kimi.js");
    assert.strictEqual(kimiProvider.id, "kimi");
    assert.strictEqual(kimiProvider.displayName, "Kimi CLI");
  });

  it("returns correct report subdir", async () => {
    const { kimiProvider } = await import("../../../bin/providers/kimi.js");
    assert.strictEqual(kimiProvider.reportSubdir(), "kimi-reports");
  });

  it("returns correct AGENTS.md title", async () => {
    const { kimiProvider } = await import("../../../bin/providers/kimi.js");
    assert.strictEqual(
      kimiProvider.agentsMdTitle(),
      "OpenClaw Kimi Worker - Task Instructions"
    );
  });

  it("parseStdout delegates to parseStreamJson", async () => {
    const { kimiProvider } = await import("../../../bin/providers/kimi.js");
    const lines = [
      '{"role":"assistant","content":[{"type":"text","text":"Hello"}]}',
    ];
    const result = kimiProvider.parseStdout(lines);
    assert.strictEqual(result.finalText, "Hello");
    assert.strictEqual(result.raw.length, 1);
  });
});
