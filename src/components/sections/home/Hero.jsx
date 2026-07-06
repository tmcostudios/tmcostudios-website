import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { home } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

/*
  Layout is rebuilt from the exact Figma composition (MacBook Pro 14 frame, 1512 wide).
  Instead of absolutely positioning every element, the four photos + headline + intro
  are placed on a 3-column CSS Grid whose column tracks and image aspect-ratios are the
  Figma measurements. Because the tracks are `fr` and every image keeps its own
  aspect-ratio, the whole composition scales proportionally with the viewport while the
  images render at their exact Figma pixel sizes at the design width — no `top/left`.

  Figma content region spans x:95 → 1432 (1337 wide). The three column tracks keep the
  Figma center-column width (463) but use equal side tracks (437 each, the average of
  Figma's 431/443) so the center column — and the headline centered in it — lands exactly
  on the composition's horizontal center, with balanced gaps to the left/right images.
*/

// Photo aspect-ratios + how wide each sits inside its column (from the Figma numbers).
const PHOTOS = {
  leftTop: { src: '/images/home-1st.webp', alt: 'Creative design studio', ratio: '257 / 216.54' },
  leftBottom: { src: '/images/home-2nd.webp', alt: 'Workshop and strategy session', ratio: '431 / 254' },
  rightTop: { src: '/images/home-3rd.webp', alt: 'Team collaboration', ratio: '443 / 305' },
  rightBottom: { src: '/images/home-4th.webp', alt: 'Immersive technology', ratio: '417 / 213' },
}

// The headline is a collage of tightly-cropped word images. They overlap, so they are
// positioned relative to a single box sized to the Figma text bounds (x:588→924 y:377→619).
const HEADLINE_BOX = { left: 588, top: 377, width: 336, height: 242 }

const WORDS = [
  { id: 'we-build', src: '/images/word-we-build.png', boxLeft: 626, boxTop: 377, boxWidth: 96, boxHeight: 55, imgWidth: 97, imgHeight: 35 },
  { id: 'brands', src: '/images/word-brands.png', boxLeft: 588, boxTop: 397, boxWidth: 198, boxHeight: 99, imgWidth: 193, imgHeight: 44 },
  { id: 'that', src: '/images/word-that.png', boxLeft: 688, boxTop: 446, boxWidth: 116, boxHeight: 99, imgWidth: 113, imgHeight: 44 },
  { id: 'refuse', src: '/images/word-refuse.png', boxLeft: 588, boxTop: 483, boxWidth: 177, boxHeight: 99, imgWidth: 172, imgHeight: 46 },
  { id: 'to-be', src: '/images/word-to-be.png', boxLeft: 780, boxTop: 511, boxWidth: 49, boxHeight: 55, imgWidth: 54, imgHeight: 27 },
  { id: 'ignored', src: '/images/word-ignored.png', boxLeft: 698, boxTop: 520, boxWidth: 226, boxHeight: 99, imgWidth: 221, imgHeight: 59 },
].map((w) => {
  // Center each cropped word inside its Figma text-box, then express as % of HEADLINE_BOX.
  const left = w.boxLeft + (w.boxWidth - w.imgWidth) / 2
  const top = w.boxTop + (w.boxHeight - w.imgHeight) / 2
  return {
    id: w.id,
    src: w.src,
    leftPct: `${((left - HEADLINE_BOX.left) / HEADLINE_BOX.width) * 100}%`,
    topPct: `${((top - HEADLINE_BOX.top) / HEADLINE_BOX.height) * 100}%`,
    widthPct: `${(w.imgWidth / HEADLINE_BOX.width) * 100}%`,
    heightPct: `${(w.imgHeight / HEADLINE_BOX.height) * 100}%`,
  }
})

function Photo({ photo, style, className = '' }) {
  return (
    <figure
      data-photo
      className={`m-0 overflow-hidden rounded-2xl ${className}`}
      style={{ clipPath: 'inset(0 0 0 0)', ...style }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </figure>
  )
}

function Headline({ className = '', style }) {
  return (
    <h1 className={`relative m-0 ${className}`} style={style}>
      <span className="sr-only">We build brands that refuse to be ignored.</span>
      {WORDS.map((word) => (
        <img
          key={word.id}
          data-word
          src={word.src}
          alt=""
          aria-hidden="true"
          className="absolute"
          style={{ left: word.leftPct, top: word.topPct, width: word.widthPct, height: word.heightPct }}
        />
      ))}
    </h1>
  )
}

export default function Hero() {
  const { intro } = home
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      const words = sectionRef.current.querySelectorAll('[data-word]')
      tl.from(words, { yPercent: 130, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)

      const images = sectionRef.current.querySelectorAll('[data-photo]')
      tl.from(
        images,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.25, duration: 1.3, stagger: 0.12, ease: 'power3.inOut' },
        0.3
      )

      const introEls = sectionRef.current.querySelectorAll('[data-intro]')
      if (introEls.length) {
        tl.from(introEls, { y: 40, opacity: 0, duration: 0.8 }, '-=0.6')
      }

      images.forEach((img, i) => {
        gsap.to(img, {
          yPercent: -6 - i * 3,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
        })
      })

      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          yPercent: -8,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: 1 },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden pt-16 lg:pt-20">
      <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[60vh] w-[60vh] rounded-full bg-olive/20 blur-[120px]" />

      {/* Desktop / laptop: responsive 3-column grid matching the Figma composition. */}
      <div
        ref={canvasRef}
        className="mx-auto hidden grid-cols-[437fr_463fr_437fr] items-start pb-6 lg:grid"
        style={{
          width: 'min(88vw, 1220px)',
          columnGap: 0,
          rowGap: 'clamp(0.6rem, 1.3vw, 1.4rem)',
        }}
      >
        {/* Left top image — narrower than its column, indented and dropped slightly
            (Figma top 229 vs the right image's 186). */}
        <Photo
          photo={PHOTOS.leftTop}
          style={{
            gridColumn: 1,
            gridRow: 1,
            width: '59.6%',
            marginLeft: '11.6%',
            marginTop: 'clamp(0.5rem, 2.7vw, 2.6rem)',
            aspectRatio: PHOTOS.leftTop.ratio,
            transform: 'translateX(-1rem)',
          }}
        />

        {/* Right top image — fills its column. */}
        <Photo
          photo={PHOTOS.rightTop}
          style={{
            gridColumn: 3,
            gridRow: 1,
            width: '100%',
            aspectRatio: PHOTOS.rightTop.ratio,
            transform: 'translateX(1.25rem)',
          }}
        />

        {/* Headline collage — centered in the middle column, spanning all rows. */}
        <Headline
          className="self-center justify-self-center"
          style={{ gridColumn: 2, gridRow: '1 / 4', width: '72.6%', aspectRatio: `${HEADLINE_BOX.width} / ${HEADLINE_BOX.height}` }}
        />

        {/* Intro paragraph — sits under the left top image, between the two left photos. */}
        <div data-intro className="self-center" style={{ gridColumn: 1, gridRow: 2, width: '93%', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
          <p className="text-white" style={{ fontSize: 'clamp(0.78rem, 0.92vw, 1rem)', lineHeight: 1.6 }}>
            {intro}
          </p>
        </div>

        {/* Left bottom image — fills its column, shifted left slightly. */}
        <Photo
          photo={PHOTOS.leftBottom}
          style={{
            gridColumn: 1,
            gridRow: 3,
            width: '100%',
            aspectRatio: PHOTOS.leftBottom.ratio,
            marginTop: '0.25rem',
            transform: 'translateX(-1.25rem)',
          }}
        />

        {/* Right bottom image — left-aligned, slightly narrower than its column. */}
        <Photo
          photo={PHOTOS.rightBottom}
          style={{
            gridColumn: 3,
            gridRow: 3,
            width: '94.1%',
            aspectRatio: PHOTOS.rightBottom.ratio,
            transform: 'translateX(1.25rem)',
          }}
        />
      </div>

      {/* Mobile / tablet: simple stacked layout */}
      <div className="mx-auto max-w-[640px] px-6 pb-16 lg:hidden">
        <div className="flex flex-col items-center gap-6 text-center">
          <Photo
            photo={PHOTOS.leftTop}
            className="w-full max-w-[260px]"
            style={{ aspectRatio: PHOTOS.leftTop.ratio }}
          />

          <Headline
            className="mx-auto w-full max-w-[360px]"
            style={{ aspectRatio: `${HEADLINE_BOX.width} / ${HEADLINE_BOX.height}` }}
          />

          <div data-intro className="max-w-[320px]">
            <p className="text-[0.95rem] leading-[1.7] text-white">{intro}</p>
          </div>

          <Photo photo={PHOTOS.leftBottom} className="w-full max-w-[380px]" style={{ aspectRatio: PHOTOS.leftBottom.ratio }} />
          <Photo photo={PHOTOS.rightTop} className="w-full max-w-[380px]" style={{ aspectRatio: PHOTOS.rightTop.ratio }} />
          <Photo photo={PHOTOS.rightBottom} className="w-full max-w-[380px]" style={{ aspectRatio: PHOTOS.rightBottom.ratio }} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col items-center gap-1 pb-4"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-muted">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-5 w-px bg-gradient-to-b from-lime to-transparent"
        />
      </motion.div>
    </section>
  )
}
