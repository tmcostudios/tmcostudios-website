import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Landing from './components/Landing'
import Home from './pages/Home'
import Work from './pages/Work'
import Services from './pages/Services'
import Process from './pages/Process'
import Contact from './pages/Contact'
import About from './pages/About'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop({ lenisRef }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  }, [pathname, hash, lenisRef])
  return null
}

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()
  const lenisRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  // Show preloader only on first mount (not on SPA route changes)
  const [preloaderDone, setPreloaderDone] = useState(false)
  // Splash landing shown once, right after the preloader, before the real site
  const [entered, setEntered] = useState(false)

  // Lenis smooth scroll — initialised once, destroyed on unmount
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Keep GSAP ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tickFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickFn)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Refresh ScrollTrigger on route change
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [location.pathname])

  return (
    <>
      {entered && (
        <>
          {/* Ambient background image — fixed, translucent, sits behind all content */}
          <div
            aria-hidden
            className="fixed inset-0 z-0 bg-cover bg-center opacity-[0.09] mix-blend-screen"
            style={{ backgroundImage: "url('/images/5.png')" }}
          />
          {/* Fade the ambient image toward the edges so it never competes with content */}
          <div
            aria-hidden
            className="fixed inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_30%,transparent_0%,#1A1A18_85%)]"
          />
        </>
      )}

      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <AnimatePresence>
        {preloaderDone && !entered && (
          <Landing key="landing" onEnter={() => setEntered(true)} />
        )}
      </AnimatePresence>

      {entered && (
        <>
          {/* Scroll-progress bar */}
          <motion.div
            style={{ scaleX: progress }}
            className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-lime"
          />

          <Navbar />
          <ScrollToTop lenisRef={lenisRef} />

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Page><Home /></Page>} />
              <Route path="/about" element={<Page><About /></Page>} />
              <Route path="/work" element={<Page><Work /></Page>} />
              <Route path="/services" element={<Page><Services /></Page>} />
              <Route path="/process" element={<Page><Process /></Page>} />
              <Route path="/contact" element={<Page><Contact /></Page>} />
              <Route path="*" element={<Page><Home /></Page>} />
            </Routes>
          </AnimatePresence>

          <Footer />
        </>
      )}

      {/* Film-grain overlay — very subtle texture for depth */}
      <div aria-hidden className="grain-overlay" />
    </>
  )
}
