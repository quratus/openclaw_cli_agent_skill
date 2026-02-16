# openclaw-cli-agent-skill

OpenClaw skill that delegates coding tasks to **Kimi CLI** agents in isolated git worktrees.

## Prerequisites

- **Node.js** >= 18
- **Kimi CLI** installed and authenticated (run `kimi` then `/login` in the REPL)

## Install

```bash
# From npm (when published)
npm install -g openclaw-cli-agent-skill

# From git (prepare script runs build on install)
npm install -g github:quratus/openclaw_cli_agent_skill

# Or clone and link
git clone https://github.com/quratus/openclaw_cli_agent_skill.git
cd openclaw_cli_agent_skill
npm install && npm run build
npm link
```

### Register skill so the OpenClaw agent can use it

OpenClaw only loads skills from `~/.openclaw/skills/`, the workspace `skills/` folder, or `skills.load.extraDirs` in config. After installing the CLI, register the skill so your bot (e.g. Hermes) can see "kimi-worker":

```bash
cd openclaw_cli_agent_skill   # or wherever you cloned it
npm run install-skill
```

This symlinks `skills/kimi-worker` to `~/.openclaw/skills/kimi-worker`. Restart the OpenClaw gateway or start a new chat so the agent gets the updated skills list.

## Quick start

```bash
# Verify Kimi CLI is set up
kimi-worker verify

# Run a simple task
kimi-worker execute "Reply OK"
```

## Commands

| Command | Description |
|--------|-------------|
| `kimi-worker verify` | Check Kimi CLI install and auth |
| `kimi-worker execute "<prompt>"` | Run a task in an isolated worktree |
| `kimi-worker status <taskId>` | Show task status from report |
| `kimi-worker worktree list` | List active worktrees |
| `kimi-worker worktree remove <taskId>` | Remove a worktree |
| `kimi-worker cleanup [--older-than N]` | Remove worktrees older than N hours (default 24) |

## Config

Optional config file: `~/.openclaw/openclaw.json`

```json
{
  "worktree": { "basePath": "~/.openclaw/worktrees/kimi" }
}
```

Override with env: `OPENCLAW_CONFIG=/path/to/config.json`

### OpenClaw skill registration

**Recommended:** run `npm run install-skill` from this repo to symlink the skill into `~/.openclaw/skills/kimi-worker`. OpenClaw loads skills from that directory automatically; no config change needed.

**Alternative (extra dir):** add this repo's skills folder to config so OpenClaw loads it without a symlink:

```json
// ~/.openclaw/openclaw.json — merge into existing "skills"
"skills": {
  "load": { "extraDirs": ["/path/to/openclaw_cli_agent_skill/skills"] }
}
```

## OpenClaw integration

To run cleanup from OpenClaw's cron (e.g. remove worktrees older than 24h when skill is enabled), add to your cleanup script:

```bash
# When kimi-worker skill is enabled
if command -v kimi-worker >/dev/null 2>&1; then
  kimi-worker cleanup --older-than 24
fi
```

## Known limitations

- **Kimi CLI only (v1).** This release is built and tested for the **Kimi CLI** (kimi-code). It may not work with other coding CLIs out of the box. If you want to use this concept with other workers (e.g. Claude Code, OpenCode, Aider), contributions are welcome: the design can be extended with provider adapters so one skill supports multiple CLIs. See the repo for the current structure (auth, spawn, parser) and open an issue or PR to propose another provider.
- Kimi must be installed and authenticated by the user (`kimi`, then `/login` in the REPL); the skill cannot perform login for you.
- Timeout is a hard kill at `--timeout` minutes; there is no soft “wrap up” warning (Kimi print mode may not support stdin for that).
- Session resumption (resume an interrupted task in the same Kimi session) is planned for a later version.

## License

MIT
