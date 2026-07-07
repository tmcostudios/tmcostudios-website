import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '../../../data/content'

gsap.registerPlugin(ScrollTrigger)

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-paper placeholder:text-muted/70 transition-colors duration-300 focus:border-lime focus:outline-none'

function ServiceSelect({ id, name, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div ref={wrapRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls} flex items-center justify-between text-left ${
          value ? 'text-paper' : 'text-muted/70'
        }`}
      >
        <span>{value || 'Select a service'}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className={`ml-3 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-ink-2 py-1.5 shadow-xl shadow-black/30"
        >
          {options.map((s) => (
            <li key={s} role="option" aria-selected={value === s}>
              <button
                type="button"
                onClick={() => {
                  onChange(s)
                  setOpen(false)
                }}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                  value === s ? 'bg-lime/10 text-lime' : 'text-paper/85 hover:bg-white/5 hover:text-paper'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function ContactForm() {
  const sectionRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [service, setService] = useState('')

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
    // Web3Forms only returns JSON (vs. its HTML fallback page) when the body
    // is sent as application/json rather than multipart/form-data.
    const payload = Object.fromEntries(new FormData(form).entries())

    setStatus('submitting')
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error('Submission failed')
      setStatus('success')
      form.reset()
      setService('')
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
                <input type="hidden" name="access_key" value={contact.formAccessKey} />
                <input type="hidden" name="subject" value="New Enquiry — TM & Co. Studios Website" />
                <input type="hidden" name="from_name" value="TM & Co. Studios Website" />

                {/* Honeypot — invisible to real visitors, Web3Forms silently discards
                    any submission where this checkbox is checked (bots fill every field). */}
                <input
                  type="checkbox"
                  name="botcheck"
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
                    <ServiceSelect
                      id="service"
                      name="service"
                      options={contact.services}
                      value={service}
                      onChange={setService}
                    />
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
