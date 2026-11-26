import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const web = resolve(root, 'web');
const basePath = '/ZooWorkDesign/';
const site = `https://serendipityoneinc.github.io${basePath}`;
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const packageVersion = name => JSON.parse(readFileSync(resolve(web, `packages/${name}/package.json`), 'utf8')).version;

execFileSync('pnpm', ['--filter', '@zooclaw/zooworkdesign-preview', 'exec', 'vite', 'build', '--base', basePath], {
  cwd: web,
  stdio: 'inherit',
});
const dist = resolve(web, 'apps/preview/dist');
writeFileSync(resolve(dist, '.nojekyll'), '');
writeFileSync(resolve(dist, 'preview-version.json'), `${JSON.stringify({
  version: packageVersion('design-system'),
  chatUiVersion: packageVersion('chat-ui'),
  sourceCommit,
  site,
  basePath,
  ...(existsSync(resolve(root, 'artifacts/delivery.json')) ? { delivery: JSON.parse(readFileSync(resolve(root, 'artifacts/delivery.json'), 'utf8')) } : {}),
}, null, 2)}\n`);
console.log(`Pages preview prepared for ${site} (source ${sourceCommit})`);
