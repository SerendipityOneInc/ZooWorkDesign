import geometry from './mobius-loading-geometry.json'

// Geometry, round brush and timing from mobius-loading-a.zip (2026-09-18).
export const MOBIUS_PATH = geometry.path
export const MOBIUS_DURATION_SECONDS = 2.6 / 1.5
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => value * value * (3 - 2 * value)
const format = (value: number) => value.toFixed(2)
const disk = ([x, y, radius]: number[]) =>
  `M${format(x + radius)},${format(y)}a${format(radius)},${format(radius)} 0 1 0 ${format(-2 * radius)},0a${format(radius)},${format(radius)} 0 1 0 ${format(2 * radius)},0Z`

const offsets = [0]
const disks = geometry.points.reduce((path, point) => {
  const next = path + disk(point)
  offsets.push(next.length)
  return next
}, '')

function ease(value: number): number {
  const ramp = 0.12
  if (value < ramp) return (value * value) / (2 * ramp * (1 - ramp))
  if (value > 1 - ramp) return 1 - ((1 - value) * (1 - value)) / (2 * ramp * (1 - ramp))
  return (value - ramp / 2) / (1 - ramp)
}

function mobiusFrameAt(phase: number): { progress: number; opacity: number } {
  if (phase < 0.72) {
    const progress = ease(clamp(phase / 0.72))
    return { progress, opacity: smooth(clamp(progress / 0.035)) }
  }
  if (phase < 0.86) return { progress: 1, opacity: 1 }
  if (phase < 0.98) return { progress: 1, opacity: 1 - smooth((phase - 0.86) / 0.12) }
  return { progress: 0, opacity: 0 }
}

// CSS can play before hydration or window.load. Group the original brush disks into
// sub-frame drawing steps instead of rebuilding a large path on every JS frame.
const DRAW_STEPS = 96
let previousDisk = 0
export const MOBIUS_DRAW_SEGMENTS = Array.from({ length: DRAW_STEPS }, (_, index) => {
  const phase = ((index + 1) / DRAW_STEPS) * 0.72
  const nextDisk = Math.floor(mobiusFrameAt(phase).progress * (geometry.points.length - 1)) + 1
  const path = index === DRAW_STEPS - 1 ? MOBIUS_PATH : disks.slice(offsets[previousDisk], offsets[nextDisk])
  previousDisk = nextDisk
  const at = (phase * 100).toFixed(4)
  return { path, easing: `linear(0, 0 ${at}%, 1 ${at}%, 1)` }
}).filter(({ path }) => path.length > 0)

const opacityFrames = Array.from({ length: 129 }, (_, index) => index / 128)
export const MOBIUS_OPACITY_EASING = `linear(${opacityFrames
  .map((phase) => `${mobiusFrameAt(phase).opacity.toFixed(4)} ${(phase * 100).toFixed(4)}%`)
  .join(',')})`
