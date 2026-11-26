import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const script = fileURLToPath(new URL('./check-changelog.mjs', import.meta.url));
const designLog = 'web/packages/design-system/CHANGELOG.md';
const chatLog = 'web/packages/chat-ui/CHANGELOG.md';
const previewLog = 'web/packages/design-system/src/changelog.ts';
const oldPreview = `export const CHANGELOG_ENTRIES = [{version:'2.1.0', date:'2026-10-14', changes:{fixed:['Old fix']}}];`;
const newPreview = `export const CHANGELOG_ENTRIES = [{version:'Unreleased', changes:{fixed:['Keep the menu open after a click']}}, {version:'2.1.0', date:'2026-10-14', changes:{fixed:['Old fix']}}];`;

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'ds-changelog-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const write = (path, content) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), content); };
  git('init', '-q');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'user.name', 'Changelog test');
  write(designLog, '# Changelog\n\n## Unreleased\n- Old fix\n');
  write(chatLog, '# Changelog\n\n## Unreleased\n- Old chat fix\n');
  write(previewLog, oldPreview);
  write('web/packages/design-system/package.json', JSON.stringify({ name: '@zooclaw/zooworkdesign', scripts: { build: 'build' }, dependencies: { clsx: '^2' } }));
  write('web/packages/design-system/src/menu.ts', 'export const menu = 1;');
  git('add', '.'); git('commit', '-qm', 'baseline');
  const base = git('rev-parse', 'HEAD');
  const commit = () => { git('add', '-A'); git('commit', '-qm', 'change'); return git('rev-parse', 'HEAD'); };
  const run = (args = ['--base', base], env = {}, cwd = root) => spawnSync(process.execPath, [script, ...args], {
    cwd, encoding: 'utf8', env: { ...process.env, GITHUB_ACTIONS: '', ...env },
  });
  return { root, git, write, base, commit, run };
}

test('runtime changes fail until both package and preview notes gain content', t => {
  const f = fixture(t);
  f.write('web/packages/design-system/src/menu.ts', 'export const menu = 2;');
  f.commit();
  let result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /design-system\/CHANGELOG.md/);
  assert.match(result.stderr, /src\/changelog.ts/);
  f.write(designLog, '# Changelog\n\n## Unreleased\n- Old fix\n- Keep the menu open after a click\n');
  f.write(previewLog, newPreview);
  f.commit();
  result = f.run(['--base', f.base], {}, join(f.root, 'web'));
  assert.equal(result.status, 0, result.stderr);
});

test('date, comments, metadata and whitespace edits do not pass as release notes', t => {
  const f = fixture(t);
  f.write('web/apps/preview/App.tsx', 'export default function App() { return null }');
  f.write(designLog, '# Changelog\n\n## Unreleased - 2026-10-19\n-   Old   fix\n<!-- - Added nothing -->\n');
  f.write(previewLog, `// New release\nexport const CHANGELOG_ENTRIES = [{version:'2.2.0', date:'2026-10-19', pr:{label:'PR #7'}, changes:{fixed:[' Old   fix ']}}];`);
  f.commit();
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /design-system\/CHANGELOG.md/);
  assert.match(result.stderr, /src\/changelog.ts/);
});

test('a chat change needs its own package notes, not only the foundation log', t => {
  const f = fixture(t);
  f.write('web/packages/chat-ui/styles.css', '.composer { padding: 20px }');
  f.write(designLog, '- New foundation note');
  f.write(previewLog, newPreview);
  f.commit();
  assert.match(f.run().stderr, /chat-ui\/CHANGELOG.md/);
  f.write(chatLog, '- New chat note');
  f.commit();
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
});

test('commented-out or unclosed-comment notes do not satisfy a package update', t => {
  const f = fixture(t);
  f.write('web/packages/design-system/src/menu.ts', 'export const menu = 2;');
  f.write(previewLog, newPreview);
  for (const comment of ['<!--\n- Keep the menu open after a click\n-->', '<!--\n- Keep the menu open after a click']) {
    f.write(designLog, '# Changelog\n- Old fix\n' + comment);
    f.commit();
    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /design-system\/CHANGELOG.md/);
  }
});

test('removing an inline comment does not turn an existing visible note into a new note', t => {
  for (const note of ['- Old fix <!-- internal detail -->', '- Old <!--\ninternal detail\n-->fix']) {
    const f = fixture(t);
    f.write(designLog, '# Changelog\n' + note + '\n');
    const base = f.commit();
    f.write('web/packages/design-system/src/menu.ts', 'export const menu = 2;');
    f.write(designLog, '# Changelog\n- Old fix\n');
    f.write(previewLog, newPreview);
    f.commit();
    const result = f.run(['--base', base]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /design-system\/CHANGELOG.md/);
  }
});

test('deleting or renaming runtime assets cannot bypass the guard', t => {
  const f = fixture(t);
  f.git('mv', 'web/packages/design-system/src/menu.ts', 'archived-menu.txt');
  f.commit();
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /design-system\/CHANGELOG.md/);
});

test('documentation, test and CI maintenance do not require invented product notes', t => {
  const f = fixture(t);
  for (const path of ['AGENTS.md', '.github/workflows/verify.yml', 'scripts/build.mjs', 'web/packages/chat-ui/README.md', 'web/packages/chat-ui/src/menu.test.ts', 'web/apps/preview/__tests__/fixture.tsx', 'web/apps/preview/vitest.setup.ts']) f.write(path, 'maintenance');
  f.write('web/packages/design-system/package.json', JSON.stringify({ name: '@zooclaw/zooworkdesign', scripts: { build: 'new build' }, dependencies: { clsx: '^2' }, devDependencies: { vitest: '^4' } }));
  f.commit();
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /not required/);
});

test('manifest runtime dependency updates require notes even without a source edit', t => {
  const f = fixture(t);
  f.write('web/packages/design-system/package.json', JSON.stringify({ name: '@zooclaw/zooworkdesign', dependencies: { clsx: '^3' } }));
  f.commit();
  assert.match(f.run().stderr, /design-system\/CHANGELOG.md/);
});

test('transitive runtime lock updates require notes but development-only lock changes do not', t => {
  const f = fixture(t);
  const lock = version => `lockfileVersion: '9.0'\nimporters:\n  packages/design-system:\n    dependencies:\n      ui: {specifier: ^1, version: 1.0.0}\n    devDependencies:\n      vitest: {specifier: ^4, version: 4.0.0}\npackages:\n  ui@1.0.0: {resolution: {integrity: ui-hash}}\n  helper@${version}: {resolution: {integrity: helper-hash}}\nsnapshots:\n  ui@1.0.0:\n    dependencies: {helper: ${version}}\n  helper@${version}: {}\n`;
  f.write('web/pnpm-lock.yaml', lock('1.0.0'));
  const base = f.commit();
  f.write('web/pnpm-lock.yaml', lock('1.0.0').replace('version: 4.0.0', 'version: 4.1.0'));
  f.commit();
  const devResult = f.run(['--base', base]);
  assert.equal(devResult.status, 0, devResult.stderr);
  f.write('web/pnpm-lock.yaml', lock('1.1.0'));
  f.commit();
  const result = f.run(['--base', base]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /design-system\/CHANGELOG.md/);
});

test('invalid preview data fails closed instead of counting arbitrary strings', t => {
  const f = fixture(t);
  f.write('web/packages/design-system/tokens.css', ':root { --gap: 20px }');
  f.write(designLog, '- A real new note');
  f.write(previewLog, 'export const CHANGELOG_ENTRIES = loadNotes("A new string outside changes");');
  f.commit();
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /literal array/);
});

test('PR checks use the actual head diff and main pushes use the event before SHA', t => {
  const f = fixture(t);
  f.write('web/packages/design-system/src/menu.ts', 'export const menu = 2;');
  const head = f.commit();
  const eventPath = join(f.root, 'event.json');
  writeFileSync(eventPath, JSON.stringify({ pull_request: { base: { sha: f.base }, head: { sha: head } } }));
  assert.match(f.run([], { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'pull_request', GITHUB_EVENT_PATH: eventPath }).stderr, /design-system\/CHANGELOG.md/);
  // Unrelated base-branch work must not be attributed to the PR author.
  f.git('checkout', '-qb', 'base-update', f.base);
  f.write('web/packages/chat-ui/styles.css', '.chat { color: red }'); f.commit();
  f.write(designLog, '- Keep the menu open after a click'); f.write(previewLog, newPreview);
  f.commit();
  const after = f.git('rev-parse', 'HEAD');
  f.git('checkout', '-qb', 'pr-notes', head);
  f.write(designLog, '- Keep the menu open after a click'); f.write(previewLog, newPreview);
  const prHead = f.commit();
  writeFileSync(eventPath, JSON.stringify({ pull_request: { base: { sha: after }, head: { sha: prHead } } }));
  const prResult = f.run([], { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'pull_request', GITHUB_EVENT_PATH: eventPath });
  assert.equal(prResult.status, 0, prResult.stderr);
  writeFileSync(eventPath, JSON.stringify({ before: f.base, after }));
  assert.match(f.run([], { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_EVENT_PATH: eventPath }).stderr, /chat-ui\/CHANGELOG.md/);
  writeFileSync(eventPath, JSON.stringify({ before: '0'.repeat(40), after }));
  assert.match(f.run([], { GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_EVENT_PATH: eventPath }).stderr, /invalid changelog comparison/);
});
