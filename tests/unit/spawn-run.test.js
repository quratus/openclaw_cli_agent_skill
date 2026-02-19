import assert from "node:assert";
import { describe, it } from "node:test";

describe("sanitizePrompt", () => {
  it("strips null bytes", async () => {
    const { sanitizePrompt } = await import("../../bin/sanitize.js");
    assert.strictEqual(sanitizePrompt("hello\0world"), "helloworld");
    assert.strictEqual(sanitizePrompt("a\0\0b"), "ab");
  });

  it("replaces C0 control chars (except tab, newline, CR) with space", async () => {
    const { sanitizePrompt } = await import("../../bin/sanitize.js");
    assert.strictEqual(sanitizePrompt("a\x01b"), "a b");
    assert.strictEqual(sanitizePrompt("tab\there"), "tab\there");
    assert.strictEqual(sanitizePrompt("new\nline"), "new\nline");
    assert.strictEqual(sanitizePrompt("cr\rhere"), "cr\rhere");
  });

  it("leaves normal text unchanged", async () => {
    const { sanitizePrompt } = await import("../../bin/sanitize.js");
    const text = "Add a function that prints $HOME and `date`";
    assert.strictEqual(sanitizePrompt(text), text);
  });
});

// Backward compatibility: ensure sanitizePrompt is also exported from spawn/run
describe("sanitizePrompt re-export from spawn/run", () => {
  it("can be imported from spawn/run module", async () => {
    const { sanitizePrompt } = await import("../../bin/spawn/run.js");
    assert.strictEqual(typeof sanitizePrompt, "function");
    assert.strictEqual(sanitizePrompt("test"), "test");
  });
});
