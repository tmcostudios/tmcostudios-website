import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marquee from '../../Marquee'
import { work } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

export default function Concert() {
  const { pullScript, pullBold, concert } = work
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Circles grow from zero
      const circles = sectionRef.current.querySelectorAll('[data-circle]')
      gsap.from(circles, {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: circles[0]?.parentElement,
          start: 'top 75%',
          once: true,
        },
      })

      // Circles float on scroll
      circles.forEach((circle, i) => {
        gsap.to(circle, {
          y: -20 - i * 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        })
      })

      // Concert text
      const textEl = sectionRef.current.querySelector('[data-concert]')
      if (textEl) {
        gsap.from(textEl, {
          x: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: textEl, start: 'top 80%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-40">
      <div className="mb-10">
        <Marquee speed={32} className="border-y border-white/5 py-6">
          <span className="px-8 font-script text-4xl text-lime md:text-6xl">
            {pullScript}
          </span>
          <span className="px-8 text-3xl font-bold tracking-tight text-paper md:text-5xl">
            {pullBold}
          </span>
        </Marquee>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:px-10 md:gap-16">
        <div className="md:col-span-7">
          <div className="flex items-center">
            <div
              data-circle
              className="h-[260px] w-[260px] flex-shrink-0 rounded-full bg-[url('/images/circle-inside-1.webp')] bg-cover bg-center md:h-[320px] md:w-[320px]"
            />
            <div
              data-circle
              className="ml-5 h-[200px] w-[110px] flex-shrink-0 rounded-l-full bg-[url('/images/circle-inside-2.webp')] bg-[length:427px_349px] bg-[position:-170px_-77px] md:h-[250px] md:w-[130px] md:bg-[length:534px_436px] md:bg-[position:-212px_-96px]"
            />
            <div
              data-circle
              className="ml-5 h-[140px] w-[70px] flex-shrink-0 rounded-l-full bg-[url('/images/circle-inside-3.webp')] bg-cover bg-center md:h-[180px] md:w-[90px]"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <p data-concert className="text-lg font-medium leading-relaxed text-paper md:text-xl">
            {concert.split('work in concert')[0]}
            <span className="text-lime">work in concert</span>
            {concert.split('work in concert')[1]}
          </p>
        </div>
      </div>
    </section>
  )
}
