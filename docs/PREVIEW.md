# Component preview / 组件预览

[Live ZooWorkDesign](https://serendipityoneinc.github.io/ZooWorkDesign/) · [Component catalog](https://serendipityoneinc.github.io/ZooWorkDesign/?view=components) · [Versions](https://serendipityoneinc.github.io/ZooWorkDesign/preview-version.json)

The homepage, catalog and composition examples render the actual packages. They support English/Chinese, light/dark themes, keyboard interaction and narrow screens. Chat UI remains Alpha; demonstrations use local sample data.

```bash
git clone https://github.com/SerendipityOneInc/ZooWorkDesign.git
cd ZooWorkDesign/web
pnpm install --frozen-lockfile
pnpm dev
```

Use Node 24 / pnpm 10.26.2 and open the actual URL printed by Vite. After changing package source, rebuild the packages; the catalog imports compiled entrypoints.

`pnpm build:preview` produces root-path static output. `pnpm build:preview:pages` targets `/ZooWorkDesign/` and writes version metadata. Serve output over HTTP, not by double-clicking index.html.

The delivery workflow deploys only verified static output with GitHub's Pages actions. Package channels move after the live preview matches; see [publishing](PUBLISHING.md). CI artifacts require GitHub access, while the deployed site is publicly accessible.

To update the README hero from actual components, start the preview and run `node scripts/capture-readme-hero.mjs <actual-local-url>` from the repository root. The image is saved to `docs/assets/readme-hero.png`.
