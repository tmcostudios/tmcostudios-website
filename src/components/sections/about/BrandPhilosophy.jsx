import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function BrandPhilosophy() {
  const { philosophyHeading, philosophySub, values } = about
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
            {philosophyHeading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
            {philosophySub}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.n}
              data-value
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-lime/40 md:p-9"
            >
              <span className="text-sm font-bold tracking-[0.2em] text-lime">{v.n}</span>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-paper md:text-2xl">
                {v.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
