import type { MetadataRoute } from "next";

import { site } from "@/site.config";

/* One page, one entry — the tabs are CSS state, not routes. Kept as code
   rather than a static XML so the URL follows site.config. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
