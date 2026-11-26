import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { inspectStatic } from './static-preview.mjs';

test('preview accepts notices inside assets but rejects a new top-level directory', () => {
  const root = mkdtempSync(join(tmpdir(), 'zoowork-static-'));
  try {
    mkdirSync(join(root, 'assets/licenses'), { recursive: true });
    writeFileSync(join(root, 'assets/licenses/LICENSE'), 'Original license');
    inspectStatic(root);
    mkdirSync(join(root, 'licenses'));
    assert.throws(() => inspectStatic(root), /Unexpected public artifact: licenses/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('preview rejects hidden files and symlinks even within assets', () => {
  const root = mkdtempSync(join(tmpdir(), 'zoowork-static-'));
  try {
    mkdirSync(join(root, 'assets'));
    writeFileSync(join(root, 'assets/.env'), 'not publishable');
    assert.throws(() => inspectStatic(root), /Hidden public file/);
    rmSync(join(root, 'assets/.env'));
    symlinkSync(tmpdir(), join(root, 'assets/linked'));
    assert.throws(() => inspectStatic(root), /links\/special files are forbidden/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
