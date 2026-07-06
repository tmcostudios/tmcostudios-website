import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const BUBBLE_SIZE = 22

/**
 * First-visit splash: the wordmark + tagline sit softly blurred, and a
 * circular "lens" tied to the pointer sharpens whatever is beneath it. A
 * little bubble trails the lens and bounces in the direction of movement.
 * Click the Home button (or anywhere) to enter the site.
 */
export default function Landing({ onEnter }) {
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const lensRef = useRef(null)
  const bubbleRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const bubbleXTo = useRef(null)
  const bubbleYTo = useRef(null)
  const [leaving, setLeaving] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const startX = window.innerWidth / 2
    const startY = window.innerHeight * 0.42
    pointerRef.current = { x: startX, y: startY }
    applyLens(startX, startY)

    if (bubbleRef.current) {
      gsap.set(bubbleRef.current, { x: startX - BUBBLE_SIZE / 2, y: startY - BUBBLE_SIZE / 2 })
      bubbleXTo.current = gsap.quickTo(bubbleRef.current, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      bubbleYTo.current = gsap.quickTo(bubbleRef.current, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    }

    const hintTimer = setTimeout(() => setShowHint(true), 1200)

    // Reduced-motion / no-pointer users shouldn't get stuck on a splash they can't animate.
    const autoTimer = reducedMotion ? setTimeout(() => handleEnter(), 3200) : null

    return () => {
      clearTimeout(hintTimer)
      if (autoTimer) clearTimeout(autoTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyLens(x, y) {
    const el = lensRef.current
    if (!el) return
    const mask = `radial-gradient(circle 190px at ${x}px ${y}px, #000 38%, transparent 74%)`
    el.style.maskImage = mask
    el.style.webkitMaskImage = mask
  }

  function handleMove(e) {
    const point = 'touches' in e ? e.touches[0] : e
    const prev = pointerRef.current
    const dx = point.clientX - prev.x
    const dy = point.clientY - prev.y
    pointerRef.current = { x: point.clientX, y: point.clientY }
    applyLens(point.clientX, point.clientY)

    // Bubble overshoots ahead of the cursor in the direction of travel, then
    // springs back onto it — the "bounce" reads from the elastic settle.
    const kick = 3.2
    const maxOffset = 46
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, dx * kick))
    const offsetY = Math.max(-maxOffset, Math.min(maxOffset, dy * kick))
    bubbleXTo.current?.(point.clientX + offsetX - BUBBLE_SIZE / 2)
    bubbleYTo.current?.(point.clientY + offsetY - BUBBLE_SIZE / 2)
  }

  function handleEnter() {
    if (leaving) return
    setLeaving(true)
    // The splash always resolves onto the Home page, however the visitor arrived.
    navigate('/', { replace: true })
    setTimeout(() => onEnter?.(), 550)
  }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onClick={handleEnter}
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9995] cursor-none select-none overflow-hidden bg-ink"
    >
      {/* Softly blurred base — legible enough to read, teasing the sharp reveal */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-80 blur-[7px]"
      >
        <Wordmark />
        <Tagline />
      </div>

      {/* Sharp layer, revealed only inside the pointer-tracked lens */}
      <div
        ref={lensRef}
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      >
        <Wordmark sharp />
        <Tagline sharp />
      </div>

      {/* Bubble that bounces along with pointer movement, inside the lens */}
      <span
        ref={bubbleRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 rounded-full bg-lime/70"
        style={{
          width: BUBBLE_SIZE,
          height: BUBBLE_SIZE,
          filter: 'blur(0.5px)',
          boxShadow: '0 0 18px 4px rgba(174, 238, 45, 0.35)',
        }}
      />

      {/* Enter the site */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center transition-opacity duration-700 ${
          showHint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleEnter()
          }}
          className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-lime px-8 py-3.5 text-sm font-semibold tracking-tight text-ink transition-colors duration-300 hover:bg-lime-soft"
        >
          Home
        </button>
      </div>
    </motion.div>
  )
}

function Wordmark({ sharp = false }) {
  return (
    <p
      className={`font-sans font-bold lowercase leading-none tracking-tightest ${
        sharp ? 'text-lime' : 'text-paper/70'
      }`}
      style={{ fontSize: 'clamp(2.75rem, 9vw, 6.5rem)' }}
    >
      tm<span className="px-2 font-normal opacity-70">&amp;</span>co
      <span className="pl-3">studios</span>
    </p>
  )
}

function Tagline({ sharp = false }) {
  return (
    <p
      className={`mt-6 max-w-md text-base leading-relaxed tracking-tight md:text-lg ${
        sharp ? 'text-paper' : 'text-muted'
      }`}
    >
      We build brands that refuse to be ignored.
    </p>
  )
}
