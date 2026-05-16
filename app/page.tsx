import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { CopyInstallCommand } from "@/components/common/copy-install-command";

export default function Home() {
  return (
    <main
      id="home-hero"
      className="flex flex-1 flex-col items-center justify-center  py-8 text-foreground sm:py-10 md:min-h-[min(60vh,calc(100dvh-10rem))] "
    >
      <div className="flex w-full max-w-360 flex-col items-center text-center">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[#faa56c]/90 sm:text-[13px] border-2 border-[#faa56c]/90 rounded-lg p-2">
          Moondrop Centralized Logger
        </p>
        <h1 className="font-heading text-balance text-4xl font-bold leading-[1.12] tracking-tight text-(--color-baltic-sea-50) sm:text-5xl sm:leading-[1.1] lg:text-[3.25rem] lg:leading-[1.08]">
          Struggling with{" "}
          <span className="text-(--color-keppel-400)">Observability</span>?
          <span className="mt-3 block text-[0.92em] font-semibold tracking-tight text-(--color-baltic-sea-200) sm:mt-4">
            We got your systems fully covered
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-pretty text-base leading-[1.65] text-(--color-baltic-sea-300) sm:mt-10 sm:text-lg sm:leading-[1.7]">
          Track every API call across your microservices with complete visibility
          into request flows, bottlenecks, and failures - with Centralized Logger
          delivering insights before your coffee gets cold.
        </p>

        <div className="mt-10 w-full sm:mt-12 flex justify-center">
          <CopyInstallCommand />
        </div>

        <Link
          href="/docs/introduction"
          className="home-hero-cta group mt-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#faa56c] bg-transparent px-7 py-3 text-base font-semibold text-[#faa56c] transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-[#faa56c] hover:text-[#1b1b1b] hover:shadow-[0_8px_24px_-8px_rgba(250,165,108,0.55)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#faa56c] focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:active:scale-100 sm:mt-12"
        >
          View docs
          <ArrowRight
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            weight="bold"
            aria-hidden
          />
        </Link>
      </div>
    </main>
  );
}
