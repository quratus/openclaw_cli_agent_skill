---
name: kimi-worker
description: Delegates coding tasks to Kimi CLI agents in isolated git worktrees. Use when the user wants to delegate work to Kimi, run a headless task, or run an isolated coding task in parallel. Requires Kimi CLI installed and authenticated (kimi /login).
---

# Kimi CLI Worker Skill

## When to use

- User asks to **delegate** a coding task to Kimi or a CLI worker
- Isolated coding task that should run in its own worktree (no git conflicts)
- Parallel work: run multiple tasks without blocking the main agent
- Headless task: run Kimi CLI non-interactively from OpenClaw

## Prerequisites

- **Kimi CLI** installed (`uv tool install kimi-cli` or install script from code.kimi.com)
- **Authenticated**: run `kimi` then `/login` in the REPL (user must complete OAuth; cannot be automated)

Verify with: `kimi-worker verify`

## How to invoke

```bash
# Run a single task (creates worktree if in a git repo)
kimi-worker execute "Your task prompt"

# With context
kimi-worker execute "Create hello.py" --constraint "Python 3.11" --success "Tests pass"

# Check task status (after Kimi writes report)
kimi-worker status <taskId>

# List / remove worktrees
kimi-worker worktree list
kimi-worker worktree remove <taskId>

# Cleanup old worktrees
kimi-worker cleanup --older-than 24
```

## Install

- **CLI:** `npm install -g openclaw-cli-agent-skill` (when published), or clone repo, `npm install && npm run build`, then `npm link`.
- **So OpenClaw agents can see this skill:** from the repo run `npm run install-skill` to symlink into `~/.openclaw/skills/kimi-worker`. Restart gateway or new session after that.

## OpenClaw integration

- Symlink or copy `skills/kimi-worker/` to `~/.openclaw/skills/kimi-worker/` so agents can discover it
- Optional config: `~/.openclaw/openclaw.json` with `worktree.basePath` for worktree location
