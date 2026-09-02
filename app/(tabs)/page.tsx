import { tabs } from "@/site.config";

/* The first tab lives at the site root; every other tab is served by
   [tab]/page.tsx. The bar, header and ISR window are in layout.tsx. */
export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const { Panel } = tabs[0];
  return <Panel />;
}
