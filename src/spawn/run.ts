import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

export interface RunResult {
  exitCode: number | null;
  signal: string | null;
  stdoutLines: string[];
  stderr: string;
}

export interface RunOptions {
  timeoutMs?: number;
}

/**
 * Run Kimi CLI with prompt, capture stdout line-by-line.
 * Uses: kimi --print -p "<prompt>" --output-format=stream-json
 */
export function runKimi(
  prompt: string,
  cwd: string,
  options: RunOptions = {}
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const kimiCmd = process.env.KIMI_CLI_PATH ?? "kimi";
    const args = ["--print", "-p", prompt, "--output-format=stream-json"];
    const child = spawn(kimiCmd, args, {
      cwd,
      env: { ...process.env, KIMI_NO_BROWSER: "1" },
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdoutLines: string[] = [];
    const rl = createInterface({ input: child.stdout, crlfDelay: Infinity });
    rl.on("line", (line) => stdoutLines.push(line));

    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (options.timeoutMs && options.timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        child.kill("SIGTERM");
        timeoutId = setTimeout(() => child.kill("SIGKILL"), 2000);
      }, options.timeoutMs);
    }

    child.on("error", (err) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(err);
    });

    child.on("close", (code, signal) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve({
        exitCode: code,
        signal: signal,
        stdoutLines,
        stderr,
      });
    });
  });
}
