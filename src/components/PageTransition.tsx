import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Shared cinematic transition wrapper — every route fades/scales through
 * this the same way, so moving between memories feels like one continuous
 * experience rather than a page reloading underneath you. */
export function PageTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.025, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
