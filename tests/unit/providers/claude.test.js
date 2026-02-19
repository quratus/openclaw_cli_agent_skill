import assert from "node:assert";
import { describe, it } from "node:test";

describe("ClaudeProvider", () => {
  it("has correct id and displayName", async () => {
    const { claudeProvider } = await import("../../../bin/providers/claude.js");
    assert.strictEqual(claudeProvider.id, "claude");
    assert.strictEqual(claudeProvider.displayName, "Claude Code");
  });

  it("returns correct report subdir", async () => {
    const { claudeProvider } = await import("../../../bin/providers/claude.js");
    assert.strictEqual(claudeProvider.reportSubdir(), "claude-reports");
  });

  it("returns correct AGENTS.md title", async () => {
    const { claudeProvider } = await import("../../../bin/providers/claude.js");
    assert.strictEqual(
      claudeProvider.agentsMdTitle(),
      "OpenClaw Claude Worker - Task Instructions"
    );
  });
});

describe("parseClaudeStreamJson", () => {
  it("accumulates text_delta events", async () => {
    const { parseClaudeStreamJson } = await import(
      "../../../bin/providers/claude.js"
    );
    const lines = [
      '{"type":"stream_event","event":{"delta":{"type":"text_delta","text":"Hello"}}}',
      '{"type":"stream_event","event":{"delta":{"type":"text_delta","text":" world"}}}',
    ];
    const result = parseClaudeStreamJson(lines);
    assert.strictEqual(result.finalText, "Hello world");
    assert.strictEqual(result.raw.length, 2);
  });

  it("ignores non-stream_event lines", async () => {
    const { parseClaudeStreamJson } = await import(
      "../../../bin/providers/claude.js"
    );
    const lines = [
      '{"type":"init"}',
      '{"type":"stream_event","event":{"delta":{"type":"text_delta","text":"OK"}}}',
      '{"type":"done"}',
    ];
    const result = parseClaudeStreamJson(lines);
    assert.strictEqual(result.finalText, "OK");
    assert.strictEqual(result.raw.length, 3);
  });

  it("handles empty input", async () => {
    const { parseClaudeStreamJson } = await import(
      "../../../bin/providers/claude.js"
    );
    const result = parseClaudeStreamJson([]);
    assert.strictEqual(result.finalText, "");
    assert.strictEqual(result.raw.length, 0);
  });

  it("skips non-JSON lines", async () => {
    const { parseClaudeStreamJson } = await import(
      "../../../bin/providers/claude.js"
    );
    const lines = [
      "not json",
      '{"type":"stream_event","event":{"delta":{"type":"text_delta","text":"data"}}}',
    ];
    const result = parseClaudeStreamJson(lines);
    assert.strictEqual(result.finalText, "data");
    assert.strictEqual(result.raw.length, 1);
  });
});
