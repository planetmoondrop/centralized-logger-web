import { Cube, GithubLogo, DiscordLogo } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-gray-600 pt-16 pb-8">
            <div className="mx-auto">
                <div className="flex flex-col gap-12 lg:flex-row lg:justify-between px-2.5 sm:px-6 lg:px-12">
                    {/* Brand column */}
                    <div className="lg:max-w-xl min-w-xl">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-none bg-(--color-baltic-sea-800)">
                                <Cube weight="fill" className="h-5 w-5 text-(--color-baltic-sea-400)" />
                            </div>
                            <span className="text-xl font-semibold text-(--color-baltic-sea-300)">Planet Moondrop</span>
                        </div>
                        <p className="mt-4 text-sm text-(--color-baltic-sea-500)">
                            Open-source observability for the next generation of microservices.
                        </p>
                        <p className="text-sm text-[#faa56c]">
                            From developers, for developers.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                target="_blank"
                                href="https://github.com/planetmoondrop"
                                className="flex h-9 w-9 items-center justify-center rounded-none border border-(--color-baltic-sea-800) hover:border-(--color-keppel-700) hover:bg-(--color-keppel-950) transition-colors"
                            >
                                <GithubLogo weight="fill" className="h-4 w-4 text-(--color-baltic-sea-500)" />
                            </Link>
                            <Link
                                target="_blank"
                                href="https://discord.gg/FPz2P2FM"
                                className="flex h-9 w-9 items-center justify-center rounded-none border border-(--color-baltic-sea-800) hover:border-(--color-keppel-700) hover:bg-(--color-keppel-950) transition-colors"
                            >
                                <DiscordLogo weight="fill" className="h-4 w-4 text-(--color-baltic-sea-500)" />
                            </Link>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-16">
                        <div>
                            <h4 className="text-sm font-medium text-[#faa56c]">Product</h4>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Features
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
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
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        API Reference
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Examples
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-[#faa56c]">Legal</h4>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-(--color-baltic-sea-500) hover:text-(--color-keppel-400) transition-colors"
                                    >
                                        Security
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4 px-2.5 sm:px-6 lg:px-12">
                    <span className="text-xs text-(--color-baltic-sea-600)">© 2026 Planet Moondrop</span>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-none bg-(--color-keppel-400) animate-pulse" />
                        <span className="text-xs text-(--color-baltic-sea-500)">Developed with ❤️ by <span className="text-[#faa56c]">Planet Moondrop</span></span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
