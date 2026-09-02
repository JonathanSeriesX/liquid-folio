import type { ReactNode } from "react";

import { site, tabHref, tabs } from "@/site.config";

import { TabShell } from "./tab-shell";

// Route-level ISR for every tab: the project stat strips (fetched in
// projects-tab.tsx) refresh daily. Next requires a literal here — keep it in
// step with REVALIDATE in stats.ts.
export const revalidate = 86400;

/* The tab bar lives in a layout rather than the pages so its DOM survives
   navigation — that is what lets the thumb glide between tabs instead of
   snapping. The shell is a Client Component because the active tab comes
   from the pathname, which a layout can't read on the server. It receives
   plain data (ids, labels, hrefs), never the panel components, so nothing
   from site.config lands in the client bundle. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <TabShell
      wordmark={site.wordmark}
      tabs={tabs.map(({ id, label }) => ({ id, label, href: tabHref(id) }))}
    >
      {children}
    </TabShell>
  );
}
