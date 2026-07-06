import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { brand } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

const ADDRESS = brand.address

export default function ContactMap() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const map = sectionRef.current.querySelector('[data-map]')
      gsap.from(map, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: map, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Our Location</p>
        <h2 className="mt-4 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-paper md:text-3xl">
          {ADDRESS}
        </h2>

        <div
          data-map
          className="mt-10 overflow-hidden rounded-2xl border border-white/10"
        >
          <iframe
            title="TM & Co. Studios location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            className="h-[380px] w-full grayscale invert-[0.92] contrast-[1.05] md:h-[440px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime transition-colors hover:text-lime-soft"
        >
          Get directions →
        </a>
      </div>
    </section>
  )
}
