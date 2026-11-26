import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliveryVersions, validateDelivery, currentSource, assertCurrentSource, deliveryPlan, promotionTags, safeArchive, superseded } from './delivery-model.mjs';

const bases = { design: '2.2.0', chat: '0.1.0-alpha.1' };
const context = { event: 'pull_request', pullRequest: 7, runId: 123456, runNumber: 17, runAttempt: 1, headCommit: 'a'.repeat(40) };
const run = { id: 123456, workflow_id: 42, status: 'completed', conclusion: 'success', event: 'pull_request', head_sha: context.headCommit, head_branch: 'feature', head_repository: { full_name: 'owner/source' } };
const pr = { number: 7, state: 'open', head: { sha: context.headCommit, repo: { full_name: 'owner/source' } } };

test('PR deliveries use unique preview versions without moving stable channels', () => {
  assert.deepEqual(deliveryVersions(bases, context), { design: '2.2.0-pr.7.123456.1', chat: '0.1.0-alpha.1.pr.7.123456.1', designTag: 'preview', chatTag: 'preview' });
  assert.notEqual(deliveryVersions(bases, { ...context, runAttempt: 2 }).design, deliveryVersions(bases, context).design);
});
test('main versions advance with CI sequence and remain identical on a retry', () => {
  const main = { ...context, event: 'push', pullRequest: null };
  const versions = deliveryVersions(bases, main);
  assert.deepEqual(versions, { design: '2.2.17', chat: '0.1.0-alpha.18', designTag: 'latest', chatTag: 'next' });
  assert.deepEqual(deliveryVersions(bases, { ...main, runAttempt: 2 }), versions);
  assert.notEqual(deliveryVersions(bases, { ...main, runNumber: 18 }).design, versions.design);
});
test('version inputs reject unsupported channels and invalid numeric identifiers', () => {
  for (const patch of [{ runId: '1;echo unsafe' }, { runAttempt: 0 }, { pullRequest: null }, { event: 'pull_request_target' }]) {
    assert.throws(() => deliveryVersions(bases, { ...context, ...patch }));
  }
  assert.throws(() => deliveryVersions({ ...bases, chat: '0.1.0' }, context));
});
test('only successful current internal PRs and current main are publishable', () => {
  const args = { run, pr, workflowId: 42, repository: 'owner/source', mainSha: 'b'.repeat(40) };
  assert.equal(currentSource(args), true);
  for (const patch of [{ state: 'closed' }, { head: { ...pr.head, sha: 'c'.repeat(40) } }, { head: { ...pr.head, repo: { full_name: 'other/fork' } } }]) {
    assert.equal(currentSource({ ...args, pr: { ...pr, ...patch } }), false);
  }
  for (const patch of [{ conclusion: 'failure' }, { status: 'in_progress' }, { workflow_id: 999 }, { head_repository: { full_name: 'other/fork' } }]) {
    assert.equal(currentSource({ ...args, run: { ...run, ...patch } }), false);
  }
  assert.equal(currentSource({ ...args, run: { ...run, event: 'push', head_branch: 'main' }, mainSha: run.head_sha }), true);
  assert.equal(currentSource({ ...args, run: { ...run, event: 'push', head_branch: 'main' } }), false);
});
test('npm and webpage must match the verified run, attempt, source and version pair', () => {
  const delivery = { ...context, sourceCommit: 'b'.repeat(40), baseVersions: bases, versions: deliveryVersions(bases, context) };
  const source = { ...context, sourceCommit: delivery.sourceCommit };
  const packages = [
    { name: '@zooclaw/zooworkdesign', version: delivery.versions.design, tag: 'preview' },
    { name: '@zooclaw/zooworkdesign-chat', version: delivery.versions.chat, tag: 'preview' },
  ];
  const page = { version: packages[0].version, chatUiVersion: packages[1].version, sourceCommit: delivery.sourceCommit, delivery };
  validateDelivery({ delivery, source, packages, page });
  assert.throws(() => validateDelivery({ delivery, source: { ...source, runAttempt: 2 }, packages, page }));
  assert.throws(() => validateDelivery({ delivery, source: { ...source, headCommit: 'c'.repeat(40) }, packages, page }));
  assert.throws(() => validateDelivery({ delivery, source, packages, page: { ...page, version: '2.1.0' } }));
  assert.throws(() => validateDelivery({ delivery, source, packages: [{ ...packages[0], tag: 'latest' }, packages[1]], page }));
});
test('a late old build cannot replace a newer shared preview', () => {
  assert.equal(superseded({ runId: 200, runAttempt: 1 }, { runId: 100, runAttempt: 9 }), true);
  assert.equal(superseded({ runId: 200, runAttempt: 2 }, { runId: 200, runAttempt: 1 }), true);
  assert.equal(superseded({ runId: 100, runAttempt: 1 }, { runId: 200, runAttempt: 1 }), false);
});
test('newer PR previews do not prevent current main stable publication', () => {
  const previous = { runId: 200, runAttempt: 1 };
  const main = { ...context, event: 'push', pullRequest: null, runId: 100 };
  assert.deepEqual(deliveryPlan(previous, main), { publish: true, replacePreview: false });
  assert.deepEqual(promotionTags({ tag: 'latest' }, main, false), ['latest']);
  assert.deepEqual(promotionTags({ tag: 'next' }, main, false), ['next']);
  assert.deepEqual(deliveryPlan(previous, { ...context, runId: 100 }), { publish: false, replacePreview: false });
  assert.deepEqual(deliveryPlan(previous, { ...context, runId: 300 }), { publish: true, replacePreview: true });
  assert.deepEqual(promotionTags({ tag: 'preview' }, context, true), ['preview', 'pr-7']);
  assert.deepEqual(promotionTags({ tag: 'latest' }, main, true), ['latest', 'preview']);
});
test('promotion requires the same successful source run and attempt as the verified artifact', () => {
  const state = { run: { ...run, run_number: context.runNumber, run_attempt: 1 }, pr, workflowId: 42, repository: 'owner/source' };
  assertCurrentSource(state, context);
  assert.throws(() => assertCurrentSource({ ...state, run: { ...state.run, run_attempt: 2 } }, context));
  assert.throws(() => assertCurrentSource({ ...state, pr: { ...pr, state: 'closed' } }, context));
  assert.throws(() => assertCurrentSource({ ...state, pr: { ...pr, head: { ...pr.head, sha: 'c'.repeat(40) } } }, context));
});
test('package archives reject path traversal, credential files and links before publishing', () => {
  safeArchive(['package/package.json', 'package/dist/index.js'], ['-rw-r--r-- file', 'drwxr-xr-x directory']);
  for (const path of ['../outside', '/absolute', 'package/../../outside', 'package/.npmrc', 'package/.git/config']) assert.throws(() => safeArchive([path], []));
  assert.throws(() => safeArchive(['package/dist/link'], ['lrwxr-xr-x link']));
});
