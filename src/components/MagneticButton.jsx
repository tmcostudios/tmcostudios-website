import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * A button/anchor that subtly leans toward the cursor on hover.
 * Renders as <a> if href is provided, otherwise <button>.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'lime',
  strength = 0.35,
}) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const reduce = useReducedMotion()

  const handleMove = (e) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength
    setPos({ x, y })
  }

  const reset = () => setPos({ x: 0, y: 0 })

  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium tracking-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime'

  const variants = {
    lime: 'bg-lime text-ink hover:bg-lime-soft',
    outline: 'border border-paper/25 text-paper hover:border-lime hover:text-lime',
    dark: 'bg-ink text-paper hover:bg-ink-3',
  }

  const Tag = href ? motion.a : motion.button
  const tagProps = href
    ? href.startsWith('#')
      ? { href }
      : { href }
    : { type: 'button', onClick }

  return (
    <Tag
      ref={ref}
      {...tagProps}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.4 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Tag>
  )
}
