import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { checkGenerated, expectedFiles, root, validateEvidence } from './third-party-utils.mjs';

const args = process.argv.slice(2);
if (args.length && (args.length !== 1 || args[0] !== '--check')) throw new Error('Usage: sync-third-party.mjs [--check]');
validateEvidence();
for (const folder of [null, 'design-system', 'chat-ui']) {
  if (args.includes('--check')) checkGenerated(folder);
  else for (const [file, content] of expectedFiles(folder)) {
    const target = resolve(root, folder ? `web/packages/${folder}` : '', file);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}
console.log(args.includes('--check') ? 'Third-party notices and original license hashes verified.' : 'Third-party notices generated for repository and both npm packages.');
