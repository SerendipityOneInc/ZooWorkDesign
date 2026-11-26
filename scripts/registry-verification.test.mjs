import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyRegistryTag } from './registry-verification.mjs';

const item = { name: '@zooclaw/zooworkdesign-chat', version: '0.1.0-alpha.54' };
const options = { attempts: 3, intervalMs: 0, log: () => {} };

test('tag verification tolerates a stale read after a successful promotion', async () => {
  const observed = ['0.1.0-alpha.52', '0.1.0-alpha.52', '0.1.0-alpha.54'];
  await verifyRegistryTag(item, 'preview', {
    ...options,
    fetchImpl: async () => Response.json({ next: '0.1.0-alpha.54', preview: observed.shift() }),
  });
});

test('a tag that never reaches the verified version fails with actionable context', async () => {
  let calls = 0;
  await assert.rejects(verifyRegistryTag(item, 'preview', {
    ...options,
    fetchImpl: async () => {
      assert.ok(++calls <= 3, 'verification must stop within its read budget');
      return Response.json({ preview: '0.1.0-alpha.52' });
    },
  }), error => {
    assert.match(error.message, /@zooclaw\/zooworkdesign-chat/);
    assert.match(error.message, /preview/);
    assert.match(error.message, /0\.1\.0-alpha\.54/);
    assert.match(error.message, /0\.1\.0-alpha\.52/);
    return true;
  });
  assert.equal(calls, 3);
});

test('permission errors stop immediately without retrying or logging registry bodies', async () => {
  for (const status of [401, 403]) {
    let calls = 0;
    await assert.rejects(verifyRegistryTag(item, 'preview', {
      ...options,
      fetchImpl: async () => { calls++; return new Response('secret-response', { status }); },
    }), error => {
      assert.match(error.message, new RegExp(`HTTP ${status}`));
      assert.doesNotMatch(error.message, /secret-response/);
      return true;
    });
    assert.equal(calls, 1);
  }
});

test('successful tag reads request fresh metadata and stop without unnecessary polling', async () => {
  let calls = 0;
  await verifyRegistryTag(item, 'next', {
    ...options,
    fetchImpl: async (url, request) => {
      calls++;
      assert.equal(new URL(url).pathname, '/-/package/%40zooclaw%2Fzooworkdesign-chat/dist-tags');
      assert.equal(request.cache, 'no-store');
      assert.equal(request.headers['Cache-Control'], 'no-cache');
      assert.ok(request.signal instanceof AbortSignal);
      return Response.json({ next: '0.1.0-alpha.54' });
    },
  });
  assert.equal(calls, 1);
});
