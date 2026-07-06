import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { home, cta } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function Sectors() {
  const { sectors } = home
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Heading slides up
      const heading = sectionRef.current.querySelector('[data-heading]')
      gsap.from(heading, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
      })

      // Sector pills: wave stagger from bottom-left
      const pills = sectionRef.current.querySelectorAll('[data-pill]')
      gsap.from(pills, {
        y: 40,
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: {
          each: 0.06,
          from: 'start',
        },
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: pills[0]?.parentElement, start: 'top 85%', once: true },
      })

      // Magnetic hover on pills
      pills.forEach((pill) => {
        const handleMove = (e) => {
          const rect = pill.getBoundingClientRect()
          const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25
          const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25
          gsap.to(pill, { x, y, duration: 0.3, ease: 'power2.out' })
        }
        const handleLeave = () => {
          gsap.to(pill, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
        }
        const handleEnter = () => {
          gsap.to(pill, { scale: 1.05, duration: 0.2, ease: 'power2.out' })
        }
        pill.addEventListener('mousemove', handleMove)
        pill.addEventListener('mouseleave', handleLeave)
        pill.addEventListener('mouseenter', handleEnter)
      })

      // CTA block fade-up
      const ctaEl = sectionRef.current.querySelector('[data-cta]')
      if (ctaEl) {
        gsap.from(ctaEl, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaEl, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-24 md:px-10 md:py-40">
      <div className="relative mx-auto max-w-[1400px]">
        <div className="relative">
          <h2 data-heading className="relative z-10 flex flex-col gap-1 leading-[0.95] tracking-tightest">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <img src="/images/built-for.png" alt="Built for" className="h-7 w-auto md:h-11" />
              <img src="/images/ambition.png" alt="Ambition," className="h-9 w-auto md:h-14" />
            </span>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <img src="/images/across.png" alt="Across" className="h-7 w-auto md:h-11" />
              <img src="/images/any.png" alt="Any" className="h-9 w-auto md:h-14" />
              <img src="/images/sector.png" alt="Sector." className="h-9 w-auto md:h-14" />
            </span>
          </h2>

          <div className="relative z-10 mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector) => (
              <div
                key={sector}
                data-pill
                className="pill w-full cursor-default px-6 py-3 text-paper/85 transition-colors duration-300 hover:bg-lime/5 hover:text-lime"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>

        <div data-cta className="relative z-10 mt-24 text-center md:mt-32">
          <img
            src="/images/cta-heading.png"
            alt={cta.scriptHeading}
            className="mx-auto h-10 w-auto md:h-16"
          />
          <p className="mt-5 text-base leading-relaxed text-paper/85 md:text-lg">
            {cta.body} <span className="text-lime">{cta.accent}</span>
          </p>
        </div>

        <img
          src="/images/wordmark-watermark.png"
          alt=""
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 w-full max-w-none translate-y-1/3 brightness-[0.28] saturate-150"
        />
      </div>
    </section>
  )
}
