import assert from 'node:assert/strict';

function positive(value) {
  assert.match(String(value), /^[1-9]\d*$/);
  assert.ok(Number.isSafeInteger(Number(value)));
  return Number(value);
}
export function deliveryVersions(bases, context) {
  const design = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(bases.design);
  const chat = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-alpha\.(0|[1-9]\d*)$/.exec(bases.chat);
  assert.ok(design && chat, 'Source versions must be stable design-system and alpha.N chat-ui');
  const id = positive(context.runId);
  const sequence = positive(context.runNumber);
  const attempt = positive(context.runAttempt);
  if (context.event === 'pull_request') {
    const suffix = `pr.${positive(context.pullRequest)}.${id}.${attempt}`;
    return { design: `${bases.design}-${suffix}`, chat: `${bases.chat}.${suffix}`, designTag: 'preview', chatTag: 'preview' };
  }
  assert.equal(context.event, 'push');
  assert.ok(!context.pullRequest);
  const patch = Number(design[3]) + sequence;
  const alpha = Number(chat[4]) + sequence;
  assert.ok(Number.isSafeInteger(patch) && Number.isSafeInteger(alpha));
  return { design: `${design[1]}.${design[2]}.${patch}`, chat: `${chat[1]}.${chat[2]}.${chat[3]}-alpha.${alpha}`, designTag: 'latest', chatTag: 'next' };
}

export function currentSource({ run, pr, workflowId, repository, mainSha }) {
  if (run.workflow_id !== workflowId || run.status !== 'completed' || run.conclusion !== 'success' || run.head_repository?.full_name !== repository) return false;
  if (run.event === 'push') return run.head_branch === 'main' && run.head_sha === mainSha;
  return run.event === 'pull_request' && pr?.state === 'open' && pr.head?.repo?.full_name === repository && pr.head.sha === run.head_sha;
}
export function assertCurrentSource(state, source) {
  assert.ok(currentSource(state), 'Source changed after verification');
  for (const [actual, expected] of [[state.run.id, source.runId], [state.run.run_number, source.runNumber], [state.run.run_attempt, source.runAttempt], [state.run.head_sha, source.headCommit]]) {
    assert.equal(actual, expected, 'Verified source run or attempt changed');
  }
}

export function validateDelivery({ delivery, source, packages, page }) {
  for (const key of ['event', 'pullRequest', 'runId', 'runNumber', 'runAttempt', 'headCommit']) assert.equal(delivery[key], source[key], `Wrong delivery ${key}`);
  assert.match(delivery.sourceCommit, /^[a-f0-9]{40}$/);
  if (source.event === 'push') assert.equal(delivery.sourceCommit, source.headCommit);
  const versions = deliveryVersions(delivery.baseVersions, source);
  assert.deepEqual(delivery.versions, versions);
  assert.deepEqual(packages.map(({ name, version, tag }) => ({ name, version, tag })), [
    { name: '@zooclaw/zooworkdesign', version: versions.design, tag: versions.designTag },
    { name: '@zooclaw/zooworkdesign-chat', version: versions.chat, tag: versions.chatTag },
  ]);
  assert.equal(page.version, versions.design);
  assert.equal(page.chatUiVersion, versions.chat);
  assert.equal(page.sourceCommit, delivery.sourceCommit);
  assert.deepEqual(page.delivery, delivery);
}

export function superseded(previous, next) {
  return Boolean(previous && (BigInt(previous.runId) > BigInt(next.runId) ||
    (String(previous.runId) === String(next.runId) && previous.runAttempt > next.runAttempt)));
}
export function deliveryPlan(previous, next) {
  const replacePreview = !superseded(previous, next);
  return { publish: replacePreview || next.event === 'push', replacePreview };
}
export function promotionTags(item, source, replacePreview) {
  return [...new Set([item.tag, ...(replacePreview ? ['preview', ...(source.pullRequest ? [`pr-${source.pullRequest}`] : [])] : [])])];
}
export function matchesLivePreview(page, { delivery, packages }) {
  return Boolean(page &&
    page.version === packages[0].version && page.chatUiVersion === packages[1].version &&
    page.sourceCommit === delivery.sourceCommit &&
    ['runId', 'runAttempt', 'headCommit', 'sourceCommit'].every(key => page.delivery?.[key] === delivery[key]) &&
    page.packages?.length === packages.length && packages.every((item, index) =>
      ['name', 'version', 'tag'].every(key => page.packages[index]?.[key] === item[key])));
}
export function safeArchive(paths, details) {
  for (const name of paths) {
    assert.ok(name.startsWith('package/') && !/[\x00-\x1f\\]/.test(name), 'Unsafe archive path');
    assert.ok(!name.split('/').some(part => part === '..' || (part.startsWith('.') && part !== '.')), 'Hidden/traversing package file');
  }
  assert.ok(details.every(line => /^[-d]/.test(line)), 'Archive links and special files are forbidden');
}
