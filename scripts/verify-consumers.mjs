import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'zoowork-consumer-'));
const cwd = resolve(temp, 'web');
cpSync(resolve(root, 'web/fixtures/consumer'), cwd, { recursive: true });
const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
const { packages } = JSON.parse(readFileSync(resolve(root, 'artifacts/release.json'), 'utf8'));
for (const item of packages) {
  const target = join(temp, item.file);
  cpSync(resolve(root, 'artifacts', item.file), target);
  pkg.dependencies[item.name] = `file:../${item.file}`;
}
pkg.pnpm = { overrides: { '@zooclaw/zooworkdesign': pkg.dependencies['@zooclaw/zooworkdesign'] }, onlyBuiltDependencies: ['esbuild', '@tailwindcss/oxide', 'sharp'] };
writeFileSync(join(cwd, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
// This deliberately independent install checks real published dependency ranges.
// The repository install is frozen; this disposable consumer has no workspace aliases.
const run = args => execFileSync('pnpm', args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
console.log(`Standalone package consumer: ${cwd}`);
run(['install', '--ignore-workspace', '--config.minimumReleaseAge=10080']);
run(['exec', 'tsc', '--noEmit']);
run(['exec', 'vite', 'build']);
run(['exec', 'next', 'build']);
const html = readFileSync(join(cwd, '.next/server/app/index.html'), 'utf8');
assert.match(html, /Server-rendered button/);
assert.match(html, /SSR/);
assert.doesNotMatch(html, /file:\/\//);
const installedRequire = createRequire(join(cwd, 'package.json'));
const installed = installedRequire.resolve('@zooclaw/zooworkdesign');
assert.ok(installed.startsWith(realpathSync(temp) + '/'), 'Consumer must not resolve to workspace source');
const client = readFileSync(join(installed, '..', 'components', 'tabs.js'), 'utf8');
assert.match(client, /^['"]use client['"]/);
const builtCss = readdirSync(join(cwd, 'dist/assets')).filter(name => name.endsWith('.css')).map(name => readFileSync(join(cwd, 'dist/assets', name), 'utf8')).join('\n');
assert.match(builtCss, /shimmer-claw-sweep/);
assert.match(builtCss, /--brand-composer-radius/);

const require = createRequire(resolve(root, 'web/package.json'));
const { chromium } = require('@playwright/test');
const { preview } = await import(pathToFileURL(installedRequire.resolve('vite')).href);
const server = await preview({ root: cwd, configFile: false, preview: { host: '127.0.0.1', port: 0 } });
const address = server.httpServer.address();
let browser;
try {
  browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${address.port}`);
  await page.getByTestId('counter').click();
  await page.getByText('Count 1', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Settings', exact: true }).click();
  await page.getByText('Settings panel', { exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'Message', exact: true }).fill('Packed chat works');
  await page.getByRole('textbox', { name: 'Message', exact: true }).press('Enter');
  await page.getByRole('status').filter({ hasText: 'Packed chat works' }).waitFor();
  assert.ok(await page.getByAltText('ZooWork', { exact: true }).evaluate(image => image.complete && image.naturalWidth > 0));
  const style = await page.getByTestId('counter').evaluate(button => ({ display: getComputedStyle(button).display, background: getComputedStyle(button).backgroundColor, height: button.getBoundingClientRect().height }));
  assert.equal(style.display, 'inline-flex', 'Tailwind must scan the installed package');
  assert.notEqual(style.background, 'rgba(0, 0, 0, 0)');
  assert.ok(style.height >= 28);
  const examples = page.getByRole('region', { name: 'Component documentation examples', exact: true });
  assert.equal(await examples.getByRole('heading', { level: 2 }).count(), 20);
  await examples.getByRole('button', { name: 'Save example', exact: true }).click();
  await examples.getByRole('button', { name: 'Saved example', exact: true }).waitFor();
  await examples.getByRole('textbox', { name: 'Project name', exact: true }).fill('ab');
  assert.equal(await examples.getByRole('textbox', { name: 'Project name', exact: true }).getAttribute('aria-invalid'), 'true');
  await examples.getByRole('checkbox', { name: 'Receive updates', exact: true }).press('Space');
  assert.equal(await examples.getByRole('checkbox', { name: 'Receive updates', exact: true }).getAttribute('aria-checked'), 'true');
  await examples.getByRole('combobox', { name: 'Project role', exact: true }).click();
  await page.getByRole('option', { name: 'Editor', exact: true }).click();
  await examples.getByRole('combobox', { name: 'Project role', exact: true }).filter({ hasText: 'Editor' }).waitFor();
  await examples.getByRole('button', { name: 'Edit example project', exact: true }).click();
  await page.getByRole('dialog', { name: 'Edit project', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog', { name: 'Edit project', exact: true }).waitFor({ state: 'hidden' });
  assert.ok(await examples.getByRole('button', { name: 'Edit example project', exact: true }).evaluate(node => document.activeElement === node));
  await examples.getByRole('button', { name: 'Example actions', exact: true }).press('ArrowDown');
  await page.getByRole('menuitem', { name: 'Duplicate example', exact: true }).press('Enter');
  await examples.getByText('Example duplicated', { exact: true }).waitFor();
  await examples.getByRole('tab', { name: 'API', exact: true }).click();
  await examples.getByText('API guidance', { exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log('Packed consumer passed: 20 documentation examples, Vite interaction, keyboard/focus, CSS/assets, type declarations, Next.js SSR/client boundaries.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
// Kept outside the repo to make failed consumer builds inspectable; never committed.
assert.ok(existsSync(installed));
