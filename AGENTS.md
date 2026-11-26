# ZooWorkDesign public repository

- React Web components: `web/packages/design-system`; Chat Alpha: `web/packages/chat-ui`; catalog: `web/apps/preview`.
- Node 24, pnpm 10.26.2. Run pnpm from `web/`. Keep React external, module-level client boundaries, CSS exports, types and asset-relative paths.
- Public packages are exclusively `@zooclaw/zooworkdesign` and `@zooclaw/zooworkdesign-chat`, using npmjs.org and `access: public`. Never publish or change permissions for the separate legacy private package names.
- Chat stays Alpha and uses `next`; stable foundations use `latest`; verified same-repository PR builds use `preview` / `pr-N`. Do not promote Chat to stable without explicit approval.
- Before release: build, typecheck, lint, test, test:release, build:preview, pack:release, verify:theme, verify:consumer, verify:preview. Test the actual tgz and both packages together.
- Component or preview changes require matching package Markdown changelog, `src/changelog.ts` and bilingual preview messages in the same PR. Preserve public release history. Pure documentation/tooling changes may explain N/A.
- Publish only verified artifacts from the current source. Match source, versions, integrity and the live preview before promoting tags. A repeated version may only be skipped when integrity is identical.
- The delivery workflow runs trusted default-branch scripts and treats downloaded PR artifacts as data. Never run fork artifacts with publication credentials.
- GitHub Pages uses the official Pages artifact/deployment actions. npm write credentials stay in GitHub Secrets. Never copy local login tokens into source, logs or CI.
- Preserve Apache-2.0, third-party notices, upstream license bytes, fonts and scoped CC BY 4.0 attribution. Brand marks are excluded from the general artwork grant.
- New work uses isolated Git worktrees. Keep screenshots in ignored `.screenshots/`. Do not automatically merge PRs.
