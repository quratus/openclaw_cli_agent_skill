# Agent learnings

- **Kimi CLI spawn**: Use `kimi --print -p "<prompt>" --output-format=stream-json`; stdout is one JSON object per line. Last assistant message's last `content` part with `type: "text"` is the final reply.
- **Worktree list**: `git worktree list` must be run from the main repo; filter output by basePath to get worktrees we created. TaskId = last path segment under basePath.
- **Config for tests**: Use `OPENCLAW_CONFIG`, `KIMI_HOME`, `OPENCLAW_LOG_DIR` so unit tests don't touch real homedir.
