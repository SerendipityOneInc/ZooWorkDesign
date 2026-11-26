'use client'

/*!
 * Icon paths adapted from Heroicons 2.2.0 (MIT). Copyright (c) Tailwind Labs, Inc.
 * Modified with ZooWork motion and geometry adaptations. See third-party/SOURCE_ATTRIBUTION.md.
 */

import { motion, type TargetAndTransition, type Transition } from 'motion/react'

const WORKSPACE_TRANSITION: Transition = { duration: 0.46, repeat: 0, ease: [0.22, 1, 0.36, 1] }

function Detail({
  d,
  hover,
  delay = 0,
  rest = {},
  className,
  transition,
}: {
  d: string
  hover: TargetAndTransition
  delay?: number
  rest?: TargetAndTransition
  className?: string
  transition?: Transition
}) {
  return (
    <motion.path
      d={d}
      className={className}
      data-nav-detail="true"
      variants={{
        rest: { d, pathLength: 1, opacity: 1, ...rest, transition: { duration: 0.18, ease: 'easeOut' } },
        hover: {
          transition: { duration: 1.2, delay, repeat: Infinity, repeatDelay: 0.55, ease: 'easeInOut', ...transition },
          ...hover,
        },
      }}
    />
  )
}

function HomeDetails() {
  const door = 'M9.75 21V16.125Q9.75 15 10.875 15H13.125Q14.25 15 14.25 16.125V21'
  return (
    <>
      <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V9.75" />
      <Detail
        d={door}
        className="fill-current"
        rest={{ fillOpacity: 0 }}
        hover={{
          d: [door, 'M9.75 21V16.125Q9.75 15 8.625 14.5H6.875Q5.75 14.5 5.75 15.625V20', door],
          fillOpacity: [0, 0.3, 0],
        }}
      />
    </>
  )
}

function ArtifactDetails() {
  const file = 'M6 6.75V6Q6 3.75 8.25 3.75H15.75Q18 3.75 18 6V6.75'
  return (
    <>
      <Detail d={file} hover={{ d: [file, 'M6 6.75V3Q6 0.75 8.25 0.75H15.75Q18 0.75 18 3V6.75', file] }} />
      <Detail d="M9 3.75H15" rest={{ opacity: 0, y: 0 }} hover={{ y: [0, -0.75, 0], opacity: [0, 1, 0] }} />
      <path d="M4.5 9.75V9a2.25 2.25 0 0 1 2.25-2.25h10.5A2.25 2.25 0 0 1 19.5 9v.75M5.25 9.75h13.5A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6a2.25 2.25 0 0 1 2.25-2.25Z" />
    </>
  )
}

function TaskDetails() {
  return (
    <>
      <path d="m15.75 18.75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      {[12, 15, 18].map((y, index) => (
        <g key={y}>
          <path d={`M6.75 ${y}h.008`} />
          <Detail
            d={`M9 ${y}h3.75`}
            delay={index * 0.12}
            hover={{ pathLength: [1, 0, 1, 1], opacity: [1, 0.35, 1, 1] }}
          />
        </g>
      ))}
    </>
  )
}

function ConnectorDetails() {
  return (
    <>
      {[
        { x: 3.75, y: 3.75, dx: 2.25, dy: 2.25 },
        { x: 13.5, y: 3.75, dx: -2.25, dy: 2.25 },
        { x: 13.5, y: 13.5, dx: -2.25, dy: -2.25 },
        { x: 3.75, y: 13.5, dx: 2.25, dy: -2.25 },
      ].map(({ x, y, dx, dy }, index) => (
        <Detail
          key={index}
          d={`M${x + 2.25} ${y}h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25a2.25 2.25 0 0 1 2.25-2.25Z`}
          rest={{ x: 0, y: 0, scale: 1, rotate: 0 }}
          hover={{ x: [0, dx, 0], y: [0, dy, 0], scale: [1, 0.7, 1], rotate: [0, 90, 0] }}
          delay={index * 0.09}
          className="origin-center [transform-box:fill-box]"
        />
      ))}
    </>
  )
}

function McpDetails() {
  return (
    <>
      <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3" />
      {[11.25, 17.25].map((y, index) => (
        <Detail
          key={y}
          d={`M5.25 ${y}h5.25`}
          rest={{ pathLength: 0, opacity: 0, x: 0, strokeWidth: 2 }}
          hover={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0], x: [0, 0, 3, 3] }}
          delay={index * 0.3}
        />
      ))}
      {[
        { x: 15.75, y: 11.25 },
        { x: 18.75, y: 11.25 },
        { x: 15.75, y: 17.25 },
        { x: 18.75, y: 17.25 },
      ].map(({ x, y }, index) => (
        <Detail
          key={index}
          d={`M${x} ${y}h.008`}
          rest={{ strokeWidth: 1.5 }}
          delay={index * 0.14}
          hover={{ opacity: [1, 0.15, 1], strokeWidth: [1.5, 2.5, 1.5] }}
        />
      ))}
    </>
  )
}

function SkillDetails() {
  const bolt = 'M3.75 13.5L14.25 2.25L12 10.5H20.25L9.75 21.75L12 13.5H3.75Z'
  return (
    <Detail
      d={bolt}
      className="fill-current"
      rest={{ fillOpacity: 0, strokeWidth: 1.5 }}
      hover={{
        d: [bolt, 'M2.25 13.5L15.75 1.5L13.5 9.75H21.75L8.25 22.5L10.5 14.25H2.25Z', bolt, bolt],
        pathLength: [1, 0.08, 1, 1],
        fillOpacity: [0, 0, 0.35, 0],
        strokeWidth: [1.5, 1.5, 2, 1.5],
      }}
    />
  )
}

function KnowledgeDetails() {
  const page = 'M12 6.042C14 4.3 16 3.3 18 3.75V18C16 17.5 14 18.5 12 20.292'
  return (
    <>
      <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      <Detail
        d={page}
        rest={{ opacity: 0 }}
        hover={{
          d: [
            page,
            'M12 6.042C12 4.3 11 3.3 10 3.75V18C11 17.5 12 18.5 12 20.292',
            'M12 6.042C10 4.3 8 3.3 6 3.75V18C8 17.5 10 18.5 12 20.292',
          ],
          opacity: [0, 1, 0],
        }}
      />
    </>
  )
}

function EditAgentDetails() {
  return (
    <>
      <path d="M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      <Detail
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
        rest={{ x: 0, y: 0 }}
        hover={{ x: [0, -0.8, 0.6, 0], y: [0, 0.6, -0.4, 0], pathLength: [1, 0.35, 1, 1] }}
        transition={WORKSPACE_TRANSITION}
      />
    </>
  )
}

function WorkspaceArtifactDetails() {
  return (
    <>
      <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5" />
      <Detail
        d="M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
        rest={{ y: 0 }}
        hover={{ y: [0, -1.5, 0] }}
        transition={WORKSPACE_TRANSITION}
      />
      <Detail
        d="M10 11.25h4"
        hover={{ pathLength: [1, 0, 1], opacity: [1, 0.3, 1] }}
        transition={WORKSPACE_TRANSITION}
      />
    </>
  )
}

function ScheduleDetails() {
  return (
    <>
      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 1 5.25 21h13.5A2.25 2.25 0 0 1 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      {[
        'M12 12.75h.008m2.242 0h.008m2.242 0h.008',
        'M7.5 15h.008m2.242 0h.008m2.242 0h.008m2.242 0h.008m2.242 0h.008',
        'M7.5 17.25h.008m2.242 0h.008m2.242 0h.008m2.242 0h.008',
      ].map((d, index) => (
        <Detail
          key={d}
          d={d}
          delay={index * 0.06}
          hover={{ opacity: [1, 0.15, 1], pathLength: [1, 0, 1] }}
          transition={{ ...WORKSPACE_TRANSITION, duration: 0.36 }}
        />
      ))}
    </>
  )
}

function ChannelDetails() {
  return (
    <>
      <Detail
        d="M20.25 8.511V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        hover={{ pathLength: [1, 0.25, 1], opacity: [1, 0.55, 1] }}
        transition={{ ...WORKSPACE_TRANSITION, duration: 0.38 }}
      />
      <Detail
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951"
        delay={0.1}
        hover={{ pathLength: [1, 0.25, 1], opacity: [1, 0.55, 1] }}
        transition={{ ...WORKSPACE_TRANSITION, duration: 0.38 }}
      />
    </>
  )
}

const DETAILS: Record<string, () => React.JSX.Element> = {
  home: HomeDetails,
  library: ArtifactDetails,
  tasks: TaskDetails,
  connector: ConnectorDetails,
  mcp: McpDetails,
  skills: SkillDetails,
  'knowledge-base': KnowledgeDetails,
  'workspace-build': EditAgentDetails,
  'workspace-artifacts': WorkspaceArtifactDetails,
  'workspace-scheduled': ScheduleDetails,
  'workspace-channels': ChannelDetails,
}

/** Hover variants come from the navigation row; only internal paths animate. */
export function ProductNavIcon({ name, className }: { name: string; className?: string }) {
  const Contents = DETAILS[name]
  if (!Contents) return null
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <Contents />
    </svg>
  )
}
