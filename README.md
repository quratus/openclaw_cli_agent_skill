
![Generated Image February 18, 2026 - 6_33PM](https://github.com/user-attachments/assets/727f578f-00a2-4867-8d80-2374f34f557f)

___________________________________
# openclaw CLI agent skill

**Website (quick start):** [cli-agent-skill.lovable.app](https://cli-agent-skill.lovable.app/#quickstart) · **Repo:** [github.com/quratus/openclaw_cli_agent_skill](https://github.com/quratus/openclaw_cli_agent_skill)

OpenClaw skill that delegates coding tasks to CLI agents (Kimi, Claude Code, OpenCode) in isolated git worktrees. The CLI Agents build the code and return their results back to openclaw.

## Supported Providers

The skill supports multiple CLI providers:

| Provider | CLI Command | Authentication |
|----------|-------------|----------------|
| **Kimi** (default) | `kimi` | Run `kimi` then `/login` |
| **Claude Code** | `claude` | Set `ANTHROPIC_API_KEY` env var |
| **OpenCode** | `opencode` | Run `opencode auth login` |

## Prerequisites

> **You must have a subscription of the CLI Agent you want to use. Install and authenticate the CLI yourself before using this skill. This skill does not store or use any credentials.**

- **Node.js** >= 18
- **At least one CLI** installed and authenticated:
  - **Kimi:** Run `kimi` then `/login` in the REPL
  - **Claude Code:** Install via npm and set `ANTHROPIC_API_KEY`
  - **OpenCode:** Install and run `opencode auth login`

**CI and credentials:** This repo does not use or store any credentials. GitHub Actions runs lint, build, and unit tests only. Integration tests require a local CLI and auth; run `npm run test:integration` locally.

## Install

### Install and forget

1. **Install the CLI:**
   ```bash
   # From npm (recommended)
   npm install -g @sqncr/openclaw-cli-agent-skill
   
   # Or from git
   npm install -g github:quratus/openclaw_cli_agent_skill
   
   # Or clone and link
   git clone https://github.com/quratus/openclaw_cli_agent_skill.git
   cd openclaw_cli_agent_skill
   npm install && npm run build
   npm link
   ```

2. **Register the skill:**
   ```bash
   npm run install-skill
   ```

3. **Restart gateway or start a new session** so the agent discovers the skill.

No credentials or extra config required; you must have authenticated the underlying CLI separately (see Prerequisites).

### Register skill so the OpenClaw agent can use it

OpenClaw only loads skills from `~/.openclaw/skills/`, the workspace `skills/` folder, or `skills.load.extraDirs` in config. After installing the CLI, register the skill so your bot (e.g. Hermes) can see "cli-worker":

```bash
cd openclaw_cli_agent_skill   # or wherever you cloned it
npm run install-skill
```

This symlinks `skills/cli-worker` to `~/.openclaw/skills/cli-worker`. Restart the OpenClaw gateway or start a new chat so the agent gets the updated skills list.

## Quick start

```bash
# Verify default provider (Kimi)
cli-worker verify

# Verify specific provider
cli-worker verify --provider claude
cli-worker verify --provider opencode

# Run a simple task
cli-worker execute "Reply OK"

# Run with specific provider
cli-worker execute "Create API" --provider claude
```

## Commands

| Command | Description |
|---------|-------------|
| `cli-worker verify` | Check CLI agent install and auth |
| `cli-worker verify --provider <id>` | Verify specific provider (kimi, claude, opencode) |
| `cli-worker execute "<prompt>"` | Run a task in an isolated worktree |
| `cli-worker execute "<prompt>" --provider <id>` | Run with specific provider |
| `cli-worker status <taskId>` | Show task status from report (add `--provider claude` or `--provider opencode` if the task used that provider) |
| `cli-worker worktree list` | List active worktrees |
| `cli-worker worktree remove <taskId>` | Remove a worktree |
| `cli-worker cleanup [--older-than N]` | Remove worktrees older than N hours (default 24) |

### Output format

- Default `json` prints only the last assistant text from the stream.
- Use `--output-format text` to get full plain-text output (useful when the agent should consume all output).

## Provider Configuration

### Provider Resolution Order

The skill resolves the provider in this order (first match wins):

1. **`--provider <id>`** flag on the command line
2. **`OPENCLAW_CLI_PROVIDER`** environment variable
3. **Config file:** `openclaw.json` (`cliWorker.provider` or `skills["cli-worker"].provider`)
4. **Default:** `kimi`

### Examples

```bash
# Use --provider flag
cli-worker execute "Create API" --provider claude

# Use environment variable
export OPENCLAW_CLI_PROVIDER=claude
cli-worker execute "Create API"

# Use config file (~/.openclaw/openclaw.json)
{
  "cliWorker": { "provider": "claude" }
}
# or
{
  "skills": { "cli-worker": { "provider": "claude" } }
}
```

## Merge and cleanup

After a task completes:

- **To keep the work:** From the **main repo** (e.g., on `main`), run:
  ```bash
  git merge openclaw/<taskId>
  cli-worker worktree remove <taskId>
  ```
- **To discard:** Run `cli-worker worktree remove <taskId>` directly, or rely on `cli-worker cleanup --older-than N`.

## Config

Optional config file: `~/.openclaw/openclaw.json`

```json
{
  "worktree": { "basePath": "~/.openclaw/worktrees" },
  "cliWorker": { "provider": "claude" }
}
```

Override with env: `OPENCLAW_CONFIG=/path/to/config.json`

### Environment variables (all optional)

| Variable | Purpose |
|----------|---------|
| `OPENCLAW_CLI_PROVIDER` | Default provider: `kimi`, `claude`, or `opencode` |
| `KIMI_CLI_PATH` | Path or name of the Kimi CLI executable (default: `kimi`). Validated; invalid values fall back to `kimi`. |
| `KIMI_HOME` | Kimi config/credentials directory (default: `~/.kimi`). |
| `CLAUDE_CLI_PATH` | Path or name of the Claude CLI executable (default: `claude`). Validated; invalid values fall back to `claude`. |
| `ANTHROPIC_API_KEY` | API key for Claude Code authentication. |
| `OPENCODE_CLI_PATH` | Path or name of the OpenCode CLI executable (default: `opencode`). Validated; invalid values fall back to `opencode`. |
| `OPENCLAW_CONFIG` | Path to OpenClaw config JSON (default: `~/.openclaw/openclaw.json`). |
| `OPENCLAW_LOG_DIR` | Directory for cli-worker log file (default: `~/.openclaw/logs`). |
| `KIMI_NO_BROWSER` | Set to `1` by the skill when invoking Kimi (no override needed). |

None are required. The skill only reads under `~/.kimi`, `~/.local/share/opencode` (for verification) and writes under `~/.openclaw` (logs, manifests).

### OpenClaw skill registration

**Recommended:** run `npm run install-skill` from this repo to symlink the skill into `~/.openclaw/skills/cli-worker`. OpenClaw loads skills from that directory automatically; no config change needed.

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
# When cli-worker skill is enabled
if command -v cli-worker >/dev/null 2>&1; then
  cli-worker cleanup --older-than 24
fi
```

## Provider Details

### Kimi (default)

- **Command:** `kimi` (or `KIMI_CLI_PATH`)
- **Headless:** `--print -p "<prompt>" --output-format=stream-json`
- **Auth:** `~/.kimi/config.toml` and credentials in `~/.kimi/credentials/`
- **Verify:** `kimi --print -p "Reply OK"`

### Claude Code

- **Command:** `claude` (or `CLAUDE_CLI_PATH`)
- **Headless:** `claude -p "<prompt>" --output-format stream-json`
- **Auth:** `ANTHROPIC_API_KEY` environment variable
- **Verify:** `claude -p "Reply OK"`
- **Install:** `npm install -g @anthropic-ai/claude-code`

### OpenCode

- **Command:** `opencode run "<prompt>"` (or `OPENCODE_CLI_PATH`)
- **Headless:** `opencode run "<prompt>" --format json`
- **Auth:** `~/.local/share/opencode/auth.json`
- **Verify:** `opencode auth list`

## Known limitations

- Kimi, Claude, and OpenCode must be installed and authenticated by the user; the skill cannot perform login for you.
- Timeout is a hard kill at `--timeout` minutes; there is no soft "wrap up" warning (print mode may not support stdin for that).
- Session resumption (resume an interrupted task in the same session) is planned for a later version.

## License

MIT
