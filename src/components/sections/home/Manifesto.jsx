import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { home } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const { tags, manifesto, ghost } = home
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Panel scales up from 0.85 and fades in on scroll
      const panel = sectionRef.current.querySelector('[data-panel]')
      gsap.from(panel, {
        scale: 0.85,
        opacity: 0,
        borderRadius: '4rem',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      // Tags fly in from different directions
      const tagEls = sectionRef.current.querySelectorAll('[data-tag]')
      gsap.from(tagEls, {
        y: 30,
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      // Conviction quote image scales in with a slight rotation
      const quoteImg = sectionRef.current.querySelector('[data-quote]')
      if (quoteImg) {
        gsap.from(quoteImg, {
          scale: 0.7,
          opacity: 0,
          rotateZ: -3,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteImg,
            start: 'top 80%',
            once: true,
          },
        })
      }

      // Ghost text fades in once, then the marquee track runs continuously via CSS —
      // a pure looping animation, entirely independent of scroll position.
      const ghostWrap = sectionRef.current.querySelector('[data-ghost-wrap]')
      if (ghostWrap) {
        gsap.from(ghostWrap, {
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ghostWrap,
            start: 'top 90%',
            once: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="px-6 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-[1400px]">
        <div data-panel className="relative overflow-hidden rounded-[2.5rem] bg-olive px-6 py-10 md:px-20 md:py-16">
          {/* Background video — scoped to this card only */}
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src="/videos/manifesto-bg.mp4"
            poster="/videos/manifesto-bg-poster.jpg"
            preload="metadata"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
          {/* Tint so the olive brand color + text stay legible over the footage */}
          <div className="pointer-events-none absolute inset-0 bg-olive/70" />

          {/* Content sits in its own stacking layer, above the video + tint */}
          <div className="relative z-10">
            {/* Discipline tags */}
            <div className="mb-16 flex flex-wrap justify-center gap-x-14 gap-y-3 text-paper/85">
              {tags.map((t) => (
                <span key={t} data-tag className="text-sm font-medium tracking-wide md:text-base">
                  {t}
                </span>
              ))}
            </div>

            {/* Conviction statement */}
            <blockquote className="mx-auto max-w-3xl text-center">
              <img
                data-quote
                src="/images/7.webp"
                alt="Great brands aren't built on logos. They're built on conviction and we bring both."
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-xl"
              />
              <footer className="mt-10 text-sm text-paper/60">{manifesto.attribution}</footer>
            </blockquote>

            {/* Ghost text — continuous one-direction marquee, independent of scroll */}
            <div data-ghost-wrap className="pointer-events-none mt-20 overflow-hidden">
              <div className="animate-marquee flex w-max whitespace-nowrap">
                <p className="display-ghost mr-8 uppercase text-black/45">{ghost}</p>
                <p aria-hidden="true" className="display-ghost mr-8 uppercase text-black/45">
                  {ghost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
