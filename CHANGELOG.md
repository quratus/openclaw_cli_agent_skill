# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-16

### Added

- Initial release: Kimi CLI Worker Skill for OpenClaw
- `cli-worker verify` – check Kimi CLI install and auth
- `cli-worker execute "<prompt>"` – run task in worktree (or cwd), with `--constraint`, `--success`, `--files`, `--timeout`, `--output-format text|json`
- `cli-worker status <taskId>` – show parsed report status
- `cli-worker worktree list | remove <taskId>`
- `cli-worker cleanup [--older-than N]` – remove stale worktrees
- AGENTS.md template and task manifest (`.openclaw/task.manifest.json`)
- Report parser for `.openclaw/kimi-reports/{taskId}.json`
- Config: `~/.openclaw/openclaw.json` with `worktree.basePath`
- Logging to `~/.openclaw/logs/cli-worker.log` with 10MB rotation
- `skills/cli-worker/SKILL.md` for OpenClaw agent discovery
