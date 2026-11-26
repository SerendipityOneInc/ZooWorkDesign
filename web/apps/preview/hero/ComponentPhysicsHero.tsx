import { usePreviewLocale } from '../locale'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { Badge, Button, Card, CardContent, Checkbox, Input, Kbd, Progress, Switch, Tag } from '@zooclaw/zooworkdesign'
import {
  createInitialBodies,
  scatterBodies,
  stepWorld,
  type PhysicsBody,
  type PhysicsBounds,
  type PhysicsPointer,
} from './physics'

const DESKTOP_COUNT = 28
const MOBILE_COUNT = 14
const FIXED_STEP = 1 / 120
const MAX_FRAME_TIME = 1 / 20

function ComponentSample({ index }: { index: number }) {
  const { t } = usePreviewLocale()
  switch (index % 10) {
    case 0:
      return (
        <Button disabled size="sm">
          {t('Create agent')}
        </Button>
      )
    case 1:
      return <Badge variant={index % 2 ? 'secondary' : 'default'}>{t('Ready')}</Badge>
    case 2:
      return <Tag variant={index % 4 === 0 ? 'info' : 'outline'}>{t('Research')}</Tag>
    case 3:
      return (
        <Input aria-label={t('Example prompt')} className="w-40" readOnly tabIndex={-1} value={t('Ask ZooWork…')} />
      )
    case 4:
      return <Switch aria-label={t('Example switch')} checked={index % 2 === 0} disabled />
    case 5:
      return <Checkbox aria-label={t('Example checkbox')} checked disabled />
    case 6:
      return <Kbd>{t('⌘ K')}</Kbd>
    case 7:
      return <Progress aria-label={t('Example progress')} className="w-28" value={index % 3 === 0 ? 74 : 46} />
    case 8:
      return (
        <Card className="w-36" size="sm">
          <CardContent className="px-3 text-xs">{t('Agent connected')}</CardContent>
        </Card>
      )
    default:
      return (
        <Button disabled size="icon-sm" variant="outline" aria-label={t('Add')}>
          +
        </Button>
      )
  }
}

function buildSamples(count: number): Array<{ id: string; node: ReactNode }> {
  return Array.from({ length: count }, (_, index) => ({
    id: `component-${index}`,
    node: <ComponentSample index={index} />,
  }))
}

export function ComponentPhysicsHero() {
  const { t } = usePreviewLocale()
  const stageRef = useRef<HTMLElement>(null)
  const itemRefs = useRef(new Map<string, HTMLDivElement>())
  const bodiesRef = useRef<PhysicsBody[]>([])
  const boundsRef = useRef<PhysicsBounds>({ width: 0, height: 0 })
  const pointerRef = useRef<PhysicsPointer | null>(null)
  const scatterSeedRef = useRef(18)
  const [scatterCount, setScatterCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const samples = useMemo(() => buildSamples(isMobile ? MOBILE_COUNT : DESKTOP_COUNT), [isMobile])

  const drawBodies = useCallback(() => {
    for (const body of bodiesRef.current) {
      const element = itemRefs.current.get(body.id)
      if (!element) continue
      element.style.transform = `translate3d(${body.x - body.width / 2}px, ${body.y - body.height / 2}px, 0) rotate(${body.angle}rad)`
    }
  }, [])

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const stageRect = stage.getBoundingClientRect()
    if (stageRect.width <= 0 || stageRect.height <= 0) return

    const sizes = samples.flatMap(({ id }) => {
      const rect = itemRefs.current.get(id)?.getBoundingClientRect()
      return rect && rect.width > 0 && rect.height > 0 ? [{ id, width: rect.width, height: rect.height }] : []
    })
    if (sizes.length === 0) return

    boundsRef.current = { width: stageRect.width, height: stageRect.height }
    bodiesRef.current = createInitialBodies(sizes, boundsRef.current, 27)
    drawBodies()
  }, [drawBodies, samples])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 600px)')
    const syncPreferences = () => {
      setReducedMotion(motionQuery.matches)
      setIsMobile(mobileQuery.matches)
    }
    syncPreferences()
    motionQuery.addEventListener('change', syncPreferences)
    mobileQuery.addEventListener('change', syncPreferences)
    return () => {
      motionQuery.removeEventListener('change', syncPreferences)
      mobileQuery.removeEventListener('change', syncPreferences)
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)
    const frame = requestAnimationFrame(measure)
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [measure])

  useEffect(() => {
    if (reducedMotion) return
    let animationFrame = 0
    let lastTime = performance.now()
    let accumulator = 0
    let visible = true

    const tick = (time: number) => {
      const elapsed = Math.min((time - lastTime) / 1000, MAX_FRAME_TIME)
      lastTime = time
      if (visible && !document.hidden) {
        accumulator += elapsed
        while (accumulator >= FIXED_STEP) {
          stepWorld(bodiesRef.current, boundsRef.current, pointerRef.current, FIXED_STEP)
          accumulator -= FIXED_STEP
        }
        drawBodies()
      }
      animationFrame = requestAnimationFrame(tick)
    }

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
          })
    if (stageRef.current) observer?.observe(stageRef.current)
    animationFrame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer?.disconnect()
    }
  }, [drawBodies, reducedMotion])

  const handleScatter = () => {
    setScatterCount((count) => count + 1)
    if (reducedMotion) return
    scatterSeedRef.current += 1
    scatterBodies(bodiesRef.current, scatterSeedRef.current)
  }

  return (
    <section
      ref={stageRef}
      className="pv-physics-hero"
      data-motion={reducedMotion ? 'static' : 'physics'}
      data-scatter={scatterCount}
      data-slot="component-physics-hero"
      aria-label={t('Interactive ZooWork component physics canvas')}
      onClick={handleScatter}
      onPointerLeave={() => {
        pointerRef.current = null
      }}
      onPointerMove={(event) => {
        const rect = stageRef.current?.getBoundingClientRect()
        if (rect) pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      }}
    >
      <div className="pv-physics-scene" data-slot="component-physics-scene" aria-hidden="true">
        {samples.map(({ id, node }, index) => (
          <div
            className="pv-physics-block"
            data-index={index}
            key={id}
            ref={(element) => {
              if (element) itemRefs.current.set(id, element)
              else itemRefs.current.delete(id)
            }}
          >
            {node}
          </div>
        ))}
      </div>
      <span className="pv-physics-hint" aria-hidden="true">
        {t('click to scatter ↗')}
      </span>
    </section>
  )
}
