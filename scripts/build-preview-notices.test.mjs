import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { previewNoticeFiles } from './build-preview-notices.mjs';
import { inventory, previewRecords, root, sha256 } from './third-party-utils.mjs';

test('preview notices cover runtime dependencies and preserve original license bytes', () => {
  const files = previewNoticeFiles();
  const records = previewRecords();
  const html = files.get('index.html').toString();
  for (const name of ['react', 'react-dom', 'motion', '@heroicons/react', 'radix-ui']) assert(records.some(r => r.name === name));
  assert(!records.some(r => ['stackback', 'vitest', 'caniuse-lite'].includes(r.name)));
  for (const record of [...records, ...inventory.fonts, { licenseFiles: inventory.copiedLicenseFiles }]) {
    for (const file of record.licenseFiles) assert.equal(sha256(files.get(file.path)), file.sha256, file.path);
  }
  assert.deepEqual(files.get('LICENSE'), readFileSync(resolve(root, 'LICENSE')));
  assert(html.includes('Copyright (c) 2023 shadcn'));
  assert(html.includes('Copyright (c) Tailwind Labs, Inc.'));
  assert(html.includes('Visual assets and trademarks are excluded'));
});

test('every local notice link resolves within the generated standalone directory', () => {
  const files = previewNoticeFiles();
  const html = files.get('index.html').toString();
  for (const [, target] of html.matchAll(/href="([^"]+)"/g)) {
    if (target === '../../' || /^https?:\/\//.test(target)) continue;
    assert(files.has(decodeURIComponent(target)), `Missing linked notice: ${target}`);
  }
  assert(!html.includes('ecap-workspace'));
  assert(!files.has('inventory.json'), 'Internal evidence metadata is not copied to the catalog');
});
