import { describe, expect, it } from 'vitest'

import { formatDuration, formatFileSize } from '../ermp'

describe('ermp/utils', () => {
  it('formatFileSize scales to GB/TB with one decimal', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
    expect(formatFileSize(2 * 1024 ** 3)).toBe('2.0 GB')
    expect(formatFileSize(3 * 1024 ** 4)).toBe('3.0 TB')
  })

  it('formatDuration renders m:ss', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(600)).toBe('10:00')
  })
})
