# Dependency maintenance

The committed pnpm lockfile and third-party inventory describe the verified dependency graph. Updating dependencies requires refreshing evidence and generated notices as well as re-running real package installation tests.

The independent consumer fixture verifies Vite and Next.js 15.5.29. It intentionally resolves its own dependency tree rather than relying on workspace aliases. Browser and runtime support are documented in [SUPPORT.md](../SUPPORT.md).

Use repository security alerts and [private reporting](../../SECURITY.md) to track newly disclosed issues. A passing build is not a claim that future vulnerabilities cannot be discovered.
