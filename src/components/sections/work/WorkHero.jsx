import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { work } from '../../../data/content'
import splitWords from '../../../utils/splitWords'

gsap.registerPlugin(ScrollTrigger)

// Height per column/row position — ascends left to right so the columns
// read as a continuous staircase, bottom-aligned.
const columnHeights = [
  ['h-32', 'h-44', 'h-56'],
  ['h-44', 'h-56', 'h-64'],
  ['h-56', 'h-64', 'h-80'],
]

function chunkIntoColumns(items, cols) {
  const size = Math.ceil(items.length / cols)
  return Array.from({ length: cols }, (_, c) => items.slice(c * size, c * size + size)).filter(
    (col) => col.length > 0
  )
}

export default function WorkHero() {
  const { hero, filters, projects } = work
  const [active, setActive] = useState('All')
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)

  const filtered =
    active === 'All' ? projects : projects.filter((p) => p.cat === active)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      // Eyebrow disclosure line
      const eyebrow = sectionRef.current.querySelector('[data-eyebrow]')
      if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.5 }, 0)

      // Headline word-aware char split
      const lines = headlineRef.current.querySelectorAll('[data-line]')
      lines.forEach((line, li) => {
        const chars = splitWords(line)
        tl.from(
          chars,
          { yPercent: 120, rotateX: 50, opacity: 0, duration: 0.8, stagger: 0.02 },
          0.1 + li * 0.1
        )
      })

      // Sub text
      const sub = sectionRef.current.querySelector('[data-sub]')
      tl.from(sub, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')

      // Filters stagger
      const filterBtns = sectionRef.current.querySelectorAll('[data-filter]')
      tl.from(filterBtns, {
        y: 15,
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Animate cards when filter changes
  const gridRef = useRef(null)
  useEffect(() => {
    if (!gridRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = gridRef.current.querySelectorAll('[data-project]')
    gsap.from(cards, {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
      clearProps: 'all',
    })
  }, [active])

  return (
    <section ref={sectionRef} className="px-6 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1400px]">
        <p data-eyebrow className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-lime">
          {hero.eyebrow}
        </p>
        <h1
          ref={headlineRef}
          className="text-5xl font-bold leading-[1.02] tracking-tightest md:text-7xl"
          style={{ perspective: '600px' }}
        >
          <span data-line className="block">{hero.line1}</span>
          <span data-line className="mt-4 inline-block rounded-full border border-lime/60 px-6 py-2 text-lime">
            {hero.line2}
          </span>
        </h1>
        <p data-sub className="mt-9 max-w-xl text-base leading-[1.7] text-muted md:text-lg">{hero.sub}</p>

        <div className="mt-12 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              data-filter
              onClick={() => setActive(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                active === f
                  ? 'bg-lime text-ink'
                  : 'text-muted hover:text-paper'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="mt-16 flex items-end gap-4">
          {chunkIntoColumns(filtered, 3).map((col, ci) => (
            <div key={ci} className="flex flex-1 flex-col justify-end gap-4">
              {col.map((p, ri) => (
                <article
                  key={p.title}
                  data-project
                  className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl p-5 ring-1 ring-inset ring-white/8 bg-white/[0.03] transition-transform duration-300 hover:-translate-y-1.5 ${columnHeights[ci % columnHeights.length][ri % 3]}`}
                >
                  <span className="pointer-events-none absolute inset-0 bg-lime/0 transition-colors duration-500 group-hover:bg-lime/[0.05]" />
                  <span className="relative text-xs uppercase tracking-[0.2em] text-lime/80">
                    {p.cat}
                  </span>
                  <h3 className="relative mt-1 text-lg font-bold tracking-tight text-paper">
                    {p.title}
                  </h3>
                  <p className="relative mt-1 text-xs text-muted">{p.tone}</p>
                  <span className="relative mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-lime/70 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    Concept exploration
                  </span>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
