import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../web/package.json', import.meta.url));
const { parse } = require('yaml');
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => readFileSync(resolve(root, path));
export const inventory = JSON.parse(read('third-party/inventory.json'));
const lockBytes = read('web/pnpm-lock.yaml');
const lock = parse(lockBytes.toString());

export function validateEvidence() {
  if (sha256(lockBytes) !== inventory.lockSha256) throw new Error('Dependency lock changed: refresh third-party/inventory.json and license evidence before packaging.');
  const keys = inventory.records.map(r => `${r.name}@${r.version}`).sort();
  if (JSON.stringify(keys) !== JSON.stringify(Object.keys(lock.packages).sort())) throw new Error('Third-party inventory does not cover the complete lockfile.');
  for (const entry of [...inventory.records, ...inventory.fonts, { licenseFiles: inventory.copiedLicenseFiles }]) {
    for (const file of entry.licenseFiles) {
      if (sha256(read(`third-party/${file.path}`)) !== file.sha256) throw new Error(`Changed original license: ${file.path}`);
    }
  }
  for (const font of inventory.fonts) for (const file of font.files) {
    if (sha256(read(`web/packages/design-system/${file.path}`)) !== file.sha256) throw new Error(`Font changed: refresh source and license evidence for ${file.path}`);
  }
}

function importerRecords(importer) {
  const keys = new Set();
  const snapshots = new Set();
  const importers = new Set();
  function visit(name, version, importer) {
    if (version.startsWith('link:')) return visitImporter(resolve('/web', importer, version.slice(5)).slice('/web/'.length));
    const key = `${name}@${version}`;
    if (snapshots.has(key)) return;
    snapshots.add(key);
    keys.add(key.split('(')[0]);
    const snapshot = lock.snapshots[key];
    if (!snapshot) throw new Error(`Missing locked dependency: ${key}`);
    for (const [child, ref] of Object.entries({ ...snapshot.dependencies, ...snapshot.optionalDependencies })) visit(child, ref, importer);
  }
  function visitImporter(importer) {
    if (importers.has(importer)) return;
    importers.add(importer);
    const manifest = JSON.parse(read(`web/${importer}/package.json`));
    const resolved = lock.importers[importer];
    for (const name of Object.keys({ ...manifest.dependencies, ...manifest.optionalDependencies, ...manifest.peerDependencies })) {
      const item = resolved.dependencies?.[name] ?? resolved.optionalDependencies?.[name] ?? resolved.devDependencies?.[name];
      if (!item) throw new Error(`No audited version for ${name} in ${importer}`);
      visit(name, item.version, importer);
    }
  }
  visitImporter(importer);
  const records = inventory.records.filter(r => keys.has(`${r.name}@${r.version}`));
  if (records.length !== keys.size) throw new Error('Missing runtime license metadata.');
  if (records.some(r => !r.licenseFiles.length)) throw new Error('A distributed component dependency lacks original license text; resolve before packing.');
  return records;
}

export const packageRecords = folder => importerRecords(`packages/${folder}`);
export const previewRecords = () => importerRecords('apps/preview');

function notices(records, folder) {
  const lines = ['# Third-party notices / 第三方署名与许可', '',
    `Audit date: ${inventory.auditDate}. Original upstream copyright, permission, warranty, NOTICE and other supplied notices are retained verbatim in the linked files. Author names below come from package metadata and do not replace copyright-holder statements in those files.`, '',
    folder ? `This list covers the audited runtime and peer dependency graph of ${JSON.parse(read(`web/packages/${folder}/package.json`)).name}, including its workspace dependencies. npm dependencies remain external imports; this is not a claim that their code is bundled into this archive. Peer versions are the versions verified in this repository, not a restriction on consumer resolution.` : `This repository inventory covers all ${inventory.records.length} locked package versions, including development, test and optional platform dependencies. npm package inventories contain only their runtime and peer graphs.`, '',
    'Source adaptations and original MIT copyright statements: [shadcn/ui and Heroicons](third-party/SOURCE_ATTRIBUTION.md). In chat-ui these foundation adaptations are supplied by the companion @zooclaw/zooworkdesign dependency. Code licensing and asset exclusions: [LICENSING.md](LICENSING.md).', '',
    '| Dependency | Audited version | License | Author from metadata | Original license / notices |', '| --- | --- | --- | --- | --- |'];
  const clean = text => String(text || 'See original notices').replaceAll('|', '\\|').replaceAll('\n', ' ');
  for (const r of records) lines.push(`| [${r.name}](${r.source}) | ${r.version} | ${r.license} | ${clean(r.author)} | ${r.licenseFiles.map(f => `[${f.path.split('/').at(-1)}](third-party/${f.path})`).join('; ') || 'MIT declared in version metadata; standalone upstream LICENSE not located. Declaration accepted in the completed legal review; evidence limitation retained.'} |`);
  if (!folder || folder === 'design-system') {
    lines.push('', '## Fonts', '', 'Fonts retain OFL-1.1 and their Reserved Font Names. The 210 original binaries are unchanged. See the file/source/hash mapping in third-party/inventory.json. GFS Didot original embedded metadata retains historical 1.1-review1 wording, provided alongside the supplied OFL-1.1 for review.', '');
    for (const f of inventory.fonts) lines.push(`- **${f.name}** (${f.files.length} files): ${f.copyright}. ${f.licenseFiles.map(p => `[${p.path.split('/').at(-1)}](third-party/${p.path})`).join('; ')}`);
  }
  if (!folder) lines.push('', '## CC BY 4.0 data attribution', '',
    'caniuse-lite 1.0.30001814, by Ben Briggs and the caniuse-lite contributors, is a compact form of the Can I Use compatibility dataset maintained by @Fyrd and its contributing community. Source: https://github.com/browserslist/caniuse-lite and https://caniuse.com/. License: https://creativecommons.org/licenses/by/4.0/; the complete supplied text is linked in the table. ZooWork uses the published dependency as a build tool input without modifying its dataset. This entry acknowledges the upstream compacting of caniuse-db; it does not claim that the dataset is included in the component tarballs or that its authors endorse ZooWork.', '',
    '## Evidence limitations', '',
    '- @napi-rs/lzma-linux-x64-gnu 1.5.1 and stackback 0.0.2 explicitly declare MIT; no standalone original LICENSE was located. They are development dependencies, excluded from both component-package inventories. Legal review of the inventoried scope is complete; these evidence limitations remain technical records.',
    '- react-remove-scroll-bar 2.3.8: original license text is linked through identical code in 2.3.7 and its immediate license-adding commit; the published 2.3.8 gitHead is unresolved. The original evidence limitation is retained in inventory.json.',
    '- Some optional platform packages use corresponding upstream license texts rather than a LICENSE inside the platform tarball. Evidence provenance is recorded per entry. This is not a complete audit of embedded Rust dependencies or all Git history.');
  return lines.join('\n') + '\n';
}

export function expectedFiles(folder) {
  const records = folder ? packageRecords(folder) : inventory.records;
  const fonts = folder === 'chat-ui' ? [] : inventory.fonts;
  const files = new Map();
  for (const name of ['LICENSE', 'NOTICE', 'LICENSING.md', 'LICENSE-CC-BY-4.0', 'DESIGN_ASSETS.md', 'ASSET_MANIFEST.json']) files.set(name, read(name));
  files.set('THIRD_PARTY_NOTICES.md', Buffer.from(notices(records, folder)));
  files.set('third-party/SOURCE_ATTRIBUTION.md', read('third-party/SOURCE_ATTRIBUTION.md'));
  for (const item of [...records, ...fonts, { licenseFiles: inventory.copiedLicenseFiles }]) {
    for (const file of item.licenseFiles) files.set(`third-party/${file.path}`, read(`third-party/${file.path}`));
  }
  const subset = folder ? { ...inventory, packageName: JSON.parse(read(`web/packages/${folder}/package.json`)).name, records, fonts, copiedSourcesLocation: folder === 'chat-ui' ? '@zooclaw/zooworkdesign companion package' : 'this package' } : inventory;
  files.set('third-party/inventory.json', Buffer.from(JSON.stringify(subset, null, 2) + '\n'));
  return files;
}

export function verifyPackageNotices(folder, entries, readEntry) {
  const paths = new Set(entries);
  for (const [file, expected] of expectedFiles(folder)) {
    const entry = `package/${file}`;
    if (!paths.has(entry)) throw new Error(`Missing packed attribution: ${entry}`);
    if (!Buffer.from(readEntry(entry)).equals(expected)) throw new Error(`Altered packed attribution: ${entry}`);
  }
  if (folder === 'design-system') {
    const assets = JSON.parse(read('ASSET_MANIFEST.json'));
    for (const asset of assets.assets.filter(item => item.packagePath)) {
      const entry = `package/${asset.packagePath}`;
      if (!paths.has(entry) || sha256(readEntry(entry)) !== asset.sha256) throw new Error(`Missing/changed licensed artwork: ${asset.packagePath}`);
    }
    const removed = JSON.parse(read('docs/release/removed-assets.json'));
    for (const asset of removed.removedPackagePaths) {
      if (paths.has(`package/assets/${asset}`)) throw new Error(`Excluded release artwork was packed: ${asset}`);
    }
    for (const source of inventory.copiedSources) {
      const entry = `package/${source.path.split('/design-system/')[1].replace(/^src\//, 'dist/').replace(/\.tsx?$/, '.js')}`;
      if (!String(readEntry(entry)).includes('Copyright (c) 2023 shadcn')) throw new Error(`Missing emitted shadcn copyright: ${entry}`);
    }
    if (!String(readEntry('package/dist/product-patterns/product-nav-icon.js')).includes('Copyright (c) Tailwind Labs, Inc.')) throw new Error('Missing emitted Heroicons copyright');
    for (const font of inventory.fonts) for (const file of font.files) {
      if (!paths.has(`package/${file.path}`) || sha256(readEntry(`package/${file.path}`)) !== file.sha256) throw new Error(`Missing/changed packed font: ${file.path}`);
    }
  }
}

export function checkGenerated(folder) {
  const prefix = folder ? `web/packages/${folder}/` : '';
  for (const [file, expected] of expectedFiles(folder)) {
    const target = `${prefix}${file}`;
    if (!existsSync(resolve(root, target)) || !read(target).equals(expected)) throw new Error(`Outdated attribution: ${target}. Run pnpm licenses:sync.`);
  }
}
