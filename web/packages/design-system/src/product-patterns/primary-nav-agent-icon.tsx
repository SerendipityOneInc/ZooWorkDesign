'use client'

import { motion, useReducedMotion } from 'motion/react'

/** Rounded robot silhouette, optically balanced with the sidebar outline icons. */
export function PrimaryNavAgentIcon() {
  const reducedMotion = useReducedMotion()
  const antenna = {
    rest: { rotate: 0, transition: { duration: 0.18 } },
    hover: reducedMotion
      ? { rotate: 0 }
      : {
          rotate: [0, -22, 18, -10, 0],
          transition: { duration: 0.85, repeat: Infinity, repeatDelay: 0.9, ease: 'easeInOut' as const },
        },
  }
  const eyes = {
    rest: { scaleY: 1, transition: { duration: 0.12 } },
    hover: reducedMotion
      ? { scaleY: 1 }
      : {
          scaleY: [1, 1, 0.12, 1, 1, 0.12, 1],
          transition: {
            duration: 1.1,
            times: [0, 0.16, 0.24, 0.33, 0.7, 0.78, 1],
            repeat: Infinity,
            repeatDelay: 0.65,
          },
        },
  }
  return (
    <span aria-hidden="true" className="relative block h-[18px] w-[18px] shrink-0">
      <motion.span
        variants={antenna}
        data-nav-detail="antenna"
        className="absolute top-[1.5px] left-[8.25px] h-1 w-[1.5px] origin-bottom rounded-full bg-current"
      />
      <span className="absolute top-[4.5px] left-[2px] h-3 w-3.5 rounded-[3px] border-[1.5px] border-current" />
      <motion.span
        variants={eyes}
        data-nav-detail="eye"
        className="absolute top-[8px] left-[5px] h-[3px] w-[2px] origin-center rounded-full bg-current"
      />
      <motion.span
        variants={eyes}
        data-nav-detail="eye"
        className="absolute top-[8px] right-[5px] h-[3px] w-[2px] origin-center rounded-full bg-current"
      />
      <span className="absolute top-[8px] left-0 h-1 w-[1.5px] rounded-full bg-current" />
      <span className="absolute top-[8px] right-0 h-1 w-[1.5px] rounded-full bg-current" />
    </span>
  )
}
