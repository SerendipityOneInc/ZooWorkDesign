import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../web/package.json', import.meta.url));
const previewRequire = createRequire(new URL('../web/apps/preview/package.json', import.meta.url));
const { chromium, expect } = require('@playwright/test');
const { createServer } = await import(previewRequire.resolve('vite'));
const server = await createServer({ root: resolve(root, 'web/apps/preview'), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser;
const failures = [];
let checks = 0;
function check(name, fn) { checks++; try { fn(); } catch (error) { failures.push(`${name}: ${error.message}`); } }
async function checkAsync(name, fn) { checks++; try { await fn(); } catch (error) { failures.push(`${name}: ${error.message}`); } }
const rgba = value => value.match(/[\d.]+/g).map(Number);
const luminance = color => color.slice(0, 3).map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
function contrast(fg, bg, canvas) {
  const foreground = rgba(fg), background = rgba(bg), backdrop = rgba(canvas);
  const blend = (a, b) => a.slice(0, 3).map((c, i) => c * (a[3] ?? 1) + b[i] * (1 - (a[3] ?? 1)));
  const opaqueBg = blend(background, backdrop), opaqueFg = blend(foreground, opaqueBg);
  const [a, b] = [luminance(opaqueFg), luminance(opaqueBg)].sort((x, y) => y - x);
  return (a + .05) / (b + .05);
}
try {
  await server.listen();
  browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 }, reducedMotion: 'reduce' });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/test-fixtures/theme-tokens.html`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
  await expect(page.locator('#assistant')).toContainText('A readable assistant reply.');
  for (const brand of ['base', 'paper-focus']) {
    for (const dark of [false, true]) {
      await page.evaluate(({ brand, dark }) => {
        document.documentElement.classList.toggle('dark', dark);
        if (brand === 'base') delete document.documentElement.dataset.brandTheme;
        else document.documentElement.dataset.brandTheme = brand;
      }, { brand, dark });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const label = `${brand}/${dark ? 'dark' : 'light'}`;
      const styles = await page.evaluate(() => {
        // Chromium can serialize Paper Focus colors as color(srgb ...), not rgb(...).
        const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
        const color = value => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = value;
          context.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
          return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        };
        const style = selector => { const s = getComputedStyle(document.querySelector(selector)); return { color: color(s.color), bg: color(s.backgroundColor), border: color(s.borderColor) }; };
        return { canvas: color(getComputedStyle(document.body).backgroundColor),
          assistant: style('#assistant article > div > div:nth-child(2)'), user: style('#user article > div > div:nth-child(2)'),
          effort: style('#effort [role="status"]'), baseEffort: style('#base-effort [role="status"]'),
          tooltip: style('#tooltip .whitespace-nowrap'), dot: style('#connector span.size-2'),
          pill: style('#landing > [data-slot="starter-category"]'), prompt: style('#landing [data-slot="starter-prompt"]') };
      });
      for (const target of ['assistant', 'user', 'effort', 'baseEffort', 'tooltip']) {
        const s = styles[target], ratio = contrast(s.color, s.bg, styles.canvas);
        check(`${label} ${target} readable text`, () => assert.ok(ratio >= 4.5, `contrast ${ratio.toFixed(2)} < 4.5 (${s.color} on ${s.bg}, canvas ${styles.canvas})`));
      }
      check(`${label} connected dot visible`, () => assert.ok((rgba(styles.dot.bg)[3] ?? 1) > .9, styles.dot.bg));
      check(`${label} category has its own border color`, () => assert.notEqual(styles.pill.border, styles.pill.color));
      check(`${label} selected prompt has a background`, () => assert.ok((rgba(styles.prompt.bg)[3] ?? 1) > 0, styles.prompt.bg));
      const pill = page.locator('#landing > [data-slot="starter-category"]');
      const idlePillBackground = await pill.evaluate(el => getComputedStyle(el).backgroundColor);
      await pill.hover();
      await checkAsync(`${label} category hover changes background`, () => expect.poll(() => pill.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(idlePillBackground));
      await page.mouse.move(890, 1);
      await checkAsync(`${label} category hover resets`, () => expect.poll(() => pill.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(idlePillBackground));
      const landingTokens = await page.locator('#landing').evaluate(el => {
        const s = getComputedStyle(el);
        return Object.fromEntries(['glass-border','glass-hover','border-prompt','border-prompt-hover','selected-bg','selected-border','template-selected-border','card-glass','text-agent','text-tertiary','shadow-agent-avatar','shadow-template-card','shadow-template-selected','shadow-dropdown'].map(name => [name, s.getPropertyValue('--landing-' + name).trim()]));
      });
      check(`${label} starter token contract`, () => assert.deepEqual(Object.entries(landingTokens).filter(([, value]) => !value), []));
      if (process.env.THEME_SCREENSHOTS) {
        mkdirSync(resolve(root, '.screenshots'), { recursive: true });
        await page.screenshot({ path: resolve(root, `.screenshots/theme-${brand}-${dark ? 'dark' : 'light'}.png`), fullPage: true });
      }
    }
  }
  await page.locator('#assistant').evaluate(el => el.style.setProperty('--chat-ui-assistant-bg', 'rgb(20, 30, 40)'));
  await checkAsync('host assistant background override remains effective', () => expect(page.locator('#assistant article > div > div:nth-child(2)')).toHaveCSS('background-color', 'rgb(20, 30, 40)'));
  check('no runtime errors', () => assert.deepEqual(pageErrors, []));
  console.log(JSON.stringify({ checks, failures }, null, 2));
  assert.equal(failures.length, 0, 'Theme token regressions must be fixed');
} finally {
  await browser?.close();
  await server.close();
}
