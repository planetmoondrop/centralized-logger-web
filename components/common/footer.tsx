import { GithubLogo, DiscordLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import Logo from '@/public/assets/logo.svg'


export function Footer() {
  return (
    <footer className="border-t border-gray-600 pt-16 pb-8">
      <div className="mx-auto">
        <div className="flex flex-col gap-12 px-2.5 sm:px-6 lg:flex-row lg:justify-between lg:px-12">
          {/* Brand column */}
          <div className="min-w-xl lg:max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-auto items-center justify-center rounded-none bg-(--color-baltic-sea-800)">
                <Image src={Logo} alt="Moondrop" className="h-10 w-auto" width={10} height={10} />
              </div>
              <span className="text-xl font-semibold text-(--color-baltic-sea-300)">
                Planet Moondrop
              </span>
            </div>
            <p className="mt-4 text-sm text-(--color-baltic-sea-500) max-w-xs sm:max-w-none wrap-break-words">
              Open-source observability for the next generation of microservices.
            </p>

            <p className="text-sm text-[#faa56c]">From developers, for developers.</p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                target="_blank"
                href="https://github.com/planetmoondrop"
                className="flex h-9 w-9 items-center justify-center rounded-none border border-(--color-baltic-sea-800) transition-colors hover:border-(--color-keppel-700) hover:bg-(--color-keppel-950)"
              >
                <GithubLogo
                  weight="fill"
                  className="h-4 w-4 text-(--color-baltic-sea-500)"
                />
              </Link>
              <Link
                target="_blank"
                href="https://discord.gg/FPz2P2FM"
                className="flex h-9 w-9 items-center justify-center rounded-none border border-(--color-baltic-sea-800) transition-colors hover:border-(--color-keppel-700) hover:bg-(--color-keppel-950)"
              >
                <DiscordLogo
                  weight="fill"
                  className="h-4 w-4 text-(--color-baltic-sea-500)"
                />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:gap-16">
            <div>
              <h4 className="text-sm font-medium text-[#faa56c]">Product</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Features
                  </Link>
                </li>

                <li>
                  <Link
                    href="/changelog"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#faa56c]">Developers</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/docs/introduction"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Documentation
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="#"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    API Reference
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="https://github.com/planetmoondrop/centralized-logger/tree/prod/examples"
                    target="_blank"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Examples
                  </Link>
                </li>
              </ul>
            </div>

            {/* <div>
              <h4 className="text-sm font-medium text-[#faa56c]">Legal</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-(--color-baltic-sea-500) transition-colors hover:text-(--color-keppel-400)"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-600 px-2.5 pt-8 sm:flex-row sm:px-6 lg:px-12">
          <span className="text-xs text-(--color-baltic-sea-600)">
            © 2026 Planet Moondrop
          </span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-none bg-(--color-keppel-400)" />
            <span className="text-xs text-(--color-baltic-sea-500)">
              Developed with ❤️ by{" "}
              <Link href="https://a-ameerofficials-projects.vercel.app" target="_blank">
                <span className="text-[#faa56c]">Planet Moondrop</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
