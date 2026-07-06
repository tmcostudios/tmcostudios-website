import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { servicesPage } from '../../../data/content'
import splitWords from '../../../utils/splitWords'

gsap.registerPlugin(ScrollTrigger)

export default function ServicesHero() {
  const { hero } = servicesPage
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
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
