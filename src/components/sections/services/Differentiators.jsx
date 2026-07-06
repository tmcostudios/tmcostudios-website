import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { servicesPage } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function Differentiators() {
  const { differentiatorsHeading, differentiators } = servicesPage
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const heading = sectionRef.current.querySelector('[data-heading]')
      gsap.from(heading, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      })

      const cards = sectionRef.current.querySelectorAll('[data-value]')
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: cards[0]?.parentElement, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div data-heading className="max-w-2xl">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tightest md:text-5xl">
            {differentiatorsHeading}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {differentiators.map((d) => (
            <div
              key={d.title}
              data-value
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-lime/40 md:p-9"
            >
              <span className="text-sm font-bold tracking-[0.2em] text-lime">—</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-paper md:text-2xl">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
