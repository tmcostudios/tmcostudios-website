import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function StudioStory() {
  const { story } = about
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const paragraphs = sectionRef.current.querySelectorAll('[data-para]')
      gsap.from(paragraphs, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })

      const media = sectionRef.current.querySelector('[data-media]')
      if (media) {
        gsap.from(media, {
          x: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        })
      }

      const quote = sectionRef.current.querySelector('[data-quote]')
      if (quote) {
        gsap.from(quote, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: quote, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            {story.paragraphs.map((p, i) => (
              <p
                key={i}
                data-para
                className={`text-base leading-relaxed text-paper/85 md:text-lg ${i > 0 ? 'mt-6' : ''}`}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="md:col-span-5">
            <div
              data-media
              className="group relative overflow-hidden rounded-2xl bg-ink-2"
              style={{ aspectRatio: story.media.aspect }}
            >
              <img
                src={story.media.image}
                alt={story.media.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
                <span className="h-px w-5 bg-lime" />
                {story.media.label}
              </span>
            </div>
          </div>
        </div>

        <blockquote
          data-quote
          className="mt-20 border-l-2 border-lime pl-6 md:mt-28 md:pl-10"
        >
          <p className="text-2xl font-medium leading-[1.4] tracking-tight text-paper md:text-4xl">
            “{story.quote}”
          </p>
          <cite className="mt-5 block text-sm not-italic font-semibold uppercase tracking-[0.2em] text-lime">
            {story.attribution}
          </cite>
        </blockquote>
      </div>
    </section>
  )
}
