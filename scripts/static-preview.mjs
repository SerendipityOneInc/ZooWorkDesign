import assert from 'node:assert/strict';
import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Keep this boundary compatible with the trusted main-branch publisher.
export const allowedStatic = ['.nojekyll', 'assets', 'index.html', 'preview-version.json', 'product-source', 'videos', 'zooclaw-logo.png'];

export function inspectStatic(directory, top = true) {
  for (const name of readdirSync(directory)) {
    assert.ok(!top || allowedStatic.includes(name), `Unexpected public artifact: ${name}`);
    assert.ok(!name.startsWith('.') || name === '.nojekyll', 'Hidden public file');
    const file = join(directory, name);
    const stats = lstatSync(file);
    assert.ok(stats.isFile() || stats.isDirectory(), 'Public links/special files are forbidden');
    if (stats.isDirectory()) inspectStatic(file, false);
  }
}
