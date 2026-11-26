import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { integrity, releaseTag, validatePackage } from './release-utils.mjs';
import { checkGenerated, validateEvidence, verifyPackageNotices } from './third-party-utils.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const artifacts = resolve(root, 'artifacts');
mkdirSync(artifacts, { recursive: true });
const packages = [];
validateEvidence();
checkGenerated(null);
for (const folder of ['design-system', 'chat-ui']) {
  checkGenerated(folder);
  const cwd = resolve(root, 'web/packages', folder);
  const source = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
  if (!source.exports['.']?.types?.startsWith('./dist/')) throw new Error('Release must export built declarations');
  execFileSync('pnpm', ['pack', '--pack-destination', artifacts], { cwd, stdio: 'pipe' });
  const file = `${source.name.replace('@', '').replace('/', '-')}-${source.version}.tgz`;
  const path = resolve(artifacts, file);
  const pkg = JSON.parse(execFileSync('tar', ['-xOf', path, 'package/package.json'], { encoding: 'utf8' }));
  validatePackage(pkg);
  const entries = execFileSync('tar', ['-tzf', path], { encoding: 'utf8' }).trim().split('\n');
  if (entries.some(name => /(?:\.test\.|\.spec\.|\/__tests__\/|\/preview\/|\/node_modules\/|\/src\/|\/\.env)/.test(name))) throw new Error(`Development files leaked into ${file}`);
  for (const required of ['package/dist/index.js', 'package/dist/index.d.ts', 'package/tailwind.css']) {
    if (!entries.includes(required)) throw new Error(`Missing ${required}`);
  }
  if (folder === 'design-system' && !entries.includes('package/assets/logos/zoowork-horizontal-navy.png')) throw new Error('Brand assets missing');
  if (pkg.license !== 'Apache-2.0') throw new Error('Unexpected project code license');
  verifyPackageNotices(folder, entries, entry => execFileSync('tar', ['-xOf', path, entry], { maxBuffer: 16 * 1024 * 1024 }));
  packages.push({ name: pkg.name, version: pkg.version, file, integrity: integrity(readFileSync(path)), tag: releaseTag(pkg.version) });
  console.log(`Packed ${pkg.name}@${pkg.version} (${entries.length} files)`);
}
writeFileSync(resolve(artifacts, 'release.json'), JSON.stringify({ packages }, null, 2) + '\n');
