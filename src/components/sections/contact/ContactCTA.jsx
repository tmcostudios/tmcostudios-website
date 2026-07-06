import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { contact } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function ContactCTA() {
  const { closing } = contact
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const content = sectionRef.current.querySelector('[data-content]')
      gsap.from(content, {
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: content, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-32">
      <div
        data-content
        className="mx-auto max-w-[1000px] rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center md:p-16"
      >
        <h2 className="text-3xl font-bold leading-[1.1] tracking-tightest text-paper md:text-5xl">
          {closing.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          {closing.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#enquiry-form"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 text-base font-medium tracking-tight text-ink transition-colors duration-300 hover:bg-lime-soft"
          >
            {closing.primaryCta}
          </a>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-medium tracking-tight text-paper transition-colors duration-300 hover:border-lime hover:text-lime"
          >
            {closing.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
