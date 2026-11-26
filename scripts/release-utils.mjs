import { createHash } from 'node:crypto';

export const registry = 'https://registry.npmjs.org';
export function integrity(bytes) { return `sha512-${createHash('sha512').update(bytes).digest('base64')}`; }
export function releaseTag(version) { return /(?:-|\.)pr\.\d+\./.test(version) ? 'preview' : version.includes('-') ? 'next' : 'latest'; }
export function validatePackage(pkg) {
  if (!['@zooclaw/zooworkdesign', '@zooclaw/zooworkdesign-chat'].includes(pkg.name)) throw new Error('Unexpected release package');
  if (pkg.private || pkg.publishConfig?.access !== 'public' || pkg.publishConfig?.registry !== registry || pkg.publishConfig?.provenance !== false) throw new Error(`Unsafe publish configuration: ${pkg.name}`);
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version)) throw new Error('Invalid release version');
  for (const version of Object.values(pkg.dependencies ?? {})) {
    if (/^(workspace:|file:|link:)/.test(version)) throw new Error('Non-portable dependency in packed manifest');
  }
  if (pkg.name === '@zooclaw/zooworkdesign-chat' && !['next', 'preview'].includes(releaseTag(pkg.version))) throw new Error('Chat UI is under construction: publish a prerelease to next/preview');
}
export function classifyVersionLookup(result, expectedIntegrity) {
  let data;
  try { data = JSON.parse(result.stdout); } catch { /* Report the original lookup error below. */ }
  if (result.status === 0) {
    if (data?.dist?.integrity !== expectedIntegrity) throw new Error('Version already exists with different contents; bump the version');
    return 'identical';
  }
  if (data?.error?.code === 'E404') return 'missing';
  throw new Error('Registry lookup failed (authentication/network/server). No publish attempted.');
}
