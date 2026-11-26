import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyVersionLookup, registry, releaseTag, validatePackage } from './release-utils.mjs';

const packageFixture = () => ({ name: '@zooclaw/zooworkdesign', version: '2.1.0', publishConfig: { registry, access: 'public', provenance: false } });
test('only a 404 permits publication; auth and network errors stop the release', () => {
  assert.equal(classifyVersionLookup({ status: 1, stdout: '{"error":{"code":"E404"}}' }, 'test'), 'missing');
  for (const code of ['E401', 'E403', 'ECONNRESET', 'E500']) assert.throws(() => classifyVersionLookup({ status: 1, stdout: JSON.stringify({ error: { code } }) }, 'test'));
  assert.throws(() => classifyVersionLookup({ status: 1, stdout: '' }, 'test'));
});
test('partial release retries only skip an identical published artifact', () => {
  assert.equal(classifyVersionLookup({ status: 0, stdout: '{"dist":{"integrity":"sha512-abc"}}' }, 'sha512-abc'), 'identical');
  assert.throws(() => classifyVersionLookup({ status: 0, stdout: '{"dist":{"integrity":"sha512-old"}}' }, 'sha512-new'));
});
test('public access, portable dependencies, and prerelease chat versions are enforced', () => {
  validatePackage(packageFixture());
  assert.throws(() => validatePackage({ ...packageFixture(), private: true }));
  assert.throws(() => validatePackage({ ...packageFixture(), publishConfig: { registry, access: 'restricted', provenance: false } }));
  assert.throws(() => validatePackage({ ...packageFixture(), dependencies: { chat: 'workspace:*' } }));
  assert.throws(() => validatePackage({ ...packageFixture(), name: '@zooclaw/zooworkdesign-chat' }));
  validatePackage({ ...packageFixture(), name: '@zooclaw/zooworkdesign-chat', version: '0.1.0-alpha.0' });
  assert.equal(releaseTag('0.1.0-alpha.0'), 'next');
  assert.equal(releaseTag('2.1.0'), 'latest');
});
