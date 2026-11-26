import { setTimeout as delay } from 'node:timers/promises';
import { registry } from './release-utils.mjs';

export async function verifyRegistryTag(item, tag, {
  fetchImpl = fetch, attempts = 12, intervalMs = 5000, log = console.log,
} = {}) {
  let observed;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    // A successful tag write can be followed by stale registry reads. Only retry
    // the read: re-publishing or re-promoting could overwrite a newer delivery.
    const response = await fetchImpl(`${registry}/-/package/${encodeURIComponent(item.name)}/dist-tags`, {
      headers: { Authorization: `Bearer ${process.env.NODE_AUTH_TOKEN}`, 'Cache-Control': 'no-cache' },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Registry tag verification failed: ${item.name} (${tag}) HTTP ${response.status}`);
    observed = (await response.json())[tag];
    if (observed === item.version) return;
    if (attempt < attempts) {
      log(`Waiting for registry tag ${item.name} (${tag}): expected ${item.version}, observed ${observed ?? '(missing)'} (${attempt}/${attempts})`);
      await delay(intervalMs);
    }
  }
  throw new Error(`Registry tag did not converge after ${attempts} reads: ${item.name} (${tag}); expected ${item.version}, observed ${observed ?? '(missing)'}. Package upload may already have succeeded; retry the verified delivery without changing its artifacts.`);
}
