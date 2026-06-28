import type { MetadataRoute } from "next";
import type { Folder, PageMapItem } from "nextra";
import { getPageMap } from "nextra/page-map";
import { SITE_URL } from "@/lib/site-url";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/changelog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
];

function isFolder(item: PageMapItem): item is Folder {
  return "children" in item;
}

function isMdxPage(item: PageMapItem): item is PageMapItem & { route: string } {
  return "route" in item && "name" in item && !isFolder(item) && !("data" in item);
}

function collectRoutes(items: PageMapItem[]): string[] {
  return items.flatMap((item) => {
    if (isMdxPage(item)) return [item.route];
    if (isFolder(item)) return collectRoutes(item.children);
    return [];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageMap = await getPageMap();
  const routes = collectRoutes(pageMap).filter((route) => route.startsWith("/docs/"));

  const docRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "/docs/introduction" ? 0.9 : 0.8,
  }));

  return [...STATIC_ROUTES, ...docRoutes];
}
