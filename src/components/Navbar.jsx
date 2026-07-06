import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { nav } from '../data/content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-ink/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-10 md:py-7">
        <Logo className="text-xl md:text-2xl" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <li key={item.label}>
              <NavItem item={item} active={pathname === item.to} />
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-6 bg-paper"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="block h-[2px] w-6 bg-paper"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-6 bg-paper"
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/5 bg-ink/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-6">
              {nav.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <MobileLink item={item} onClick={() => setOpen(false)} />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function NavItem({ item, active }) {
  const cls =
    'group relative text-sm font-medium tracking-tight text-paper/80 transition-colors duration-300 hover:text-paper'
  const underline = (
    <span
      className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-lime transition-transform duration-300 group-hover:scale-x-100 ${
        active ? 'scale-x-100' : ''
      }`}
    />
  )
  if (item.to.startsWith('#')) {
    return (
      <a href={item.to} className={cls}>
        {item.label}
        {underline}
      </a>
    )
  }
  return (
    <Link to={item.to} className={`${cls} ${active ? 'text-paper' : ''}`}>
      {item.label}
      {underline}
    </Link>
  )
}

function MobileLink({ item, onClick }) {
  const cls =
    'block py-3 text-3xl font-semibold tracking-tightest text-paper transition-colors hover:text-lime'
  if (item.to.startsWith('#')) {
    return (
      <a href={item.to} onClick={onClick} className={cls}>
        {item.label}
      </a>
    )
  }
  return (
    <Link to={item.to} onClick={onClick} className={cls}>
      {item.label}
    </Link>
  )
}
