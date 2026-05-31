"use client"

import { useEffect, useRef, useState } from "react"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

const FAQS = [
  {
    question: "Is Planetmoondrop free to use?",
    answer:
      "Yes, Planetmoondrop is 100% free and open-source. There are no limits on compute hours or traces captured. You can self-host the entire platform or use our managed cloud version for free.",
  },
  {
    question: "What languages and frameworks are supported?",
    answer:
      "Our SDK currently supports Node.js, Python, and Go. It can integrate with any web framework like Express, Next.js, FastAPI, and standard HTTP clients.",
  },
  {
    question: "How do you handle security and data privacy?",
    answer:
      "We process trace data with strict isolation. Since we are open-source, you can self-host the entire infrastructure to ensure your trace data never leaves your VPC.",
  },
  {
    question: "Can I filter what data gets traced?",
    answer:
      "Absolutely. You can configure the SDK to redact sensitive headers, payload data, and PII before it ever leaves your service.",
  },
  {
    question: "Does tracing add latency to my API?",
    answer:
      "Planetmoondrop is designed to be ultra-lightweight. The SDK batches traces asynchronously and adds less than 1ms of overhead to your requests.",
  },
  {
    question: "How do I get support?",
    answer:
      "Since Planetmoondrop is an open-source project, you can get support from our active community on Discord or open an issue on our GitHub repository. We publish real-time status at status.planetmoondrop.io.",
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  delay,
  isVisible,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  delay: number
  isVisible: boolean
}) {
  return (
    <div
      className={`border-b transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${delay % 2 === 0 ? "-translate-x-8" : "translate-x-8"}`
        }`}
      style={{ transitionDelay: `${delay * 75 + 200}ms` }}
    >
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 text-left group">
        <span className={`font-medium transition-colors ${isOpen && 'text-[#faa56c]/90'}`}>
          {question}
        </span>
        <CaretDown
          weight="bold"
          className={`h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
    <section ref={ref} className="py-16 overflow-hidden">
      <div className="mx-auto max-w-[800px] px-2.5 sm:px-6 lg:px-12">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-sm"}`}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-[#faa56c]/90">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              delay={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
