import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { process as processContent } from '../../../data/content'
import splitWords from '../../../utils/splitWords'

gsap.registerPlugin(ScrollTrigger)

export default function ProcessHero() {
  const { hero } = processContent
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      const sub = sectionRef.current.querySelector('[data-sub]')
      tl.from(sub, { x: -40, opacity: 0, duration: 0.8 }, 0.2)

      const headlineEl = sectionRef.current.querySelector('[data-headline]')
      const headlineLines = headlineEl.querySelectorAll('[data-hline]')
      headlineLines.forEach((line, li) => {
        const chars = splitWords(line)
        tl.from(
          chars,
          { yPercent: 120, rotateX: 40, opacity: 0, duration: 0.8, stagger: 0.02 },
          0.3 + li * 0.1
        )
      })

      const body = sectionRef.current.querySelector('[data-body]')
      tl.from(body, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')

      const canvasWrap = sectionRef.current.querySelector('[data-canvas]')
      if (canvasWrap) {
        gsap.to(canvasWrap, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
      {/* Theme background — grid texture + soft lime glow, non-interactive */}
      <div
        data-canvas
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[70vh] md:h-[85vh]"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #F4F4F0 1px, transparent 1px), linear-gradient(to bottom, #F4F4F0 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          className="absolute -right-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #AEEE2D, transparent 70%)' }}
        />
        <div
          className="absolute -left-1/4 top-1/3 h-[45vh] w-[45vh] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #d8d8d2, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4 md:pt-6">
            <p data-sub className="max-w-xs text-sm font-semibold leading-[1.7] text-lime">
              {hero.sub}
            </p>
            <p data-body className="mt-6 max-w-xs text-base leading-relaxed text-muted">
              {hero.body}
            </p>
          </div>

          <div className="md:col-span-8">
            <h1
              data-headline
              className="text-5xl font-bold leading-[0.95] tracking-tightest md:text-7xl"
              style={{ perspective: '600px' }}
            >
              <span data-hline className="block text-paper">{hero.line1}</span>
              <span data-hline className="block text-lime">{hero.accent}</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
