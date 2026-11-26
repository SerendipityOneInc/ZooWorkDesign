import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}web/packages/design-system/package.json`, 'utf8'));
const url = process.argv[2];
if (!url) throw new Error('Pass the actual running preview URL printed by Vite');
mkdirSync(`${root}docs/assets`, { recursive: true });
const browser = await chromium.launch(process.env.CI ? {} : { channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 760 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(`${url.replace(/\/$/, '')}/#purpose`);
  await page.locator('.pv-physics-block').first().waitFor();
  await page.evaluate(version => {
    // Clone real rendered components; the banner contains no invented UI mocks.
    const blocks = [...document.querySelectorAll('.pv-physics-block')].map(block => block.cloneNode(true));
    const logo = document.querySelector('.pv-topbar img').cloneNode(true);
    const banner = document.createElement('section');
    banner.id = 'readme-hero';
    banner.innerHTML = `<div class="hero-brand"></div><div class="hero-meta">DESIGN SYSTEM · REACT WEB</div>
      <h1>ZooWork<br>Design System.</h1><p>A shared foundation<br>for agent interfaces.</p>
      <div class="hero-stack">React · TypeScript · Tailwind CSS</div>
      <div class="hero-version">SOURCE ${version}</div><div class="hero-components"></div>`;
    banner.querySelector('.hero-brand').append(logo);
    const stage = banner.querySelector('.hero-components');
    const positions = [
      [70, 65, -7], [355, 55, 7], [450, 157, -4], [210, 245, -6],
      [55, 300, 9], [420, 345, -5], [110, 440, 4], [386, 475, 9],
      [195, 535, 5], [478, 45, 8],
    ];
    positions.forEach(([x, y, rotation], index) => {
      const block = blocks[index];
      block.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(1.55)`;
      stage.append(block);
    });
    const style = document.createElement('style');
    style.textContent = `
      .pv-topbar,.pv-shell { display:none !important; }
      html,body { margin:0 !important; overflow:hidden !important; background:#fafaf9 !important; }
      #readme-hero { width:1600px;height:760px;position:relative;overflow:hidden;background:#fafaf9;color:#34322d;font-family:Inter,Arial,sans-serif; }
      #readme-hero .hero-brand {position:absolute;left:72px;top:58px;height:30px;}
      #readme-hero .hero-brand img {width:204px;height:auto;}
      #readme-hero .hero-meta {position:absolute;left:74px;top:149px;font-size:13px;letter-spacing:2px;color:#5b50ce;font-weight:600;}
      #readme-hero h1 {position:absolute;left:68px;top:191px;margin:0;font-family:'GFS Didot',Georgia,serif;font-size:101px;font-weight:400;line-height:1.08;letter-spacing:-3px;}
      #readme-hero p {position:absolute;left:75px;top:444px;margin:0;color:#858481;font-size:25px;line-height:1.5;}
      #readme-hero .hero-stack {position:absolute;left:75px;bottom:66px;color:#858481;font-size:15px;letter-spacing:.3px;}
      #readme-hero .hero-version {position:absolute;right:70px;top:64px;color:#858481;font-size:12px;letter-spacing:1.2px;}
      #readme-hero .hero-components {position:absolute;left:845px;top:94px;width:650px;height:625px;}
      #readme-hero .pv-physics-block {position:absolute;top:0;left:0;transform-origin:0 0;filter:drop-shadow(0 10px 10px #00000008);pointer-events:none;}
    `;
    document.head.append(style);
    document.body.append(banner);
  }, pkg.version);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#readme-hero').screenshot({ path: `${root}docs/assets/readme-hero.png`, animations: 'disabled' });
  console.log('Saved docs/assets/readme-hero.png (real ZooWork components and brand assets)');
} finally { await browser.close(); }
