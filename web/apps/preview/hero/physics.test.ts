import { describe, expect, it } from 'vitest'

import {
  createBody,
  createInitialBodies,
  scatterBodies,
  stepWorld,
  type PhysicsConfig,
} from './physics'

const quietConfig: PhysicsConfig = {
  gravity: 0,
  restitution: 0.18,
  friction: 0.4,
  linearDamping: 0,
  angularDamping: 0,
  pointerRadius: 120,
  pointerStrength: 18,
  sleepSpeed: 0,
  sleepAngularSpeed: 0,
  sleepAfter: Number.POSITIVE_INFINITY,
}

describe('component hero physics', () => {
  it('applies gravity while keeping a body inside the stage floor', () => {
    const body = createBody({ id: 'button', width: 80, height: 32, x: 120, y: 80 })

    stepWorld([body], { width: 240, height: 120 }, null, 1 / 60)
    expect(body.y).toBeGreaterThan(80)

    body.y = 118
    body.vy = 300
    stepWorld([body], { width: 240, height: 120 }, null, 1 / 60)

    expect(body.y).toBeLessThanOrEqual(104)
    expect(body.vy).toBeLessThanOrEqual(0)
  })

  it('pulls nearby bodies toward an active pointer without teleporting them', () => {
    const body = createBody({ id: 'badge', width: 60, height: 24, x: 40, y: 50 })

    stepWorld([body], { width: 240, height: 120 }, { x: 100, y: 50 }, 1 / 60, quietConfig)

    expect(body.vx).toBeGreaterThan(0)
    expect(body.x).toBeGreaterThan(40)
    expect(body.x).toBeLessThan(50)
  })

  it('separates overlapping component bounds', () => {
    const left = createBody({ id: 'left', width: 80, height: 32, x: 90, y: 60 })
    const right = createBody({ id: 'right', width: 80, height: 32, x: 130, y: 60 })

    stepWorld([left, right], { width: 240, height: 120 }, null, 1 / 60, quietConfig)

    const separatedHorizontally = Math.abs(right.x - left.x) >= 79
    const separatedVertically = Math.abs(right.y - left.y) >= 31
    expect(separatedHorizontally || separatedVertically).toBe(true)
  })

  it('uses a seed so initial layouts and click scatters are reproducible', () => {
    const sizes = [
      { id: 'button', width: 80, height: 32 },
      { id: 'switch', width: 32, height: 18 },
    ]
    const first = createInitialBodies(sizes, { width: 320, height: 240 }, 42)
    const second = createInitialBodies(sizes, { width: 320, height: 240 }, 42)

    expect(first).toHaveLength(2)
    expect(second).toEqual(first)
    expect(first.every((body) => body.y > 96)).toBe(true)

    scatterBodies(first, 7)
    scatterBodies(second, 7)
    expect(second).toEqual(first)
    expect(first.every((body) => body.vy < 0)).toBe(true)
  })
})
