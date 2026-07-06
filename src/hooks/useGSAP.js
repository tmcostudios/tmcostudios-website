import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGSAP(callback, deps = []) {
  const scope = useRef(null)

  useEffect(() => {
    if (!scope.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      callback(scope.current)
    }, scope)

    return () => ctx.revert()
  }, deps)

  return scope
}

export { gsap, ScrollTrigger }
