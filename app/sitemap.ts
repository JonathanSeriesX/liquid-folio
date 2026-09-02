import type { MetadataRoute } from "next";

import { site, tabHref, tabs } from "@/site.config";

/* One entry per tab, straight from the config — the first tab is the root
   and carries the top priority, the rest sit one notch below. */
export default function sitemap(): MetadataRoute.Sitemap {
  return tabs.map(({ id }, i) => ({
    url: new URL(tabHref(id), site.url).href,
    changeFrequency: "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
}
