import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered reveal. Children fade + slide in once when they
 * enter the viewport. Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  once = true,
  as = 'div',
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
