import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deliveryVersions } from './delivery-model.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const event = process.env.GITHUB_EVENT_NAME;
if (process.env.GITHUB_ACTIONS !== 'true' || !['pull_request', 'push'].includes(event)) {
  console.log('Local/manual build: keeping source package versions.');
} else {
  const payload = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  if (event === 'push' && process.env.GITHUB_REF !== 'refs/heads/main') throw new Error('Automatic stable versions require main');
  const manifests = ['design-system', 'chat-ui'].map(folder => resolve(root, `web/packages/${folder}/package.json`));
  const [design, chat] = manifests.map(path => JSON.parse(readFileSync(path, 'utf8')));
  const delivery = {
    event, pullRequest: event === 'pull_request' ? payload.number : null,
    runId: Number(process.env.GITHUB_RUN_ID), runNumber: Number(process.env.GITHUB_RUN_NUMBER), runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
    headCommit: event === 'pull_request' ? payload.pull_request.head.sha : process.env.GITHUB_SHA,
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    baseVersions: { design: design.version, chat: chat.version },
  };
  delivery.versions = deliveryVersions(delivery.baseVersions, delivery);
  design.version = delivery.versions.design;
  chat.version = delivery.versions.chat;
  [design, chat].forEach((pkg, index) => writeFileSync(manifests[index], JSON.stringify(pkg, null, 2) + '\n'));
  writeFileSync(resolve(root, 'web/packages/design-system/src/version.ts'), `export const DESIGN_SYSTEM_VERSION = '${design.version}' as const\n`);
  mkdirSync(resolve(root, 'artifacts'), { recursive: true });
  writeFileSync(resolve(root, 'artifacts/delivery.json'), JSON.stringify(delivery, null, 2) + '\n');
  console.log(`Delivery versions: ${design.version}, ${chat.version}`);
}
