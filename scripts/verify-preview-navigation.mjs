import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectStatic } from './static-preview.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'web/apps/preview/dist');
inspectStatic(dist);
const require = createRequire(new URL('../web/package.json', import.meta.url));
const { chromium, expect } = require('@playwright/test');
const metadataPath = resolve(dist, 'preview-version.json');
const base = existsSync(metadataPath) ? JSON.parse(readFileSync(metadataPath, 'utf8')).basePath : '/';
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json', '.mp4': 'video/mp4' };
const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : '../outside';
  const file = resolve(dist, relative || 'index.html');
  if (!file.startsWith(`${dist}${sep}`) || !existsSync(file)) { response.writeHead(404); response.end(); return; }
  response.setHeader('Content-Type', types[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream');
  response.end(readFileSync(file));
});
let browser;
try {
  const externalUrl = process.argv[2];
  if (!externalUrl) await new Promise(done => server.listen(0, '127.0.0.1', done));
  const url = externalUrl ?? `http://127.0.0.1:${server.address().port}${base}`;
  browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Good ideas.');
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'The homepage must open at the top');
  await expect(page.getByRole('link', { name: 'View source on GitHub (opens in a new tab)' })).toHaveAttribute('href', 'https://github.com/SerendipityOneInc/ZooWorkDesign');
  await expect(page.getByRole('link', { name: 'ZooWorkDesign home' })).toBeVisible();
  const explore = page.getByRole('button', { name: 'Explore', exact: true });
  await explore.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: /React components The pieces/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(explore).toBeFocused();
  await expect(explore).toHaveAttribute('aria-expanded', 'false');
  const scene = page.getByRole('region', { name: 'Interactive component composition' });
  await scene.getByRole('radio', { name: 'Moss', exact: true }).check();
  await expect(scene).toHaveClass(/home-palette-moss/);
  assert.equal(await page.locator('.home-sculpture').evaluate(el => el.complete && el.naturalWidth > 0), true, 'Hero artwork must load under the Pages base path');
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).animationName), 'none', 'Reduced motion must disable hero entrance');
  const demo = page.getByRole('region', { name: 'Interactive agent demo' });
  await demo.getByRole('textbox', { name: 'Try the message composer' }).fill('Build a useful tool');
  await demo.getByRole('button', { name: 'Send message' }).click();
  await expect(demo.getByRole('log')).toContainText('Build a useful tool');
  await expect(demo.getByRole('log')).toContainText('this reply is a local demo');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Homepage must fit ${width}px`);
  }
  const mobileMenu = page.getByRole('button', { name: 'Navigation menu' });
  await mobileMenu.click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(mobileMenu).toBeFocused();
  await expect(mobileMenu).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('让好想法');
  await page.getByRole('button', { name: 'ZH — 简体中文。切换为英文。' }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(new URL('?view=components&lang=en', url).href, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'Opening the catalog without a hash must start at the top');
  await expect(page.locator('.pv-side a[href="#purpose"]')).toHaveAttribute('aria-current', 'location');
  assert.equal(await page.locator('.pv-side').evaluate(el => el.scrollTop), 0, 'The sidebar must also start at the top');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => window.scrollY), 0, 'Reloading the initial view must remain at the top');

  const creditLink = page.getByRole('link', { name: 'Credits & licenses' });
  const creditUrl = new URL(await creditLink.getAttribute('href'), url).href;
  const credits = await context.newPage();
  await credits.goto(creditUrl);
  await expect(credits.getByRole('heading', { name: 'Credits & licenses / 署名与许可' })).toBeVisible();
  const licenseUrl = new URL(await credits.getByRole('link', { name: 'Apache-2.0', exact: true }).getAttribute('href'), creditUrl).href;
  const licenseResponse = await context.request.get(licenseUrl);
  assert.equal(licenseResponse.status(), 200, 'Original license must be served by the same deployment');
  assert((await licenseResponse.text()).includes('Apache License'));
  await credits.setViewportSize({ width: 390, height: 844 });
  assert(await credits.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Long original copyright text must wrap within a mobile viewport');
  await credits.close();

  // The embedded example must remain usable after suppressing its mount-time scroll.
  const command = page.locator('#command');
  const input = command.getByRole('combobox');
  await input.click();
  await input.press('Home');
  await expect(command.getByRole('option', { name: /New agent/ })).toHaveAttribute('aria-selected', 'true');
  await input.press('ArrowDown');
  await expect(command.getByRole('option', { name: /Duplicate agent/ })).toHaveAttribute('aria-selected', 'true');
  await input.fill('Run workflow');
  await expect(command.getByRole('option', { name: /Run workflow/ })).toHaveAttribute('aria-selected', 'true');
  await expect(input).toBeFocused();
  await input.press('Enter');

  // A primary account card must not change its theme when shown in isolation.
  // Temporarily detach the real rendered node, then restore it before React updates.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const dark of [false, true]) {
      await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
      const styles = await page.locator('#product-navigation [data-testid="user-card-toggle"]').first().evaluate(async button => {
        const card = button.parentElement;
        const parent = card.parentElement;
        const next = card.nextSibling;
        const snapshot = () => {
          const surface = getComputedStyle(card), entry = getComputedStyle(button);
          return { background: surface.backgroundColor, radius: surface.borderRadius,
            border: surface.borderWidth, shadow: surface.boxShadow,
            fontSize: entry.fontSize, lineHeight: entry.lineHeight, entryRadius: entry.borderRadius };
        };
        await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
        const inside = snapshot();
        try {
          document.body.append(card);
          await new Promise(done => setTimeout(done, 350));
          return { inside, isolated: snapshot() };
        } finally { parent.insertBefore(card, next); }
      });
      assert.equal(styles.inside.background, 'rgba(0, 0, 0, 0)', 'Paper Focus account card uses the approved transparent surface');
      assert.deepEqual(styles.isolated, styles.inside, `Account styles must not depend on a side-nav ancestor (${width}px / ${dark ? 'dark' : 'light'})`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  // Long forms keep the action row visible while their body scrolls, including
  // short landscape viewports. Exercise the public component, not a CSS fixture.
  for (const viewport of [{ width: 1440, height: 760 }, { width: 375, height: 667 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    for (const dark of [false, true]) {
      await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
      const trigger = page.getByRole('button', { name: 'Open long form', exact: true });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: 'Long form', exact: true });
      await dialog.evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
      const body = dialog.locator('[data-slot="dialog-body"]');
      const geometry = () => dialog.evaluate(el => {
        const rect = child => { const r = child.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; };
        return { shell: rect(el), header: rect(el.querySelector('[data-slot="dialog-header"]')), footer: rect(el.querySelector('[data-slot="dialog-footer"]')), outerScroll: el.scrollTop };
      });
      const before = await geometry();
      await body.hover();
      await page.mouse.wheel(0, 3000);
      await expect.poll(() => body.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      await dialog.getByRole('textbox', { name: 'Field 12', exact: true }).fill('Last field is reachable');
      const after = await geometry();
      assert.deepEqual(after.header, before.header, 'Header must not move with the body');
      assert.deepEqual(after.footer, before.footer, 'Actions must not move with the body');
      assert.ok(after.footer.bottom <= after.shell.bottom, 'Actions must fit inside the dialog');
      assert.equal(after.outerScroll, 0, 'The dialog shell must not scroll');
      assert.equal(await body.evaluate(el => el.scrollWidth > el.clientWidth), false, 'Body must not overflow horizontally');
      await dialog.getByRole('textbox', { name: 'Field 12', exact: true }).press('Enter');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  // The public amount selector preserves edits and supports keyboard presets.
  const creditTrigger = page.getByRole('button', { name: 'Credit amount example', exact: true });
  await creditTrigger.click();
  const creditDialog = page.getByRole('dialog', { name: 'Add funds', exact: true });
  const amountInput = creditDialog.getByRole('textbox', { name: 'Enter amount', exact: true });
  await amountInput.fill('5.');
  await expect(amountInput).toHaveValue('5.');
  const five = creditDialog.getByRole('radio', { name: '$5.00', exact: true });
  await five.click();
  await expect(amountInput).toHaveValue('5');
  await five.press('ArrowRight');
  await expect(creditDialog.getByRole('radio', { name: '$20.00', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(amountInput).toHaveValue('20');
  await expect(creditDialog.getByRole('button', { name: 'Preview only' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(creditTrigger).toBeFocused();

  // Direct links must still reach their section instead of being forced back to the top.
  for (const id of ['splitter', 'chat-composer']) {
    const linked = await context.newPage();
    await linked.goto(`${url}#${id}`, { waitUntil: 'networkidle' });
    await linked.evaluate(() => document.fonts.ready);
    await expect(linked.locator(`.pv-side a[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
    const top = await linked.locator(`#${id}`).evaluate(el => el.getBoundingClientRect().top);
    assert.ok(top >= 50 && top <= 100, `Direct link #${id} must appear below the pinned header, got ${top}`);
    await linked.close();
  }

  // Verify the built overview through the same index and project base path as
  // the catalog. Embedded dialogs must neither steal the initial scroll nor
  // lose their language when the parent switches between Chinese and English.
  const overview = await context.newPage();
  overview.on('pageerror', error => errors.push(error.message));
  await overview.goto(new URL('?view=patterns&lang=zh', url).href, { waitUntil: 'networkidle' });
  await expect(overview.getByRole('heading', { level: 1 })).toContainText('组件组合示例');
  const amountFrame = overview.frameLocator('iframe').nth(1);
  await expect(amountFrame.getByRole('textbox', { name: '输入金额', exact: true })).toBeVisible();
  assert.equal(await overview.evaluate(() => scrollY), 0, 'Embedded dialogs must not scroll the overview on mount');
  assert.ok(await overview.locator('.review-brand img').evaluate(img => img.complete && img.naturalWidth > 0), 'Overview logo must follow the Pages base path');
  await overview.getByRole('button', { name: /English|英文/ }).click();
  await expect(overview.getByRole('heading', { level: 1 })).toContainText('Component patterns');
  const amount = amountFrame.getByRole('textbox', { name: 'Enter amount', exact: true });
  await overview.locator('iframe').nth(1).evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await amount.fill('5.');
  await expect(amount).toHaveValue('5.');
  await overview.setViewportSize({ width: 390, height: 844 });
  assert.equal(await overview.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Overview must fit a mobile viewport');
  await overview.close();
  assert.deepEqual(errors, [], 'Catalog interactions must not raise browser errors');
  console.log(`Preview navigation passed: bilingual/responsive homepage and live demo, catalog navigation, account isolation, dialog scroll/focus, credit amounts, direct links and composition examples (${url})`);
} finally {
  await browser?.close();
  if (server.listening) await new Promise(done => server.close(done));
}
