import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-paper placeholder:text-muted/70 transition-colors duration-300 focus:border-lime focus:outline-none'

export default function ContactForm() {
  const sectionRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const blocks = sectionRef.current.querySelectorAll('[data-fade]')
      gsap.from(blocks, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)

    setStatus('submitting')
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="enquiry-form" ref={sectionRef} className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          {/* Intro */}
          <div data-fade className="md:col-span-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lime">
              Enquiry Form
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tightest text-paper md:text-4xl">
              Tell us about your project.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
              Fill out the form and a real person on our team will get back to you within 24 hours.
            </p>
          </div>

          {/* Form */}
          <div data-fade className="md:col-span-8">
            {status === 'success' ? (
              <div className="rounded-2xl border border-lime/30 bg-lime/5 p-8 md:p-10">
                <p className="text-2xl font-bold tracking-tight text-paper">Enquiry sent.</p>
                <p className="mt-2 text-base text-muted">
                  Thanks for reaching out — we’ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot — invisible to real visitors, Formspree silently discards
                    any submission where this is filled in (bots fill every field). */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-paper/80">
                      Your name
                    </label>
                    <input id="name" name="name" type="text" required placeholder="Full name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-paper/80">
                      Email address
                    </label>
                    <input id="email" name="email" type="email" required placeholder="you@company.com" className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-paper/80">
                      Company / Brand
                    </label>
                    <input id="company" name="company" type="text" placeholder="Your company name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="service" className="mb-2 block text-sm font-medium text-paper/80">
                      Service interested in
                    </label>
                    <select id="service" name="service" defaultValue="" className={inputCls}>
                      <option value="" disabled>Select a service</option>
                      {contact.services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-paper/80">
                    Tell us about your project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Share a bit about your brand, what you're looking to achieve, and any timeline or budget context…"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 text-base font-medium tracking-tight text-ink transition-colors duration-300 hover:bg-lime-soft disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send Enquiry'}
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-red-400">
                      Something went wrong. Please try again, or email us directly at{' '}
                      <a href={`mailto:${contact.email}`} className="underline hover:text-red-300">
                        {contact.email}
                      </a>
                      .
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted">
                  Prefer email? Reach us directly at{' '}
                  <a href={`mailto:${contact.email}`} className="text-lime hover:text-lime-soft">
                    {contact.email}
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
