"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Heart } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { Rocket } from "@phosphor-icons/react"

export function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="mt-6 py-24 overflow-hidden w-full">
      <div className="mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12">
        <div
          className={`relative rounded-none border border-[#faa56c]/90 bg-gradient-to-br from-[var(--color-keppel-950)] via-[var(--color-baltic-sea-950)] to-[var(--color-baltic-sea-950)] p-8 lg:p-16 text-center overflow-hidden transition-all duration-1000 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          style={{
            boxShadow: isVisible ? "0 0 120px -30px rgba(250, 165, 108, 0.9)" : "none",
            transitionProperty: "opacity, transform, box-shadow",
          }}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-1000 delay-500 ${isVisible ? "opacity-10" : "opacity-0"}`}
            style={{
              backgroundImage: `radial-gradient(#faa56c 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-none bg-[#faa56c]/90 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  transitionDelay: `${800 + i * 100}ms`,
                  animation: isVisible ? `float ${3 + i * 0.5}s ease-in-out infinite` : "none",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#faa56c]/10 border border-[#faa56c]/90 mb-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
                }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Rocket weight="duotone" className="h-4 w-4 text-[#faa56c]/90" />
              <span className="text-sm font-medium text-white">100% Free & Open Source</span>
            </div>

            <h2
              className={`text-3xl md:text-5xl font-bold mb-4 text-balance transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-8 blur-sm"
                }`}
              style={{ transitionDelay: "400ms" }}
            >
              Help us keep this project alive
            </h2>

            <p
              className={`text-lg text-[#faa56c]/60 max-w-xl mx-auto mb-2 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: "500ms" }}
            >
              We&apos;re an indie team building open-source tools for developers. Your support helps us stay independent and ship faster.
            </p>

            <Link
              href="/support-us"
              className="home-hero-cta group focus-visible:ring-offset-background inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#faa56c] bg-transparent px-6 py-2.5 text-[0.9375rem] font-semibold text-white transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-[#faa56c] hover:text-[#1b1b1b] hover:shadow-[0_8px_24px_-8px_rgba(250,165,108,0.55)] focus-visible:ring-2 focus-visible:ring-[#faa56c] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:mt-10 sm:px-7 sm:py-3 sm:text-base"
            >
              <Heart weight="duotone" className="h-4 w-4" />
              Support Us
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:h-5 sm:w-5"
                weight="bold"
                aria-hidden
              />
            </Link>

            <p
              className={`mt-6 text-sm text-[#faa56c]/60 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
              style={{ transitionDelay: "800ms" }}
            >
              No subscription · One-time or recurring · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}