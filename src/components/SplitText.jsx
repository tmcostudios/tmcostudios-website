import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SplitText({
  children,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.03,
  scrollTrigger = false,
  y = 60,
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const text = ref.current.textContent
    ref.current.innerHTML = ''
    ref.current.style.display = 'inline-block'

    const chars = text.split('').map((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? ' ' : char
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'
      ref.current.appendChild(span)
      return span
    })

    const config = {
      y,
      opacity: 0,
      rotateX: 40,
      duration: 0.8,
      stagger,
      delay,
      ease: 'power3.out',
    }

    if (scrollTrigger) {
      gsap.from(chars, {
        ...config,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      })
    } else {
      gsap.from(chars, config)
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === ref.current) t.kill()
      })
    }
  }, [children, delay, stagger, scrollTrigger, y])

  return (
    <Tag ref={ref} className={className} style={{ perspective: '500px' }}>
      {children}
    </Tag>
  )
}
