import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { servicesPage } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function CoreServices() {
  const { heading, list } = servicesPage
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const headingEl = sectionRef.current.querySelector('[data-heading]')
      gsap.from(headingEl, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: headingEl, start: 'top 85%', once: true },
      })

      // Center rail fills in as you scroll
      const rail = sectionRef.current.querySelector('[data-rail]')
      const railFill = sectionRef.current.querySelector('[data-rail-fill]')
      if (rail && railFill) {
        gsap.to(railFill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: rail, start: 'top 65%', end: 'bottom 75%', scrub: 1 },
        })
      }

      // Dots pop onto the line as you scroll to them. Cards themselves are
      // left alone (no opacity/transform entrance) — always fully visible,
      // never at the mercy of a scroll-trigger that could stall mid-fade.
      const dots = sectionRef.current.querySelectorAll('[data-dot]')
      const olEl = sectionRef.current.querySelector('ol')

      if (olEl && dots.length) {
        gsap.from(dots, {
          scale: 0,
          duration: 0.4,
          stagger: 0.12,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: olEl, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 data-heading className="text-center text-3xl font-bold leading-[1.1] tracking-tightest md:text-5xl">
          {heading}
        </h2>

        <div className="relative mx-auto mt-20 max-w-[1000px] md:mt-24">
          {/* Straight center rail (desktop) */}
          <div data-rail className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block">
            <div data-rail-fill className="h-full w-full origin-top scale-y-0 bg-lime" />
          </div>
          {/* Left rail (mobile) */}
          <div className="absolute left-[10px] top-0 h-full w-px bg-white/10 md:hidden">
            <div data-rail-fill className="h-full w-full origin-top scale-y-0 bg-lime" />
          </div>

          <ol className="space-y-10 md:space-y-16">
            {list.map((service, i) => {
              const right = i % 2 === 1
              const active = activeIndex === i
              return (
                <li
                  key={service.n}
                  data-item
                  data-side={right ? 'right' : 'left'}
                  className="relative grid grid-cols-1 items-center md:grid-cols-2 md:gap-16"
                >
                  <span
                    data-dot
                    className="absolute left-[10px] top-8 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-lime ring-4 ring-ink md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                  />

                  <div
                    className={`pl-10 md:pl-0 ${right ? 'md:col-start-2 md:pl-16' : 'md:col-start-1 md:pr-16'}`}
                  >
                    {/* A real button so tapping works on touch devices, not just
                        CSS :hover which never fires on mobile. Click always
                        *opens* this card (never toggles it closed) — some mobile
                        browsers fire a simulated hover right before the click on
                        first tap, which made toggle logic instantly close it again. */}
                    <button
                      type="button"
                      data-card
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex((cur) => (cur === i ? -1 : cur))}
                      onClick={() => setActiveIndex(i)}
                      aria-expanded={active}
                      className={`group relative w-full overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ease-out md:p-7 ${
                        active
                          ? '-translate-y-1 scale-[1.02] border-lime/40 bg-white/[0.04] shadow-[0_20px_60px_-15px_rgba(174,238,45,0.25)]'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      {/* Ghost numeral */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute -bottom-6 -right-2 select-none font-black leading-none transition-colors duration-500 ${
                          active ? 'text-lime/[0.08]' : 'text-white/[0.04]'
                        }`}
                        style={{ fontSize: '6rem' }}
                      >
                        {service.n}
                      </span>

                      <div className="relative z-10 flex items-baseline gap-4">
                        <span className="text-sm font-bold tracking-[0.2em] text-lime">{service.n}</span>
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-paper md:text-2xl">
                          {service.title}
                        </h3>
                      </div>

                      {/* Tags + description expand in place on hover (desktop) or tap (touch) */}
                      <div
                        className="relative z-10 grid transition-[grid-template-rows] duration-500 ease-out"
                        style={{ gridTemplateRows: active ? '1fr' : '0fr' }}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-lime/70">
                            {service.tags}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                            {service.body}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
