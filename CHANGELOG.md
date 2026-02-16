# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-16

### Added

- Initial release: Kimi CLI Worker Skill for OpenClaw
- `kimi-worker verify` – check Kimi CLI install and auth
- `kimi-worker execute "<prompt>"` – run task in worktree (or cwd), with `--constraint`, `--success`, `--files`, `--timeout`, `--output-format text|json`
- `kimi-worker status <taskId>` – show parsed report status
- `kimi-worker worktree list | remove <taskId>`
- `kimi-worker cleanup [--older-than N]` – remove stale worktrees
- AGENTS.md template and task manifest (`.openclaw/task.manifest.json`)
- Report parser for `.openclaw/kimi-reports/{taskId}.json`
- Config: `~/.openclaw/openclaw.json` with `worktree.basePath`
- Logging to `~/.openclaw/logs/kimi-worker.log` with 10MB rotation
- `skills/kimi-worker/SKILL.md` for OpenClaw agent discovery
