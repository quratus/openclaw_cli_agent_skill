import assert from "node:assert";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { parseReport } from "../../bin/parser/report.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "../fixtures/report-sample.json");

describe("parseReport", () => {
  it("parses fixture report and extracts status, artifacts, blockers", () => {
    const report = parseReport(fixturePath);
    assert.strictEqual(report.task_id, "test-task-123");
    assert.strictEqual(report.execution?.status, "completed");
    assert.strictEqual(report.execution?.duration_seconds, 120);
    assert.deepStrictEqual(report.artifacts?.files_modified, ["src/foo.ts"]);
    assert.strictEqual(report.artifacts?.test_status, "passed");
    assert.strictEqual(report.cognitive_state?.blockers?.length, 0);
  });

  it("throws when file does not exist", () => {
    assert.throws(
      () => parseReport("/nonexistent/report.json"),
      /Report not found/
    );
  });
});
