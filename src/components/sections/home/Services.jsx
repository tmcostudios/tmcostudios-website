import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { home, services } from "../../../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { servicesHeading, spectrum } = home;
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current.querySelector("[data-heading]");
      if (heading) {
        gsap.from(heading, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 85%", once: true },
        });
      }

      const cards = cardsRef.current?.querySelectorAll("[data-card]");
      if (cards?.length) {
        gsap.from(cards, {
          y: 70,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            once: true,
          },
        });

        // Subtle 3-D tilt on mouse
        cards.forEach((card) => {
          card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(card, {
              rotateY: x * 8,
              rotateX: -y * 6,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              duration: 0.8,
              ease: "elastic.out(1, 0.5)",
            });
          });
        });
      }

      const spectrumEl = sectionRef.current.querySelector("[data-spectrum]");
      if (spectrumEl) {
        gsap.from(spectrumEl, {
          x: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: spectrumEl, start: "top 85%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-6 py-24 md:px-10 md:py-40">
      {/* Background circle */}
      <img
        src="/images/circle 1.png"
        alt=""
        className="pointer-events-none absolute left-0 top-0 -z-10 w-full h-auto object-contain"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1400px]">
        <h2
          data-heading
          className="max-w-3xl text-3xl font-bold leading-[1.15] tracking-tightest md:text-5xl"
        >
          {servicesHeading.pre}
          <br />
          {servicesHeading.mid}
          <span className="text-lime">{servicesHeading.accent}</span>
          {servicesHeading.post}
        </h2>

        {/* ── Folder cards grid ── */}
        <div
          ref={cardsRef}
          className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"
          style={{ perspective: "1000px" }}
        >
          {services.map((service, index) => {
            const isLarge = index === 0;
            const colSpan = isLarge ? "lg:col-span-6" : "lg:col-span-3";
            const cardH = isLarge ? 480 : 340;
            const notchClip =
              "polygon(0% 0%, 68% 0%, 68% 16%, 100% 16%, 100% 100%, 0% 100%)";

            return (
              <article
                key={service.title}
                data-card
                className={`${colSpan} group relative cursor-pointer overflow-hidden rounded-2xl bg-ink-2`}
                style={{
                  height: `${cardH}px`,
                  clipPath: notchClip,
                  WebkitClipPath: notchClip,
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <img
                  src={`/images/file-${index + 1}.jpg`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_38%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_18%,rgba(0,0,0,0.12)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/40 to-transparent" />

                {/* Inset card border */}
                <div className="pointer-events-none absolute inset-0 z-30 ring-1 ring-inset ring-white/10" />

                {/* Lime hover shimmer */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-lime/0 transition-colors duration-500 group-hover:bg-lime/[0.04]" />
                <div className="relative z-40 flex h-full flex-col justify-end p-5 md:p-6">
                  <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-lime">
                    <span className="h-px w-5 bg-lime" />
                    {service.tag}
                  </span>

                  <h3
                    className={`font-bold leading-tight tracking-tight text-paper ${isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}
                  >
                    {service.title}
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                    {service.body}
                  </p>

                  <span className="mt-5 block h-px w-10 origin-left bg-lime transition-all duration-500 group-hover:w-20" />
                </div>
              </article>
            );
          })}
        </div>

        <p
          data-spectrum
          className="ml-auto mt-16 max-w-md text-right text-base font-medium leading-relaxed text-paper md:text-lg"
        >
          <span className="text-lime">
            We operate across the entire marketing spectrum
          </span>{" "}
          {spectrum.replace(
            "We operate across the entire marketing spectrum",
            "",
          )}
        </p>
      </div>
    </section>
  );
}
