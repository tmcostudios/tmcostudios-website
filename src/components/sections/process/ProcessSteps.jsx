import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process as processContent } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function ProcessSteps() {
  const { steps, quote, attribution } = processContent
  const sectionRef = useRef(null)
  const wrapRef = useRef(null)
  const routeRef = useRef(null)
  const travelerRef = useRef(null)
  const dotRefs = useRef([])

  const [pathD, setPathD] = useState('')
  const [viewBox, setViewBox] = useState('0 0 100 100')

  // Trace a smooth zig-zag route through the actual dot positions, so the
  // "road" always matches the real (variable-height) content layout.
  const measure = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wrapRect = wrap.getBoundingClientRect()
    const points = dotRefs.current
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - wrapRect.left + r.width / 2, y: r.top - wrapRect.top + r.height / 2 }
      })

    if (points.length < 2 || wrapRect.width === 0) return

    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]
      const b = points[i + 1]
      const cpY = (a.y + b.y) / 2
      d += ` C ${a.x} ${cpY}, ${b.x} ${cpY}, ${b.x} ${b.y}`
    }

    setPathD(d)
    setViewBox(`0 0 ${wrapRect.width} ${wrapRect.height}`)
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(() => measure())
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure, steps.length])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Mobile straight rail fill
      const rail = sectionRef.current.querySelector('[data-rail]')
      const railFill = sectionRef.current.querySelector('[data-rail-fill]')
      if (rail && railFill) {
        gsap.to(railFill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: rail, start: 'top 40%', end: 'bottom 60%', scrub: 1 },
        })
      }

      // Desktop winding route draws in with scroll, a glowing traveler rides along it
      const route = routeRef.current
      if (route && pathD) {
        const length = route.getTotalLength()
        gsap.set(route, { strokeDasharray: length, strokeDashoffset: length })

        gsap.to(route, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 70%',
            end: 'bottom 55%',
            scrub: 0.6,
            onUpdate(self) {
              if (!travelerRef.current) return
              const pt = route.getPointAtLength(length * self.progress)
              travelerRef.current.setAttribute('cx', pt.x)
              travelerRef.current.setAttribute('cy', pt.y)
            },
          },
        })
      }

      // Each step node and content animates in
      const stepEls = sectionRef.current.querySelectorAll('[data-step]')
      stepEls.forEach((step) => {
        const dot = step.querySelector('[data-dot]')
        const content = step.querySelector('[data-content]')
        const number = step.querySelector('[data-number]')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 75%', once: true },
        })

        if (dot) {
          tl.from(dot, { scale: 0, duration: 0.4, ease: 'back.out(3)' }, 0)
        }
        if (number) {
          tl.from(number, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0.1)
        }
        if (content) {
          const isRight = step.dataset.side === 'right'
          tl.from(content, { x: isRight ? 60 : -60, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.15)
        }
      })

      // Closing quote
      const quoteEl = sectionRef.current.querySelector('[data-quote]')
      if (quoteEl) {
        gsap.from(quoteEl, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: quoteEl, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [pathD])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-40">
      <div ref={wrapRef} className="relative mx-auto max-w-[1100px]">
        {/* Winding route (desktop) — traced through the real dot positions */}
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          viewBox={viewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {pathD && (
            <>
              <path d={pathD} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path
                ref={routeRef}
                d={pathD}
                fill="none"
                stroke="#AEEE2D"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                ref={travelerRef}
                r="6"
                fill="#AEEE2D"
                style={{ filter: 'drop-shadow(0 0 8px rgba(174, 238, 45, 0.85))' }}
              />
            </>
          )}
        </svg>

        {/* Left rail (mobile) */}
        <div data-rail className="absolute left-[10px] top-0 h-full w-px bg-white/10 md:hidden">
          <div data-rail-fill className="h-full w-full origin-top scale-y-0 bg-lime" />
        </div>

        <ol className="space-y-16 md:space-y-14">
          {steps.map((step, i) => {
            const right = i % 2 === 1
            return (
              <li
                key={step.n}
                data-step
                data-side={right ? 'right' : 'left'}
                className="relative grid grid-cols-1 md:grid-cols-2 md:gap-16"
              >
                <span
                  ref={(el) => (dotRefs.current[i] = el)}
                  data-dot
                  className={`absolute left-[6px] top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-lime ring-4 ring-ink ${
                    right ? 'md:left-[94%]' : 'md:left-[6%]'
                  }`}
                />

                <div
                  data-content
                  className={`pl-8 md:pl-0 ${
                    right ? 'md:col-start-2 md:pl-16' : 'md:col-start-1 md:pr-16 md:text-right'
                  }`}
                >
                  <p className={`text-xs font-bold uppercase tracking-[0.28em] text-lime ${right ? '' : 'md:text-right'}`}>
                    Stage
                  </p>
                  <div className={`mt-1 flex items-baseline gap-4 ${right ? '' : 'md:justify-end'}`}>
                    <span
                      data-number
                      className="font-bold leading-none tracking-tightest text-lime [font-size:clamp(3rem,7vw,5.5rem)]"
                    >
                      {step.n}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight tracking-tight text-paper md:text-3xl">
                      {step.title}
                    </h3>
                  </div>
                  <p className={`mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base ${right ? '' : 'md:ml-auto'}`}>
                    {step.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <blockquote data-quote className="mx-auto mt-32 max-w-3xl border-l-2 border-lime pl-6 text-center md:mt-40 md:border-l-0 md:pl-0">
          <p className="text-2xl font-bold leading-snug tracking-tight text-paper md:text-4xl">
            “{quote}”
          </p>
          <cite className="mt-5 block text-sm not-italic font-semibold uppercase tracking-[0.2em] text-lime">
            {attribution}
          </cite>
        </blockquote>
      </div>
    </section>
  )
}
