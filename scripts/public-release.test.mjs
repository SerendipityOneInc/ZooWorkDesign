import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { registry, validatePackage } from './release-utils.mjs';
import { matchesLivePreview } from './delivery-model.mjs';

const manifest = (name = '@zooclaw/zooworkdesign', version = '3.0.0') => ({
  name, version, publishConfig: { registry, access: 'public', provenance: false },
});

test('public releases only accept the two newly approved package names', () => {
  validatePackage(manifest());
  validatePackage(manifest('@zooclaw/zooworkdesign-chat', '0.1.0-alpha.1'));
  for (const name of ['@zooclaw/design-system', '@zooclaw/chat-ui', '@other/zooworkdesign']) {
    assert.throws(() => validatePackage(manifest(name)));
  }
});

test('public release rejects restricted access, alternate registries and stable Chat', () => {
  assert.throws(() => validatePackage({ ...manifest(), publishConfig: { registry, access: 'restricted', provenance: false } }));
  assert.throws(() => validatePackage({ ...manifest(), publishConfig: { registry: 'https://example.com', access: 'public', provenance: false } }));
  assert.throws(() => validatePackage(manifest('@zooclaw/zooworkdesign-chat', '1.0.0')));
});

test('shipped license inventories identify their actual public package', () => {
  for (const folder of ['design-system', 'chat-ui']) {
    const directory = new URL(`../web/packages/${folder}/`, import.meta.url);
    const pkg = JSON.parse(readFileSync(new URL('package.json', directory), 'utf8'));
    const inventory = JSON.parse(readFileSync(new URL('third-party/inventory.json', directory), 'utf8'));
    assert.equal(inventory.packageName, pkg.name);
  }
});

test('promotion requires live Pages to match both public packages and the verified source', () => {
  const packages = [
    { name: '@zooclaw/zooworkdesign', version: '3.0.1', tag: 'latest' },
    { name: '@zooclaw/zooworkdesign-chat', version: '0.1.0-alpha.2', tag: 'next' },
  ];
  const delivery = { runId: 123, runAttempt: 1, headCommit: 'a'.repeat(40), sourceCommit: 'b'.repeat(40) };
  const page = { version: packages[0].version, chatUiVersion: packages[1].version, sourceCommit: delivery.sourceCommit, delivery, packages };
  assert.equal(matchesLivePreview(page, { delivery, packages }), true);
  for (const mutation of [
    { delivery: { ...delivery, runId: 124 } },
    { delivery: { ...delivery, runAttempt: 2 } },
    { delivery: { ...delivery, headCommit: 'c'.repeat(40) } },
    { sourceCommit: 'c'.repeat(40) },
    { version: '3.0.0' },
    { chatUiVersion: '0.1.0-alpha.1' },
    { packages: [] },
    { packages: [{ ...packages[0], name: '@zooclaw/design-system' }, packages[1]] },
  ]) assert.equal(matchesLivePreview({ ...page, ...mutation }, { delivery, packages }), false);
  assert.equal(matchesLivePreview(null, { delivery, packages }), false);
});
