import { execSync } from "node:child_process";

/**
 * Remove a worktree. Run from inside the worktree: git worktree remove --force .
 */
export async function removeWorktree(worktreePath: string): Promise<void> {
  execSync("git worktree remove --force .", {
    cwd: worktreePath,
    encoding: "utf-8",
  });
}
