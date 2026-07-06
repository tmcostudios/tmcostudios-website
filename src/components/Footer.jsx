import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { brand, cta, home, services } from '../data/content'

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
    <footer ref={footerRef} id="contact" className="relative overflow-hidden bg-[#E7EBEE] text-ink">
      <div className="mx-auto max-w-[1520px] px-6 py-14 md:px-10 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_0.95fr_0.95fr_1.2fr] lg:gap-16">
          <div data-footer-block>
            <p className="text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Company:</p>
            <ul className="mt-7 space-y-4 text-[1.1rem] leading-none tracking-[-0.04em] text-ink/92 md:text-[1.45rem]">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/work">Work</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/process">Process</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div data-footer-block>
            <p className="text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Services:</p>
            <ul className="mt-7 space-y-4 text-[1.1rem] leading-none tracking-[-0.04em] text-ink/92 md:text-[1.45rem]">
              {services.map((service) => (
                <li key={service.title}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div data-footer-block>
            <p className="text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Industries:</p>
            <ul className="mt-7 space-y-4 text-[1.1rem] leading-none tracking-[-0.04em] text-ink/92 md:text-[1.45rem]">
              {home.sectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </div>

          <div data-footer-block className="lg:pl-4">
            <p className="text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Get in touch:</p>
            <div className="mt-7 space-y-3 text-[1rem] tracking-[-0.03em] text-ink/80 md:text-[1.1rem]">
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

            <p className="mt-10 text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Subscribe to our news and updates</p>
            <form className="mt-7 max-w-[28rem]">
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <div className="flex items-end gap-3 border-b border-ink/20 pb-4">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email here"
                  className="min-w-0 flex-1 bg-transparent text-[1.05rem] tracking-[-0.03em] text-ink placeholder:text-ink/25 focus:outline-none md:text-[1.15rem]"
                />
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink hover:text-[#E7EBEE]"
                  aria-label="Subscribe"
                >
                  →
                </button>
              </div>
            </form>

            <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed tracking-[-0.02em] text-ink/55 md:text-[1.05rem]">
              {cta.body} <span className="border-b border-ink/20 text-ink/75">Privacy Policy</span>. {cta.accent}
            </p>

            <div className="mt-12">
              <p className="text-[0.92rem] font-semibold tracking-[-0.03em] text-ink md:text-[1rem]">Follow us on:</p>
              <div className="mt-5 flex flex-wrap gap-4">
                {['ig', 'be', 'li', 'x'].map((item) => (
                  <span
                    key={item}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/15 bg-[#F2F4F5] text-[0.95rem] font-semibold tracking-[-0.03em] text-ink/80 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ink/10 pt-8 md:mt-20 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[0.72rem] font-semibold tracking-[0.22em] text-[#E7EBEE]">
              TM
            </span>
            <p className="text-[1.05rem] font-medium tracking-[-0.03em] text-ink">
              {brand.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[0.95rem] tracking-[-0.02em] text-ink/55 md:justify-end md:text-[1rem]">
            <p>© {brand.year} {brand.legalName}. All rights reserved.</p>
            <span className="hidden h-1.5 w-1.5 rounded-full bg-ink/70 md:inline-block" />
            <a href="#contact" className="text-ink transition-colors hover:text-ink/70">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
