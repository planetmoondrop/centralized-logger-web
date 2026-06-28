import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CopyInstallCommand } from "@/components/common/copy-install-command";
import { CreatorCardsOverlay } from "@/components/common/creator-card";
// import ProjectOverviewCard from "@/components/home/logs-metrics";
import { TerminalDemo } from "@/components/home/terminal-demo";
import { FAQ } from "@/components/home/faq";
import { FinalCTA } from "@/components/home/final-cta";
// import ObservabilitySection from "@/components/home/logs-metrics";

export default function Home() {
  return (
    <main
      id="home-hero"
      className="text-foreground flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:min-h-[min(60vh,calc(100dvh-10rem))] lg:px-8"
    >
      <CreatorCardsOverlay>
        {/* Content container — narrow on mobile, capped on desktop */}
        <div className="flex w-full max-w-2xl flex-col items-center text-center lg:max-w-3xl">
          {/* Badge */}
          <p className="mb-5 inline-block rounded-lg border-2 border-[#faa56c]/90 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] text-[#faa56c]/90 uppercase sm:mb-6 sm:text-[13px]">
            Moondrop Centralized Logger
          </p>

          {/* Headline */}
          <h1 className="font-heading text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1] lg:text-[3.25rem] lg:leading-[1.08]">
            <span className="whitespace-nowrap">
              Struggling with <span className="text-[#faa56c]/90"> Observability</span>?
            </span>

            <span className="mt-2 block text-[0.88em] font-semibold tracking-tight sm:mt-3">
              We got your systems fully covered
            </span>
          </h1>

          {/* Body copy */}
          <p className="mt-6 max-w-lg text-[0.9375rem] leading-[1.65] text-pretty sm:mt-8 sm:text-lg sm:leading-[1.7] lg:max-w-xl">
            Track every API call across your microservices with complete visibility into
            request flows, bottlenecks and failures - with Centralized Logger
            delivering insights{" "}
            <span className="text-[#faa56c]/90">ready before your coffee gets.</span>
          </p>

          {/* Install command */}
          <div className="mt-8 w-full sm:mt-10">
            <CopyInstallCommand />
          </div>

          {/* CTA */}
          <Link
            href="/docs/introduction"
            className="home-hero-cta group focus-visible:ring-offset-background mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#faa56c] bg-transparent px-6 py-2.5 text-[0.9375rem] font-semibold text-[#faa56c] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-[#faa56c] hover:text-[#1b1b1b] hover:shadow-[0_8px_24px_-8px_rgba(250,165,108,0.55)] focus-visible:ring-2 focus-visible:ring-[#faa56c] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:mt-10 sm:px-7 sm:py-3 sm:text-base"
          >
            View docs
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 sm:h-5 sm:w-5"
              weight="bold"
              aria-hidden
            />
          </Link>
        </div>
      </CreatorCardsOverlay>

      {/* <ProjectOverviewCard /> */}
      {/* <ObservabilitySection /> */}
      <TerminalDemo />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
