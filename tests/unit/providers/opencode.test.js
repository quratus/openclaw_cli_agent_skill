import assert from "node:assert";
import { describe, it } from "node:test";

describe("OpenCodeProvider", () => {
  it("has correct id and displayName", async () => {
    const { opencodeProvider } = await import(
      "../../../bin/providers/opencode.js"
    );
    assert.strictEqual(opencodeProvider.id, "opencode");
    assert.strictEqual(opencodeProvider.displayName, "OpenCode");
  });

  it("returns correct report subdir", async () => {
    const { opencodeProvider } = await import(
      "../../../bin/providers/opencode.js"
    );
    assert.strictEqual(opencodeProvider.reportSubdir(), "opencode-reports");
  });

  it("returns correct AGENTS.md title", async () => {
    const { opencodeProvider } = await import(
      "../../../bin/providers/opencode.js"
    );
    assert.strictEqual(
      opencodeProvider.agentsMdTitle(),
      "OpenClaw OpenCode Worker - Task Instructions"
    );
  });
});

describe("parseOpenCodeOutput", () => {
  it("extracts content field from JSON", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ['{"content":"Hello from OpenCode"}'];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Hello from OpenCode");
    assert.strictEqual(result.raw.length, 1);
  });

  it("extracts delta.text field from JSON", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = [
      '{"delta":{"text":"Part 1"}}',
      '{"delta":{"text":"Part 2"}}',
    ];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Part 1Part 2");
  });

  it("extracts result field from JSON", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ['{"result":"Final result"}'];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Final result");
  });

  it("extracts text field from JSON", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ['{"text":"Simple text"}'];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Simple text");
  });

  it("extracts message.content field from JSON", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ['{"message":{"content":"Message content"}}'];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Message content");
  });

  it("treats non-JSON as plain text", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ["Line 1", "Line 2"];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "Line 1Line 2");
  });

  it("handles empty input", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const result = parseOpenCodeOutput([]);
    assert.strictEqual(result.finalText, "");
    assert.strictEqual(result.raw.length, 0);
  });

  it("skips empty lines", async () => {
    const { parseOpenCodeOutput } = await import(
      "../../../bin/providers/opencode.js"
    );
    const lines = ["", "  ", '{"content":"data"}', ""];
    const result = parseOpenCodeOutput(lines);
    assert.strictEqual(result.finalText, "data");
  });
});
