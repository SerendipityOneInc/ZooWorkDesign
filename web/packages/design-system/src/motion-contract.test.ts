import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const componentsDir = join(dirname(fileURLToPath(import.meta.url)), 'components')
const componentSource = readdirSync(componentsDir)
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .map((file) => readFileSync(join(componentsDir, file), 'utf8'))
  .join('\n')

describe('component motion rhythm', () => {
  it('uses semantic motion utilities instead of ad-hoc interaction durations', () => {
    expect(componentSource).not.toMatch(/\bduration-(?:75|100|150|200|300|500)\b/)
    expect(componentSource).toMatch(/\bmotion-(?:fast|normal|emphasis|layout)\b/)
  })

  it('names the properties that animate instead of transitioning everything', () => {
    expect(componentSource).not.toContain('transition-all')
  })
})
