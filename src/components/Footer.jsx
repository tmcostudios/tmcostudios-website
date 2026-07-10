import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { brand, cta, home, services } from '../data/content'
import Logo from './Logo'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const blocks = footerRef.current.querySelectorAll('[data-footer-block]')
      gsap.from(blocks, {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 85%', once: true },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} id="contact" className="relative overflow-hidden bg-lime text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-12">
        <div data-footer-block className="mb-9">
          <Logo dark imgClassName="h-6 md:h-7" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[0.75fr_0.75fr_0.75fr_1.15fr] lg:gap-10">
          <div data-footer-block>
            <p className="text-[0.85rem] font-semibold tracking-[-0.03em] text-ink/70">Company:</p>
            <ul className="mt-4 space-y-2.5 text-[1rem] tracking-[-0.03em] text-ink/92">
              <li><Link to="/about" className="transition-colors hover:text-ink/70">About</Link></li>
              <li><Link to="/work" className="transition-colors hover:text-ink/70">Work</Link></li>
              <li><Link to="/services" className="transition-colors hover:text-ink/70">Services</Link></li>
              <li><Link to="/process" className="transition-colors hover:text-ink/70">Process</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-ink/70">Contact</Link></li>
            </ul>
          </div>

          <div data-footer-block>
            <p className="text-[0.85rem] font-semibold tracking-[-0.03em] text-ink/70">Services:</p>
            <ul className="mt-4 space-y-2.5 text-[1rem] tracking-[-0.03em] text-ink/92">
              {services.map((service) => (
                <li key={service.title}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div data-footer-block>
            <p className="text-[0.85rem] font-semibold tracking-[-0.03em] text-ink/70">Industries:</p>
            <ul className="mt-4 space-y-2.5 text-[1rem] tracking-[-0.03em] text-ink/92">
              {home.sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </div>

          <div data-footer-block>
            <p className="text-[0.85rem] font-semibold tracking-[-0.03em] text-ink/70">Get in touch:</p>
            <div className="mt-4 space-y-2 text-[0.95rem] tracking-[-0.03em] text-ink/80">
              <a
                href={`mailto:${brand.email}`}
                className="block transition-colors hover:text-ink"
              >
                {brand.email}
              </a>
              <a
                href={`tel:${brand.phoneRaw}`}
                className="block transition-colors hover:text-ink"
              >
                {brand.phone}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-[22rem] leading-snug transition-colors hover:text-ink"
              >
                {brand.address}
              </a>
            </div>

            <p className="mt-6 text-[0.85rem] font-semibold tracking-[-0.03em] text-ink/70">Subscribe to our news and updates</p>
            <form className="mt-3 max-w-[26rem]">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <div className="flex items-end gap-3 border-b border-ink/20 pb-2.5">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email here"
                  className="min-w-0 flex-1 bg-transparent text-[0.95rem] tracking-[-0.03em] text-ink placeholder:text-ink/25 focus:outline-none"
                />
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink hover:text-lime"
                  aria-label="Subscribe"
                >
                  →
                </button>
              </div>
            </form>

            <p className="mt-4 max-w-md text-[0.82rem] leading-relaxed tracking-[-0.02em] text-ink/55">
              {cta.body} <span className="border-b border-ink/20 text-ink/75">Privacy Policy</span>. {cta.accent}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {['ig', 'be', 'li', 'x'].map((item) => (
                <span
                  key={item}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-lime-soft text-[0.78rem] font-semibold tracking-[-0.03em] text-ink/80 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-ink/10 pt-6 text-[0.85rem] tracking-[-0.02em] text-ink/55 md:flex-row md:items-center md:justify-between">
          <p>© {brand.year} {brand.legalName}. All rights reserved.</p>
          <a href="#contact" className="text-ink transition-colors hover:text-ink/70">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
