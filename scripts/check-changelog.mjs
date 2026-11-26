import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../web/package.json', import.meta.url));
const ts = require('typescript');
const { parse: parseYaml } = require('yaml');
const previewLog = 'web/packages/design-system/src/changelog.ts';
const packageLog = name => `web/packages/${name}/CHANGELOG.md`;
const normalize = value => value.replace(/\s+/gu, ' ').trim();
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b))) : item);

function revision(ref) {
  if (!ref || ref.startsWith('-') || /^0+$/.test(ref)) throw new Error('Missing or invalid changelog comparison base/head');
  return git('rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`);
}

function comparison() {
  const args = process.argv.slice(2);
  const options = {};
  while (args.length) {
    const flag = args.shift();
    if (!['--base', '--head'].includes(flag) || !args.length) throw new Error('Usage: pnpm check:changelog --base <ref> [--head <ref>]');
    options[flag.slice(2)] = args.shift();
  }
  let { base, head } = options;
  let isPr = false;
  if (!base && process.env.GITHUB_ACTIONS === 'true') {
    const payload = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
      base = payload.pull_request?.base?.sha;
      head ??= payload.pull_request?.head?.sha;
      isPr = true;
    } else if (process.env.GITHUB_EVENT_NAME === 'push') {
      base = payload.before;
      head ??= payload.after;
    } else throw new Error('Pass --base explicitly for this workflow event');
    if (!base || !head) throw new Error('Missing changelog comparison base/head in GitHub event');
  }
  base = revision(base ?? 'origin/main');
  head = revision(head ?? 'HEAD');
  // Local branch checks and PRs exclude unrelated updates on the target branch.
  if (isPr || process.env.GITHUB_ACTIONS !== 'true') base = git('merge-base', base, head);
  return { base, head };
}

function runtimeOwner(path, base, head) {
  if (/\.(?:md|mdx)$/i.test(path) || /(?:^|\/)(?:__tests__|__mocks__|fixtures|node_modules|dist)\//.test(path) || /\.(?:test|spec)\.[^/]+$/.test(path) || /(?:^|\/)(?:vitest|test)[.-]setup\.[^/]+$/.test(path)) return null;
  if (path === previewLog) return null;
  if (/^web\/(?:packages\/(?:design-system|chat-ui)|apps\/preview)\/package\.json$/.test(path)) {
    const contract = ref => {
      const source = readAt(ref, path);
      const manifest = source ? JSON.parse(source) : {};
      return Object.fromEntries(['name', 'version', 'type', 'main', 'types', 'exports', 'files', 'sideEffects', 'dependencies', 'optionalDependencies', 'peerDependencies', 'peerDependenciesMeta', 'publishConfig'].filter(key => key in manifest).map(key => [key, manifest[key]]));
    };
    if (stable(contract(base)) === stable(contract(head))) return null;
  }
  if (/^web\/apps\/preview\//.test(path) && !/(?:^|\/)[^/]*config\.[^/]+$/.test(path)) return 'preview';
  const match = path.match(/^web\/packages\/(design-system|chat-ui)\/(.+)$/);
  if (match && (/^(?:src|assets)\//.test(match[2]) || /^(?:[^/]+\.css|package\.json)$/.test(match[2]))) return match[1];
  return null;
}

function readAt(ref, path) {
  return git('ls-tree', '-r', '--name-only', ref, '--', path) ? git('show', `${ref}:${path}`) : '';
}

// Traverse only installed runtime graphs; a dev-tool lock refresh needs no product note.
function runtimeLockGraphs(source) {
  const lock = source ? parseYaml(source) : {};
  if (source && String(lock?.lockfileVersion) !== '9.0') throw new Error('Expected pnpm lockfile version 9.0');
  return Object.fromEntries([['design-system', 'packages/design-system'], ['chat-ui', 'packages/chat-ui'], ['preview', 'apps/preview']].map(([owner, importer]) => {
    const entry = lock.importers?.[importer] ?? {};
    const roots = { ...entry.dependencies, ...entry.optionalDependencies };
    const nodes = {};
    function visit(name, ref) {
      const version = typeof ref === 'string' ? ref : ref.version;
      if (version.startsWith('link:')) return;
      const key = `${name}@${version}`;
      if (Object.hasOwn(nodes, key)) return;
      const snapshot = lock.snapshots?.[key] ?? lock.snapshots?.[version] ?? {};
      nodes[key] = { resolution: lock.packages?.[key.split('(')[0]]?.resolution, ...snapshot };
      for (const [child, value] of Object.entries({ ...snapshot.dependencies, ...snapshot.optionalDependencies })) visit(child, value);
    }
    for (const [name, ref] of Object.entries(roots)) visit(name, ref);
    return [owner, { roots, nodes }];
  }));
}

function markdownNotes(source) {
  // Read original spans rather than applying a sanitizing replacement. Join
  // before splitting lines so multiline inline comments preserve note identity.
  const comments = [...source.matchAll(/<!--[\s\S]*?(?:-->|$)/g)].map(match => [match.index, match.index + match[0].length]);
  const visible = [];
  let cursor = 0;
  for (const [from, to] of comments) {
    visible.push(source.slice(cursor, from));
    cursor = to;
  }
  visible.push(source.slice(cursor));
  return visible.join('').split('\n')
    .flatMap(line => /^\s*[-*+]\s+(.+)$/.exec(line)?.[1] ?? [])
    .map(normalize).filter(note => note.replace(/\s/g, '').length >= 4);
}

function previewNotes(source) {
  if (!source) return [];
  const file = ts.createSourceFile('changelog.ts', source, ts.ScriptTarget.Latest, true);
  if (file.parseDiagnostics.length) throw new Error('Invalid preview changelog TypeScript');
  let entries;
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(item => ts.isIdentifier(item.name) && item.name.text === 'CHANGELOG_ENTRIES');
      if (declaration) entries = declaration.initializer;
    }
  }
  if (!entries || !ts.isArrayLiteralExpression(entries)) throw new Error('CHANGELOG_ENTRIES must be a literal array');
  const property = (object, name) => object.properties.find(item => ts.isPropertyAssignment(item) && item.name?.text === name)?.initializer;
  const notes = [];
  for (const entry of entries.elements) {
    if (!ts.isObjectLiteralExpression(entry)) throw new Error('Changelog entries must be literal objects');
    const changes = property(entry, 'changes');
    if (!changes || !ts.isObjectLiteralExpression(changes)) throw new Error('Changelog changes must be a literal object');
    for (const category of ['added', 'changed', 'removed', 'fixed', 'deprecated']) {
      const values = property(changes, category);
      if (!values) continue;
      if (!ts.isArrayLiteralExpression(values) || values.elements.some(value => !ts.isStringLiteralLike(value))) throw new Error('Changelog notes must be literal strings');
      notes.push(...values.elements.map(value => normalize(value.text)).filter(note => note.replace(/\s/g, '').length >= 4));
    }
  }
  return notes;
}

try {
  const { base, head } = comparison();
  const paths = git('diff', '--no-renames', '--name-only', '-z', base, head, '--').split('\0').filter(Boolean);
  const owners = new Set(paths.map(path => runtimeOwner(path, base, head)).filter(Boolean));
  if (paths.some(path => ['web/pnpm-lock.yaml', 'web/package.json'].includes(path))) {
    const before = runtimeLockGraphs(readAt(base, 'web/pnpm-lock.yaml'));
    const after = runtimeLockGraphs(readAt(head, 'web/pnpm-lock.yaml'));
    for (const owner of Object.keys(before)) if (stable(before[owner]) !== stable(after[owner])) owners.add(owner);
  }
  if (!owners.size) {
    console.log('Changelog not required: documentation, tests or tooling only. Explain N/A in the PR.');
  } else {
    const required = new Map([[previewLog, previewNotes]]);
    if (owners.has('design-system') || owners.has('preview')) required.set(packageLog('design-system'), markdownNotes);
    if (owners.has('chat-ui')) required.set(packageLog('chat-ui'), markdownNotes);
    const missing = [];
    for (const [path, parse] of required) {
      const before = new Set(parse(readAt(base, path)));
      if (!parse(readAt(head, path)).some(note => !before.has(note))) missing.push(path);
    }
    if (missing.length) throw new Error(`Add corresponding user-facing notes in this same PR:\n${missing.map(path => `- ${path}`).join('\n')}\nDate, metadata, comment or whitespace edits do not count. Add both preview languages and review accuracy.`);
    console.log(`Changelog checked for ${[...owners].join(', ')}. Review note accuracy and both preview languages.`);
  }
} catch (error) {
  console.error(`Changelog check failed: ${error.message}`);
  process.exitCode = 1;
}
