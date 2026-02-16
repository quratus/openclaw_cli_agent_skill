import assert from "node:assert";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { parseStreamJson } = await import("../../bin/parser/stream-json.js");

describe("parseStreamJson", () => {
  it("extracts last assistant text from multi-part content", () => {
    const lines = [
      '{"role":"user","content":"Hi"}',
      '{"role":"assistant","content":[{"type":"text","text":"Hello"},{"type":"text","text":" world"}]}',
    ];
    const result = parseStreamJson(lines);
    assert.strictEqual(result.finalText, " world");
    assert.strictEqual(result.raw.length, 2);
  });

  it("returns single text content as finalText", () => {
    const lines = [
      '{"role":"assistant","content":[{"type":"text","text":"OK"}]}',
    ];
    const result = parseStreamJson(lines);
    assert.strictEqual(result.finalText, "OK");
  });

  it("ignores non-JSON lines", () => {
    const lines = [
      "not json",
      '{"role":"assistant","content":"plain string"}',
    ];
    const result = parseStreamJson(lines);
    assert.strictEqual(result.finalText, "plain string");
    assert.strictEqual(result.raw.length, 1);
  });

  it("uses fixture file", () => {
    const fixturePath = path.join(__dirname, "../fixtures/stream-json-sample.jsonl");
    const content = fs.readFileSync(fixturePath, "utf-8");
    const lines = content.trim().split("\n");
    const result = parseStreamJson(lines);
    // Last assistant content has two parts; last part is " world"
    assert.ok(result.finalText.includes("world") || result.finalText === " world");
    assert.ok(result.raw.length >= 2);
  });
});
