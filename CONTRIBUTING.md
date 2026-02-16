# Contributing

This project currently targets the **Kimi CLI**. Contributions to support other coding CLIs (e.g. Claude Code, OpenCode, Aider) via a provider/adapter pattern are welcome—see the auth, spawn, and parser modules for the extension points.

## Dev setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/quratus/openclaw_cli_agent_skill.git
   cd openclaw_cli_agent_skill
   npm install
   ```

2. Build and run unit tests:

   ```bash
   npm run build
   npm run test:unit
   ```

3. Lint:

   ```bash
   npm run lint
   ```

## Test commands

- **Unit tests** (no Kimi CLI required): `npm run test:unit`
- **Integration tests** (require Kimi CLI installed and authenticated): `npm run test:integration`. These are skipped automatically if Kimi is not available.

## Code style

- TypeScript, ES modules, Node >= 18
- ESLint + Prettier; run `npm run lint` before committing.

## Submitting changes

1. Open an issue or pick an existing one.
2. Branch from `main`, make changes, add/update tests.
3. Ensure `npm run lint` and `npm run test:unit` pass.
4. Open a PR with a short description and reference to the issue.
