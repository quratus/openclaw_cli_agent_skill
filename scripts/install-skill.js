#!/usr/bin/env node
/**
 * Register the cli-worker skill so OpenClaw agents can see it.
 * Symlinks this repo's skills/cli-worker into ~/.openclaw/skills/cli-worker
 * (or OPENCLAW_SKILLS_DIR if set).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const skillSource = path.join(repoRoot, "skills", "cli-worker");
const skillsDir =
  process.env.OPENCLAW_SKILLS_DIR ||
  path.join(process.env.HOME || process.env.USERPROFILE || "", ".openclaw", "skills");
const skillTarget = path.join(skillsDir, "cli-worker");

if (!fs.existsSync(skillSource)) {
  console.error("Skill not found at:", skillSource);
  process.exit(1);
}

fs.mkdirSync(skillsDir, { recursive: true });

try {
  if (fs.existsSync(skillTarget)) {
    fs.unlinkSync(skillTarget);
  }
  fs.symlinkSync(skillSource, skillTarget, "dir");
  console.log("Skill registered: cli-worker ->", skillTarget);
  console.log("OpenClaw will load it from ~/.openclaw/skills. Restart the gateway or start a new session to see it.");
} catch (err) {
  console.error("Failed to register skill:", err.message);
  process.exit(1);
}
