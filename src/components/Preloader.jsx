import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { brand } from '../data/content'
import Logo from './Logo'

export default function Preloader({ onComplete }) {
  const topRef = useRef(null)
  const bottomRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const obj = { val: 0 }
    const tl = gsap.timeline()

    // Kept brisk — this is pure loading time with no interactive value, so it
    // stays well under the ~1.5s ceiling recommended for a first-visit gate.
    tl.to(obj, {
      val: 100,
      duration: 0.8,
      ease: 'power1.inOut',
      onUpdate() {
        const v = Math.floor(obj.val)
        if (lineRef.current) {
          lineRef.current.style.transform = `scaleX(${v / 100})`
        }
      },
    })

    tl.to({}, { duration: 0.08 })

    tl.to(
      [topRef.current, bottomRef.current],
      {
        yPercent: (i) => (i === 0 ? -100 : 100),
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete() {
          document.body.style.overflow = ''
          onComplete?.()
        },
      },
      '>'
    )

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9998] flex flex-col"
      style={{ isolation: 'isolate' }}
    >
      {/* Top panel */}
      <div ref={topRef} className="relative flex h-1/2 w-full flex-col justify-end bg-ink">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-6 md:px-10">
          <div className="flex items-end justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-paper/25">
              {brand.legalName}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-paper/15">
              Branding &amp; Marketing Studio
            </span>
          </div>
        </div>
        <div className="h-px w-full bg-white/[0.05]" />
      </div>

      {/* Bottom panel */}
      <div ref={bottomRef} className="flex h-1/2 w-full flex-col justify-between bg-ink pb-8 pt-5">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <Logo className="pointer-events-none select-none" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }} />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="h-px w-full overflow-hidden bg-white/[0.07]">
            <div
              ref={lineRef}
              className="h-full origin-left bg-lime"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
