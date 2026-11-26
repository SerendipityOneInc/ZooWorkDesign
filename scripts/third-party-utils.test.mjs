import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { expectedFiles, inventory, packageRecords, root, validateEvidence, verifyPackageNotices } from './third-party-utils.mjs';

test('audited dependency and font evidence matches the checked-in lock and original bytes', () => {
  validateEvidence();
  for (const folder of ['design-system', 'chat-ui']) {
    const records = packageRecords(folder);
    assert.ok(records.some(r => r.name === 'react'));
    assert.ok(records.some(r => r.name === '@heroicons/react'));
    assert.ok(!records.some(r => ['stackback', '@napi-rs/lzma-linux-x64-gnu', 'caniuse-lite'].includes(r.name)));
  }
});

function archive() {
  const files = new Map([...expectedFiles('design-system')].map(([name, bytes]) => [`package/${name}`, bytes]));
  for (const item of inventory.copiedSources) files.set(`package/${item.path.split('/design-system/')[1].replace(/^src\//, 'dist/').replace(/\.tsx?$/, '.js')}`, Buffer.from('Copyright (c) 2023 shadcn'));
  files.set('package/dist/product-patterns/product-nav-icon.js', Buffer.from('Copyright (c) Tailwind Labs, Inc.'));
  for (const font of inventory.fonts) for (const f of font.files) files.set(`package/${f.path}`, readFileSync(resolve(root, 'web/packages/design-system', f.path)));
  const assets = JSON.parse(readFileSync(resolve(root, 'ASSET_MANIFEST.json')));
  for (const asset of assets.assets.filter(item => item.packagePath)) files.set(`package/${asset.packagePath}`, readFileSync(resolve(root, asset.path)));
  return files;
}

test('release validation rejects stripped notices and changed original license text', () => {
  const files = archive();
  verifyPackageNotices('design-system', [...files.keys()], path => files.get(path));
  const removed = files.get('package/NOTICE');
  files.delete('package/NOTICE');
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Missing packed attribution/);
  files.set('package/NOTICE', removed);
  files.set('package/third-party/licenses/npm/_heroicons_react_2.2.0/LICENSE', Buffer.from('MIT, attribution omitted'));
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Altered packed attribution/);
});

test('release validation rejects missing compiled credits and changed font bytes', () => {
  const files = archive();
  const icon = files.get('package/dist/product-patterns/product-nav-icon.js');
  files.set('package/dist/product-patterns/product-nav-icon.js', Buffer.from('no attribution'));
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Missing emitted Heroicons/);
  files.set('package/dist/product-patterns/product-nav-icon.js', icon);
  const fontPath = `package/${inventory.fonts[0].files[0].path}`;
  files.set(fontPath, Buffer.from('changed font'));
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Missing\/changed packed font/);
});


test('release validation rejects changed licensed artwork and excluded brand assets', () => {
  const files = archive();
  const assets = JSON.parse(readFileSync(resolve(root, 'ASSET_MANIFEST.json')));
  const first = assets.assets.find(item => item.packagePath);
  const key = `package/${first.packagePath}`;
  const original = files.get(key);
  files.set(key, Buffer.from('unreviewed replacement'));
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Missing\/changed licensed artwork/);
  files.set(key, original);
  const removed = JSON.parse(readFileSync(resolve(root, 'docs/release/removed-assets.json')));
  files.set(`package/assets/${removed.removedPackagePaths[0]}`, Buffer.from('excluded logo'));
  assert.throws(() => verifyPackageNotices('design-system', [...files.keys()], path => files.get(path)), /Excluded release artwork/);
});
