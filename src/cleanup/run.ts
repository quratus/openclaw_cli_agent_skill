import fs from "node:fs";
import { listWorktrees } from "../worktree/list.js";
import { removeWorktree } from "../worktree/remove.js";

/**
 * List worktrees under basePath, remove those older than olderThanHours (by dir mtime).
 * Returns number of worktrees removed.
 */
export async function cleanupWorktrees(
  repoPath: string,
  basePath: string,
  olderThanHours: number
): Promise<number> {
  const worktrees = await listWorktrees(repoPath, basePath);
  const cutoff = Date.now() - olderThanHours * 60 * 60 * 1000;
  let removed = 0;

  for (const wt of worktrees) {
    try {
      const stat = fs.statSync(wt.path);
      if (stat.mtimeMs < cutoff) {
        await removeWorktree(wt.path);
        removed++;
      }
    } catch {
      // skip if stat fails or remove fails
    }
  }

  return removed;
}
