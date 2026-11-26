import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { CHANGELOG_ENTRIES, DESIGN_SYSTEM_VERSION } from './changelog'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8')) as {
  version: string
}
const markdown = readFileSync(join(packageRoot, 'CHANGELOG.md'), 'utf8')
describe('ZooWorkDesign public release history', () => {
  it('matches the installed package version and includes public distribution notes', () => {
    expect(packageJson.version).toBe(DESIGN_SYSTEM_VERSION)
    expect(markdown).toContain('## Unreleased')
    expect(markdown).toContain('@zooclaw/zooworkdesign')
    expect(CHANGELOG_ENTRIES[0].version).toBe('Unreleased')
    expect(CHANGELOG_ENTRIES[0].changes.added?.join(' ')).toContain('公开包名')
  })

  it('does not expose internal repository links as public release history', () => {
    expect(markdown).not.toMatch(/ecap-workspace|Zoowork-design-system/)
    for (const entry of CHANGELOG_ENTRIES) {
      for (const link of [entry.pr, entry.revision]) {
        if (link) expect(link.href.startsWith('https://github.com/SerendipityOneInc/ZooWorkDesign/')).toBe(true)
      }
    }
  })
})
