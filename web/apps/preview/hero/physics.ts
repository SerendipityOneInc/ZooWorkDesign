export interface PhysicsBounds {
  width: number
  height: number
}

export interface PhysicsPointer {
  x: number
  y: number
}

export interface PhysicsConfig {
  gravity: number
  restitution: number
  friction: number
  linearDamping: number
  angularDamping: number
  pointerRadius: number
  pointerStrength: number
  sleepSpeed: number
  sleepAngularSpeed: number
  sleepAfter: number
}

export interface PhysicsBody {
  id: string
  width: number
  height: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  angularVelocity: number
  sleeping: boolean
  sleepTimer: number
}

export type BodyInput = Pick<PhysicsBody, 'id' | 'width' | 'height' | 'x' | 'y'>
export type BodySize = Pick<PhysicsBody, 'id' | 'width' | 'height'>

export const createBody = (input: BodyInput): PhysicsBody => ({
  ...input,
  vx: 0,
  vy: 0,
  angle: 0,
  angularVelocity: 0,
  sleeping: false,
  sleepTimer: 0,
})

const DEFAULT_CONFIG: PhysicsConfig = {
  gravity: 2100,
  restitution: 0.18,
  friction: 0.4,
  linearDamping: 0.16,
  angularDamping: 0.48,
  pointerRadius: 120,
  pointerStrength: 18,
  sleepSpeed: 12,
  sleepAngularSpeed: 0.16,
  sleepAfter: 0.45,
}

const seededRandom = (seed: number) => {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

const rotatedExtents = (body: PhysicsBody) => {
  const cosine = Math.abs(Math.cos(body.angle))
  const sine = Math.abs(Math.sin(body.angle))
  return {
    x: (body.width * cosine + body.height * sine) / 2,
    y: (body.width * sine + body.height * cosine) / 2,
  }
}

const wake = (body: PhysicsBody) => {
  body.sleeping = false
  body.sleepTimer = 0
}

export const createInitialBodies = (sizes: BodySize[], bounds: PhysicsBounds, seed: number): PhysicsBody[] => {
  const random = seededRandom(seed)
  const padding = 24
  const gap = 8
  let cursorX = padding
  let cursorY = Math.max(padding, bounds.height * 0.48)
  let rowHeight = 0

  return sizes.map((size) => {
    if (cursorX + size.width > bounds.width - padding) {
      cursorX = padding
      cursorY += rowHeight + gap
      rowHeight = 0
    }

    const body = createBody({
      ...size,
      x: Math.min(cursorX + size.width / 2, bounds.width - padding - size.width / 2),
      y: Math.min(cursorY + size.height / 2, bounds.height - padding - size.height / 2),
    })
    body.angle = (random() - 0.5) * 0.5
    body.angularVelocity = (random() - 0.5) * 0.8
    cursorX += size.width + gap
    rowHeight = Math.max(rowHeight, size.height)
    return body
  })
}

const resolveBounds = (body: PhysicsBody, bounds: PhysicsBounds, restitution: number) => {
  const extent = rotatedExtents(body)

  if (body.x - extent.x < 0) {
    body.x = extent.x
    body.vx = Math.abs(body.vx) * restitution
    body.angularVelocity *= 0.72
  } else if (body.x + extent.x > bounds.width) {
    body.x = bounds.width - extent.x
    body.vx = -Math.abs(body.vx) * restitution
    body.angularVelocity *= 0.72
  }

  if (body.y + extent.y > bounds.height) {
    body.y = bounds.height - extent.y
    body.vy = -Math.abs(body.vy) * restitution
    body.vx *= 0.88
    body.angularVelocity *= 0.7
  }
}

const resolvePair = (first: PhysicsBody, second: PhysicsBody, config: PhysicsConfig) => {
  const firstExtent = rotatedExtents(first)
  const secondExtent = rotatedExtents(second)
  const dx = second.x - first.x
  const dy = second.y - first.y
  const overlapX = firstExtent.x + secondExtent.x - Math.abs(dx)
  const overlapY = firstExtent.y + secondExtent.y - Math.abs(dy)
  if (overlapX <= 0 || overlapY <= 0) return

  wake(first)
  wake(second)

  const horizontal = overlapX < overlapY
  const nx = horizontal ? (dx >= 0 ? 1 : -1) : 0
  const ny = horizontal ? 0 : dy >= 0 ? 1 : -1
  const penetration = horizontal ? overlapX : overlapY
  const correction = Math.max(penetration - 0.2, 0) / 2
  first.x -= nx * correction
  first.y -= ny * correction
  second.x += nx * correction
  second.y += ny * correction

  const relativeNormalVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny
  if (relativeNormalVelocity < 0) {
    const impulse = (-(1 + config.restitution) * relativeNormalVelocity) / 2
    first.vx -= impulse * nx
    first.vy -= impulse * ny
    second.vx += impulse * nx
    second.vy += impulse * ny
  }

  const tangentX = -ny
  const tangentY = nx
  const relativeTangentVelocity = (second.vx - first.vx) * tangentX + (second.vy - first.vy) * tangentY
  const frictionImpulse = relativeTangentVelocity * config.friction * 0.5
  first.vx += frictionImpulse * tangentX
  first.vy += frictionImpulse * tangentY
  second.vx -= frictionImpulse * tangentX
  second.vy -= frictionImpulse * tangentY

  const spin = relativeTangentVelocity * 0.0008
  first.angularVelocity += spin
  second.angularVelocity -= spin
}

export const stepWorld = (
  bodies: PhysicsBody[],
  bounds: PhysicsBounds,
  pointer: PhysicsPointer | null,
  dt: number,
  config: PhysicsConfig = DEFAULT_CONFIG,
) => {
  for (const body of bodies) {
    if (pointer) {
      const dx = pointer.x - body.x
      const dy = pointer.y - body.y
      const distance = Math.hypot(dx, dy)
      if (distance > 0 && distance < config.pointerRadius) {
        wake(body)
        const falloff = 1 - distance / config.pointerRadius
        const acceleration = config.pointerStrength * falloff * 60
        body.vx += (dx / distance) * acceleration * dt
        body.vy += (dy / distance) * acceleration * dt
        body.angularVelocity += (dx / config.pointerRadius) * dt
      }
    }

    if (body.sleeping) continue

    body.vy += config.gravity * dt
    body.vx /= 1 + config.linearDamping * dt
    body.vy /= 1 + config.linearDamping * dt
    body.angularVelocity /= 1 + config.angularDamping * dt
    body.x += body.vx * dt
    body.y += body.vy * dt
    body.angle += body.angularVelocity * dt
    resolveBounds(body, bounds, config.restitution)
  }

  for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < bodies.length; secondIndex += 1) {
      resolvePair(bodies[firstIndex], bodies[secondIndex], config)
    }
  }

  for (const body of bodies) {
    if (body.sleeping) continue
    const speed = Math.hypot(body.vx, body.vy)
    if (speed < config.sleepSpeed && Math.abs(body.angularVelocity) < config.sleepAngularSpeed) {
      body.sleepTimer += dt
      if (body.sleepTimer >= config.sleepAfter) {
        body.sleeping = true
        body.vx = 0
        body.vy = 0
        body.angularVelocity = 0
      }
    } else {
      body.sleepTimer = 0
    }
  }
}

export const scatterBodies = (bodies: PhysicsBody[], seed: number) => {
  const random = seededRandom(seed)
  for (const body of bodies) {
    wake(body)
    body.vx = (random() - 0.5) * 760
    body.vy = -520 - random() * 440
    body.angularVelocity = (random() - 0.5) * 7
  }
}
