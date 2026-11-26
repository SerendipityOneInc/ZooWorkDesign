import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { currentSource, assertCurrentSource, deliveryPlan, promotionTags, matchesLivePreview, safeArchive, validateDelivery } from './delivery-model.mjs';
import { integrity, registry, validatePackage } from './release-utils.mjs';
import { inspectStatic } from './static-preview.mjs';
import { verifyRegistryTag } from './registry-verification.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const repository = 'SerendipityOneInc/ZooWorkDesign';
const site = 'https://serendipityoneinc.github.io/ZooWorkDesign/';
const privateDir = resolve(root, '.delivery');
const artifacts = resolve(root, 'artifacts');
const preview = resolve(root, 'preview-output');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');

async function github(path, token = process.env.GH_TOKEN, body) {
  assert.ok(token, 'GitHub authentication is missing');
  const response = await fetch(`https://api.github.com/${path}`, {
    method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error(`GitHub ${path.split('?')[0]}: HTTP ${response.status}`);
  return response.json();
}
async function sourceState(id) {
  const run = await github(`repos/${repository}/actions/runs/${id}`);
  const workflow = await github(`repos/${repository}/actions/workflows/verify.yml`);
  let pr = null;
  if (run.event === 'pull_request') {
    const candidates = run.pull_requests?.length ? run.pull_requests : await github(`repos/${repository}/commits/${run.head_sha}/pulls`);
    const number = candidates.find(candidate => candidate.head?.repo?.full_name === repository || candidate.head?.repo?.id === run.head_repository?.id)?.number;
    if (number) pr = await github(`repos/${repository}/pulls/${number}`);
  }
  const main = await github(`repos/${repository}/git/ref/heads/main`);
  return { run, pr, workflowId: workflow.id, repository, mainSha: main.object.sha };
}
async function status(source, state, description) {
  await github(`repos/${repository}/statuses/${source.headCommit}`, process.env.GH_TOKEN, {
    state, context: 'Delivery / npm + preview', description: description.slice(0, 140),
    target_url: `https://github.com/${repository}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  });
}
async function resolveSource() {
  assert.match(process.env.DELIVERY_RUN_ID ?? '', /^[1-9]\d*$/);
  const state = await sourceState(process.env.DELIVERY_RUN_ID);
  const eligible = currentSource(state);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `eligible=${eligible}\nrun_id=${state.run.id}\n`);
  if (!eligible) { console.log('Skipping failed, foreign, closed or superseded source run.'); return; }
  const { run, pr } = state;
  const source = { event: run.event, pullRequest: pr?.number ?? null, runId: run.id, runNumber: run.run_number, runAttempt: run.run_attempt, headCommit: run.head_sha };
  mkdirSync(privateDir, { recursive: true });
  writeJson(resolve(privateDir, 'source.json'), source);
  if (process.env.DELIVERY_EXECUTE === 'true') await status(source, 'pending', 'Checking versioned packages and fixed preview delivery');
}
function inspectArtifacts() {
  const source = readJson(resolve(privateDir, 'source.json'));
  const delivery = readJson(resolve(artifacts, 'delivery.json'));
  const { packages } = readJson(resolve(artifacts, 'release.json'));
  assert.equal(packages.length, 2);
  const page = readJson(resolve(preview, 'preview-version.json'));
  validateDelivery({ source, delivery, packages, page });
  assert.equal(page.site, site);
  assert.equal(page.basePath, '/ZooWorkDesign/');
  assert.ok(existsSync(resolve(preview, 'index.html')) && existsSync(resolve(preview, '.nojekyll')));
  inspectStatic(preview, true);
  for (const item of packages) {
    assert.equal(basename(item.file), item.file);
    assert.equal(item.file, `${item.name.replace('@', '').replace('/', '-')}-${item.version}.tgz`);
    const file = resolve(artifacts, item.file);
    assert.equal(integrity(readFileSync(file)), item.integrity);
    const tar = args => execFileSync('tar', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim().split('\n');
    safeArchive(tar(['-tzf', file]), tar(['-tvzf', file]));
    const pkg = JSON.parse(execFileSync('tar', ['-xOf', file, 'package/package.json'], { encoding: 'utf8', maxBuffer: 1024 * 1024 }));
    validatePackage(pkg);
    assert.equal(pkg.name, item.name);
    assert.equal(pkg.version, item.version);
    if (pkg.name === '@zooclaw/zooworkdesign-chat') assert.equal(pkg.dependencies['@zooclaw/zooworkdesign'], packages[0].version);
  }
  return { source, delivery, packages, page };
}
async function checkProvenance({ source, delivery }) {
  assertCurrentSource(await sourceState(source.runId), source);
  const commit = await github(`repos/${repository}/git/commits/${delivery.sourceCommit}`);
  assert.ok(commit.sha === source.headCommit || commit.parents.some(parent => parent.sha === source.headCommit), 'Build is not the verified PR head or merge preview');
  for (const [folder, key] of [['design-system', 'design'], ['chat-ui', 'chat']]) {
    const file = await github(`repos/${repository}/contents/web/packages/${folder}/package.json?ref=${delivery.sourceCommit}`);
    const pkg = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    assert.equal(pkg.version, delivery.baseVersions[key], 'Base version differs from verified source');
  }
}
async function registryPackage(item) {
  const response = await fetch(`${registry}/${encodeURIComponent(item.name)}/${encodeURIComponent(item.version)}`, { cache: 'no-store' });
  assert.ok(response.ok, `Published package lookup failed: ${item.name} HTTP ${response.status}`);
  const pkg = await response.json();
  assert.equal(pkg.dist.integrity, item.integrity, `Registry content differs: ${item.name}`);
}
// Both phases run trusted default-branch code. Downloaded source artifacts are data only.
async function stage(bundle) {
  const { source, delivery, packages, page } = bundle;
  await checkProvenance(bundle);
  assert.ok(process.env.NODE_AUTH_TOKEN, 'Configure NPM_TOKEN for the two public packages before publishing');
  const pages = await github(`repos/${repository}/pages`);
  assert.equal(new URL(pages.html_url).href, site);
  assert.equal(pages.build_type, 'workflow', 'Enable GitHub Pages with GitHub Actions as its source');
  const response = await fetch(`${site}preview-version.json?plan=${source.runId}`, { cache: 'no-store' });
  assert.ok(response.ok || response.status === 404, `Cannot inspect current public preview: HTTP ${response.status}`);
  const previous = response.ok ? await response.json() : {};
  const plan = deliveryPlan(previous.delivery, delivery);
  assert.ok(plan.publish, 'A newer preview has already been published; refusing rollback');
  writeJson(resolve(privateDir, 'plan.json'), { ...plan, previous: previous.delivery ?? null });
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `replace_preview=${plan.replacePreview}\n`);
  execFileSync('pnpm', ['whoami', '--registry', registry], { cwd: resolve(root, 'web'), stdio: 'pipe' });
  execFileSync(process.execPath, [resolve(root, 'scripts/publish-release.mjs'), '--execute', `--staging-tag=delivery-${source.runId}-${source.runAttempt}`], { cwd: root, stdio: 'inherit' });
  // Anonymous reads prove these are public packages, not merely readable with our token.
  for (const item of packages) await registryPackage(item);
  assertCurrentSource(await sourceState(source.runId), source);
  writeJson(resolve(preview, 'preview-version.json'), { ...page, packages: packages.map(({ name, version, tag }) => ({ name, version, tag })) });
  console.log('Public package staging verified; channels await matching Pages deployment.');
}

async function finalize(bundle) {
  const { source, delivery, packages } = bundle;
  await checkProvenance(bundle);
  const { replacePreview } = readJson(resolve(privateDir, 'plan.json'));
  if (replacePreview) {
    let matched = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      const response = await fetch(`${site}preview-version.json?delivery=${source.runId}-${source.runAttempt}-${attempt}`, { cache: 'no-store' });
      if (response.ok) {
        let live;
        try { live = await response.json(); } catch { /* Deployment propagation may serve a transient response. */ }
        if (matchesLivePreview(live, bundle)) { matched = true; break; }
      }
      if (attempt < 39) await new Promise(resolve => setTimeout(resolve, 15000));
    }
    assert.ok(matched, 'Pages did not serve the verified public package pair within 10 minutes');
    assert.ok((await fetch(site, { cache: 'no-store' })).ok, 'Public preview index is unavailable');
  }
  assertCurrentSource(await sourceState(source.runId), source);
  for (const item of packages) {
    for (const tag of promotionTags(item, source, replacePreview)) {
      execFileSync('pnpm', ['exec', 'npm', 'dist-tag', 'add', `${item.name}@${item.version}`, tag, '--registry', registry], { cwd: resolve(root, 'web'), stdio: 'inherit' });
      await verifyRegistryTag(item, tag);
    }
    await registryPackage(item);
  }
  assertCurrentSource(await sourceState(source.runId), source);
  const result = replacePreview ? 'Public npm + preview ready' : 'Stable channels ready; newer PR preview preserved';
  const summary = `${result}\n\nPublished ${packages.map(item => `${item.name}@${item.version} (${item.tag})`).join(', ')}\n\nPreview: ${site}\nSource: ${delivery.sourceCommit}\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  await status(source, 'success', `${result}: ${packages.map(item => item.version).join(' / ')}`);
}

let bundle;
try {
  const command = process.argv[2];
  if (command === 'resolve') await resolveSource();
  else {
    assert.ok(['validate', 'stage', 'finalize', 'failure'].includes(command));
    if (command === 'failure') {
      if (existsSync(resolve(privateDir, 'source.json'))) await status(readJson(resolve(privateDir, 'source.json')), 'failure', 'Delivery failed; inspect the workflow before retrying');
    } else {
      bundle = inspectArtifacts();
      await checkProvenance(bundle);
      console.log(`Verified delivery ${bundle.source.runId}: ${bundle.packages.map(item => item.version).join(', ')}`);
      if (command === 'stage') await stage(bundle);
      if (command === 'finalize') await finalize(bundle);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
