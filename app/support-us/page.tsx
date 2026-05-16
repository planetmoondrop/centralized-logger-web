const SupportUsPage = () => (
  <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
    <h1 className="text-3xl md:text-4xl font-bold text-[#faa56c] mb-6">Support us</h1>

    <p className="text-lg mt-2 text-(--color-baltic-sea-400)">
      <span className="font-medium text-white">Moondrop Centralized Logger</span> is an <span className="font-mono text-(--color-keppel-400)">MIT-licensed</span> open source project. It can grow thanks to the support of the community and companies that rely on it in production.
    </p>
    <p className="text-lg mt-2 text-(--color-baltic-sea-400)">
      If you&apos;d like to support the project, sponsor development, or collaborate on observability work, please reach out and follow the links below.
    </p>

    <div className="my-10 border-l-4 border-[#faa56c] pl-5 py-2 bg-(--color-baltic-sea-950)">
      <h2 className="text-2xl font-semibold text-[#faa56c] mb-1">Why support matters</h2>
      <p className="text-base text-(--color-baltic-sea-400)">Community support helps fund:</p>
      <ul className="list-disc ml-5 mt-2 space-y-1 text-(--color-baltic-sea-300)">
        <li>New production-ready features and integrations.</li>
        <li>Better documentation, examples, and starter templates.</li>
        <li>Faster fixes for bugs, edge cases, and compatibility issues.</li>
        <li>Long-term maintenance of the Loki, Tempo, Prometheus, and Grafana stack.</li>
      </ul>
    </div>

    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-[#faa56c] mb-2">Principal sponsors</h2>
      <ul className="flex flex-wrap gap-4">
        <li>
          <a
            href="https://serpapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded border border-[#faa56c] text-(--color-baltic-sea-400) hover:bg-[#faa56c] hover:text-black transition"
          >
            SerpApi
          </a>
        </li>
        <li>
          <a
            href="https://trilon.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded border border-[#faa56c] text-(--color-baltic-sea-400) hover:bg-[#faa56c] hover:text-black transition"
          >
            Trilon
          </a>
        </li>
        <li>
          <a
            href="https://mojam.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded border border-[#faa56c] text-(--color-baltic-sea-400) hover:bg-[#faa56c] hover:text-black transition"
          >
            Mojam
          </a>
        </li>
      </ul>
    </div>

    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-[#faa56c] mb-2">Sponsors / partners</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="https://docs.nestjs.com/support"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-(--color-keppel-400) hover:text-[#faa56c] transition"
          >
            Become a sponsor
          </a>
        </li>
        <li>
          <a
            href="https://github.com/planetmoondrop/centralized-logger-stack.git"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-(--color-keppel-400) hover:text-[#faa56c] transition"
          >
            Docker stack repository
          </a>
        </li>
      </ul>
    </div>

    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-[#faa56c] mb-2">Get in touch</h2>
      <ul className="space-y-2">
        <li className="text-(--color-baltic-sea-400)">
          Read more inspiration from the NestJS support page:&nbsp;
          <a
            href="https://docs.nestjs.com/support"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-(--color-keppel-400) hover:text-[#faa56c] transition"
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
            className="underline text-(--color-keppel-400) hover:text-[#faa56c] transition"
          >
            planetmoondrop/centralized-logger-stack
          </a>
        </li>
      </ul>
    </div>

    <p className="mt-6 text-base text-(--color-baltic-sea-400) font-medium">
      Need help or want to support the project? You are already on the right page.
    </p>
  </div>
);

export default SupportUsPage;
