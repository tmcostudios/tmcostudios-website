import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function ContactFAQ() {
  const { faq } = contact
  const sectionRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(0)

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

      const items = sectionRef.current.querySelectorAll('[data-faq]')
      gsap.from(items, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: items[0]?.parentElement, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1000px]">
        <h2 data-heading className="text-3xl font-bold leading-[1.1] tracking-tightest md:text-5xl">
          Frequently asked questions
        </h2>

        <div className="mt-14 divide-y divide-white/10 border-t border-white/10">
          {faq.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q} data-faq>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={open}
                >
                  <span className="text-lg font-bold tracking-tight text-paper md:text-xl">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 text-lime transition-transform duration-300 ${
                      open ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
