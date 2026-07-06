import { motion, useReducedMotion } from 'framer-motion'

/**
 * Seamless looping marquee. Duplicates content so the loop is invisible.
 */
export default function Marquee({
  children,
  speed = 26,
  reverse = false,
  className = '',
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={`flex overflow-hidden ${className}`}>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    )
  }

  return (
    <div className={`flex overflow-hidden ${className}`}>
      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
