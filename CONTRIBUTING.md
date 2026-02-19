# Contributing

**No credentials.** This skill never stores or logs CLI tokens. Users install and authenticate the CLI (e.g. Kimi) on their own machine; we only verify that auth exists.

Before starting, check `KNOWN_ISSUES.md`. If your change conflicts with planned multi-provider work, open an issue first.

## Dev setup

```bash
git clone https://github.com/quratus/openclaw_cli_agent_skill.git
cd openclaw_cli_agent_skill
npm install && npm run build && npm run test:unit
npm run lint
```

## Tests

- **Unit** (no CLI): `npm run test:unit` — required for CI and PRs.
- **Integration** (need local CLI + auth): `npm run test:integration` — run locally only; not run in GitHub Actions because we don't use or store credentials.

## Code style

TypeScript, ES modules, Node >= 18. ESLint + Prettier; run `npm run lint` before committing.

## Submitting changes

1. Open an issue or pick one.
2. Branch from `main`, change, add/update tests.
3. `npm run lint` and `npm run test:unit` must pass.
4. Open a PR; integration tests are optional (local only).

## Provider extensions (later)

Multi-provider (Claude Code, OpenCode, etc.) is planned. Extension points: `src/auth/verify.ts`, `src/spawn/run.ts`, parser. Keep auth verify-only and worktree-isolated so we can add a clean provider layer on top.
