import { ChangelogTabs } from "@/components/common/changelog-tabs";
import { FinalCTA } from "@/components/home/final-cta";
import { remark } from "remark";
import remarkHtml from "remark-html";

async function fetchAndRender(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const md = await res.text();
  const result = await remark().use(remarkHtml).process(md);
  return result.toString();
}

export default async function ChangelogPage() {
  const [nestjs, client] = await Promise.all([
    fetchAndRender(
      "https://raw.githubusercontent.com/planetmoondrop/centralized-logger/publish/packages/nestjs/CHANGELOG.md"
    ),
    fetchAndRender(
      "https://raw.githubusercontent.com/planetmoondrop/centralized-logger/publish/packages/client/CHANGELOG.md"
    ),
  ]);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
      <ChangelogTabs centralizedLogger={nestjs} loggerClient={client} />

      <FinalCTA />
    </div>
  );
}