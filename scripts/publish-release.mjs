import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyVersionLookup, integrity, registry, releaseTag, validatePackage } from './release-utils.mjs';

const artifacts = fileURLToPath(new URL('../artifacts/', import.meta.url));
const { packages } = JSON.parse(readFileSync(resolve(artifacts, 'release.json'), 'utf8'));
const dryRun = !process.argv.includes('--execute');
const stagingTag = process.argv.find(arg => arg.startsWith('--staging-tag='))?.slice('--staging-tag='.length);
if (stagingTag && !/^delivery-\d+-\d+$/.test(stagingTag)) throw new Error('Invalid staging tag');
if (packages.length !== 2 || packages[0].name !== '@zooclaw/zooworkdesign' || packages[1].name !== '@zooclaw/zooworkdesign-chat') throw new Error('Invalid release order');
for (const item of packages) {
  if (basename(item.file) !== item.file) throw new Error('Invalid artifact filename');
  const file = resolve(artifacts, item.file);
  if (integrity(readFileSync(file)) !== item.integrity) throw new Error('Artifact checksum mismatch');
  const pkg = JSON.parse(execFileSync('tar', ['-xOf', file, 'package/package.json'], { encoding: 'utf8' }));
  validatePackage(pkg);
  if (pkg.name !== item.name || pkg.version !== item.version || item.tag !== releaseTag(pkg.version)) throw new Error('Artifact metadata mismatch');
  if (pkg.name === '@zooclaw/zooworkdesign-chat' && pkg.dependencies['@zooclaw/zooworkdesign'] !== packages[0].version) throw new Error('Chat UI dependency does not match this release');
}
if (dryRun) {
  for (const item of packages) console.log(`[dry-run] ${item.name}@${item.version} → ${registry} (public, ${item.tag})`);
} else {
  if (!process.env.NODE_AUTH_TOKEN) throw new Error('Configure the repository/organization NPM_TOKEN secret before publishing. Do not put tokens in source.');
  // Authentication must succeed first: npm can return 404 for inaccessible private packages.
  execFileSync('pnpm', ['whoami', '--registry', registry], { stdio: 'pipe' });
  for (const item of packages) {
    const lookup = spawnSync('pnpm', ['view', `${item.name}@${item.version}`, '--json', '--registry', registry], { encoding: 'utf8' });
    if (classifyVersionLookup(lookup, item.integrity) === 'identical') {
      console.log(`Already published with identical integrity: ${item.name}@${item.version}`);
      continue;
    }
    execFileSync('pnpm', ['publish', resolve(artifacts, item.file), '--access', 'public', '--tag', stagingTag ?? item.tag, '--registry', registry, '--provenance=false', '--no-git-checks', '--ignore-scripts'], { stdio: 'inherit' });
  }
}
