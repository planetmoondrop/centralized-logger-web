const SupportUsPage = () => (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <h1 className="mb-6 text-3xl font-bold text-[#faa56c] md:text-4xl">Support us</h1>

        <p className="mt-2 text-lg text-(--color-baltic-sea-400)">
            <span className="font-medium text-white">Moondrop Centralized Logger</span> is an{" "}
            <span className="font-mono text-(--color-keppel-400)">MIT-licensed</span> open
            source project. It can grow thanks to the support of the community and companies
            that rely on it in production.
        </p>
        <p className="mt-2 text-lg text-(--color-baltic-sea-400)">
            If you&apos;d like to support the project, sponsor development, or collaborate on
            observability work, please reach out and follow the links below.
        </p>

        <div className="my-10 border-l-4 border-[#faa56c] bg-(--color-baltic-sea-950) py-2 pl-5">
            <h2 className="mb-1 text-2xl font-semibold text-[#faa56c]">
                Why support matters
            </h2>
            <p className="text-base text-(--color-baltic-sea-400)">
                Community support helps fund:
            </p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-(--color-baltic-sea-300)">
                <li>New production-ready features and integrations.</li>
                <li>Better documentation, examples, and starter templates.</li>
                <li>Faster fixes for bugs, edge cases, and compatibility issues.</li>
                <li>
                    Long-term maintenance of the Loki, Tempo, Prometheus, and Grafana stack.
                </li>
            </ul>
        </div>

        <div className="mb-10">
            <h2 className="mb-2 text-2xl font-semibold text-[#faa56c]">Principal sponsors</h2>
            <ul className="flex flex-wrap gap-4">
                <li>
                    <a
                        href="https://serpapi.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border border-[#faa56c] px-4 py-2 text-(--color-baltic-sea-400) transition hover:bg-[#faa56c] hover:text-black"
                    >
                        SerpApi
                    </a>
                </li>
                <li>
                    <a
                        href="https://trilon.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border border-[#faa56c] px-4 py-2 text-(--color-baltic-sea-400) transition hover:bg-[#faa56c] hover:text-black"
                    >
                        Trilon
                    </a>
                </li>
                <li>
                    <a
                        href="https://mojam.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded border border-[#faa56c] px-4 py-2 text-(--color-baltic-sea-400) transition hover:bg-[#faa56c] hover:text-black"
                    >
                        Mojam
                    </a>
                </li>
            </ul>
        </div>

        <div className="mb-10">
            <h2 className="mb-2 text-2xl font-semibold text-[#faa56c]">
                Sponsors / partners
            </h2>
            <ul className="space-y-2">
                <li>
                    <a
                        href="https://docs.nestjs.com/support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-keppel-400) underline transition hover:text-[#faa56c]"
                    >
                        Become a sponsor
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/planetmoondrop/centralized-logger-stack.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-keppel-400) underline transition hover:text-[#faa56c]"
                    >
                        Docker stack repository
                    </a>
                </li>
            </ul>
        </div>

        <div className="mb-10">
            <h2 className="mb-2 text-2xl font-semibold text-[#faa56c]">Get in touch</h2>
            <ul className="space-y-2">
                <li className="text-(--color-baltic-sea-400)">
                    Read more inspiration from the NestJS support page:&nbsp;
                    <a
                        href="https://docs.nestjs.com/support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-keppel-400) underline transition hover:text-[#faa56c]"
                    >
                        NestJS Support
                    </a>
                </li>
                <li className="text-(--color-baltic-sea-400)">
                    Browse the Docker stack repository:&nbsp;
                    <a
                        href="https://github.com/planetmoondrop/centralized-logger-stack.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-(--color-keppel-400) underline transition hover:text-[#faa56c]"
                    >
                        planetmoondrop/centralized-logger-stack
                    </a>
                </li>
            </ul>
        </div>

        <p className="mt-6 text-base font-medium text-(--color-baltic-sea-400)">
            Need help or want to support the project? You are already on the right page.
        </p>
    </div>
);

export default SupportUsPage;