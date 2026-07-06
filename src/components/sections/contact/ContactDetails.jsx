import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function ContactDetails() {
  const { details } = contact
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll('[data-detail]')
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: cards[0]?.parentElement, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((d) => (
            <div
              key={d.label}
              data-detail
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-lime/40"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">{d.label}</p>
              {d.href ? (
                <a
                  href={d.href}
                  target={d.href.startsWith('http') ? '_blank' : undefined}
                  rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-4 block text-lg font-bold tracking-tight text-paper transition-colors hover:text-lime"
                >
                  {d.value}
                </a>
              ) : (
                <p className="mt-4 text-lg font-bold tracking-tight text-paper">{d.value}</p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
