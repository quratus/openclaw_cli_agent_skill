# Known issues / context

- **Multi-provider:** Provider abstraction (multiple CLIs) is planned. Avoid hardcoding more provider-specific behaviour in top-level CLI; keep it in auth/spawn/parser so we can add a clean provider layer.
- **CI:** Integration tests need a locally installed and authenticated CLI. We do not store or use credentials in CI, so integration tests are not run in GitHub Actions. Run `npm run test:integration` locally. CI runs lint, build, and unit tests only.
