# Contributing / 贡献

Open an issue with a reproducible example or a concrete use case, then work in an isolated branch/worktree. Use Node 24 and pnpm 10.26.2 from `web/`.

Preview and application examples must reuse the public component entrypoints. Keep business APIs and credentials out of the library. Preserve React peer dependencies, client boundaries, CSS exports, types, asset paths and notices.

For component/preview changes, update the affected Markdown changelog, shared preview changelog and both languages in the same PR. Include the problem, resulting behavior and relevant validation. Do not automatically merge PRs.

Before requesting review, run build, typecheck, lint, test, test:release and build:preview. Packaging or API changes also require pack:release and verify:consumer with the actual tgz. For interaction changes, run verify:preview and appropriate browser checks.

Use synthetic examples, keep screenshots in ignored `.screenshots/`, and follow [SECURITY.md](SECURITY.md) for vulnerability reports. Contributions must have compatible rights and preserve third-party attribution. See [AGENTS.md](AGENTS.md) for automation rules and [publishing](docs/PUBLISHING.md) for maintainer delivery.
