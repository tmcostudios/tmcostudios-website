import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 20,
  scale = 1.15,
}) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    if (!wrapRef.current || !imgRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, { scale })
      gsap.to(imgRef.current, {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [speed, scale])

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="h-full w-full object-cover will-change-transform"
      />
    </div>
  )
}
