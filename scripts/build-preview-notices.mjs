import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventory, previewRecords, root, validateEvidence } from './third-party-utils.mjs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const href = value => escape(value.split('/').map(encodeURIComponent).join('/'));

// The catalog is a bundled application: carry its own runtime graph, fonts and
// adapted-source notices even though npm tarballs also include their copies.
export function previewNoticeFiles() {
  validateEvidence();
  const records = previewRecords();
  const files = new Map();
  for (const name of ['LICENSE', 'LICENSING.md', 'LICENSE-CC-BY-4.0', 'DESIGN_ASSETS.md', 'ASSET_MANIFEST.json']) files.set(name, readFileSync(resolve(root, name)));
  files.set('NOTICE', Buffer.from('ZooWork component preview\n\nOriginal component code and CSS: Apache License 2.0 (LICENSE).\nAdapted foundation components: shadcn/ui, Copyright (c) 2023 shadcn, MIT.\nIcons and adapted navigation geometry: Heroicons, Copyright (c) Tailwind Labs, Inc., MIT.\nThird-party code and fonts retain their original licenses.\nSee index.html for attribution, upstream sources and local original license files.\nLICENSING.md describes the repository licensing scope; paths mentioned there refer to the source repository.\nThese notices do not imply endorsement by the upstream authors.\n'));
  function originals(entries) {
    return entries.map(file => {
      files.set(file.path, readFileSync(resolve(root, 'third-party', file.path)));
      return `<a href="${href(file.path)}">${escape(file.path.split('/').at(-1))}</a>`;
    }).join(' · ');
  }
  const rows = records.map(record => `<tr><th scope="row">${escape(record.name)}<br><small>${escape(record.version)}</small></th><td>${escape(record.license)}</td><td>${escape(record.author || 'See original notices')}<br><a href="${escape(record.source)}">Source / 来源</a></td><td>${originals(record.licenseFiles)}</td></tr>`).join('\n');
  const fonts = inventory.fonts.map(font => `<li><strong>${escape(font.name)}</strong> — ${escape(font.license)}<br>${escape(font.copyright)}<br>${originals(font.licenseFiles)}</li>`).join('\n');
  const copied = originals(inventory.copiedLicenseFiles);
  const githubMarkLicense = originals([{ path: 'licenses/preview/github-octicons/LICENSE' }]);
  files.set('index.html', Buffer.from(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Credits &amp; licenses · ZooWork</title>
<style>html{color-scheme:light dark}body{font:16px/1.6 system-ui,sans-serif;max-width:1080px;margin:0 auto;padding:32px 20px;overflow-wrap:anywhere}a{color:LinkText}table{border-collapse:collapse;width:100%}td,th{padding:12px;text-align:left;vertical-align:top;border-bottom:1px solid GrayText;overflow-wrap:anywhere}th{font-weight:600}small{font-weight:400}li{margin:16px 0}.table-wrap{overflow:auto}a:focus-visible{outline:2px solid Highlight;outline-offset:3px}</style></head>
<body><main><a href="../../">← Component catalog / 返回组件目录</a><h1>Credits &amp; licenses / 署名与许可</h1>
<p>Original component code and CSS: <a href="LICENSE">Apache-2.0</a>. See <a href="NOTICE">NOTICE</a> and <a href="LICENSING.md">licensing scope</a>. Third-party code and fonts retain their own terms. Visual assets and trademarks are excluded from the code license unless separately stated.</p>
<p lang="zh-CN">原创组件代码和 CSS 使用 Apache 2.0；第三方代码与字体保留各自许可。品牌标识与非代码视觉素材不因展示在此目录中而自动获得代码许可证的授权。</p>
<h2>Original design assets / 原创设计资源</h2><p>ZooWork Design System · Design by Lynn Zhuang. The explicitly listed original assets use <a href="LICENSE-CC-BY-4.0">CC BY 4.0</a>. See the <a href="DESIGN_ASSETS.md">asset scope and attribution</a> and <a href="ASSET_MANIFEST.json">exact file manifest</a>. Retain credit, link to the license and indicate changes. ZooWork brand marks remain excluded.</p>
<p>This catalog includes the following audited runtime/peer dependency graph (${records.length} packages); this conservative list may include dependencies removed by bundler tree-shaking. Author names are package metadata; copyright and permission notices are preserved in the original files linked below.</p>
<h2>Adapted component code / 改写组件</h2><p>shadcn/ui — Copyright (c) 2023 shadcn. ${copied}. ZooWork adapts component styling and behavior. ProductNavIcon adapts Heroicons SVG paths; Copyright (c) Tailwind Labs, Inc.; the original MIT license is included in the @heroicons/react row below. Modifications include viewBox, size, fill and stroke handling.</p>
<h2>Fonts / 字体</h2><ul>${fonts}</ul>
<h2>Preview navigation icon / 预览导航图标</h2><p>GitHub mark — Copyright (c) 2026 GitHub Inc., MIT. <a href="https://github.com/primer/octicons/blob/68ec2de8d0ddfcbb7497da01d0b7d98eb5593020/icons/mark-github-16.svg">Octicons source</a>. ${githubMarkLicense}. SVG geometry is unchanged; React rendering uses the surrounding text color. The mark identifies the GitHub source link and does not imply endorsement.</p>
<h2>Dependencies / 依赖</h2><div class="table-wrap" role="region" aria-label="Dependency licenses" tabindex="0"><table><thead><tr><th scope="col">Package</th><th scope="col">License</th><th scope="col">Author metadata / source</th><th scope="col">Original notices</th></tr></thead><tbody>${rows}</tbody></table></div>
</main></body></html>\n`));
  return files;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = resolve(root, 'web/apps/preview/public/assets/licenses');
  const files = previewNoticeFiles();
  // Retire the earlier generated directory; the publisher accepts assets/.
  rmSync(resolve(root, 'web/apps/preview/public/licenses'), { recursive: true, force: true });
  // Dedicated ignored output: remove stale notices when dependencies change.
  rmSync(output, { recursive: true, force: true });
  for (const [name, bytes] of files) {
    const target = resolve(output, name);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  }
  console.log(`Prepared ${files.size} preview attribution files.`);
}
