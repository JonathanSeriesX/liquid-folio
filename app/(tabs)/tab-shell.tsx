"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

export interface TabLink {
  id: string;
  label: string;
  href: string;
}

export function TabShell({
  tabs,
  wordmark,
  children,
}: {
  tabs: TabLink[];
  wordmark: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = tabs.findIndex((tab) => tab.href === pathname);

  return (
    <div
      className="tabs flex grow flex-col"
      // --tab-index drives the thumb geometry in globals.css. A route no
      // tab owns hides the thumb instead of parking it on a wrong tab —
      // nothing hits that today, since unknown paths 404 outside this layout.
      data-tab-active={active === -1 ? "none" : undefined}
      style={{ "--tab-index": String(Math.max(active, 0)) } as CSSProperties}
    >
      <header className="site-header">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-6">
          {/* items-center keeps the wordmark centred against the picker even
              when the picker folds onto two rows */}
          <span className="mono font-medium">{wordmark}</span>
          <nav
            className="tab-bar"
            aria-label="Sections"
            // data-tabs picks the narrow-viewport row split, --tab-count does
            // the thumb geometry; both live in globals.css
            data-tabs={tabs.length}
            style={{ "--tab-count": String(tabs.length) } as CSSProperties}
          >
            {/* two thumb copies under a goo filter: the fast one leads, the
                slow one drags behind, and #lg-goo melts the pair into a
                single blob that stretches and snaps between tabs. The
                shadow rides two filter-free half-strength twins, one per
                timing, so both ends of the stretched blob keep a shadow —
                a single twin gets covered by the blob's far end, and Safari
                drops shadows chained into the goo filter. */}
            <span
              className="tab-thumb tab-thumb-shadow tab-thumb-lag"
              aria-hidden
            />
            <span className="tab-thumb tab-thumb-shadow" aria-hidden />
            <span className="tab-goo" aria-hidden>
              <span className="tab-thumb tab-thumb-lag" />
              <span className="tab-thumb" />
            </span>
            {tabs.map((tab, i) => (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={i === active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* pb-8 mirrors the panels' 2rem margin-top, so the glass card floats
          with equal breathing room above and below */}
      <main className="mx-auto w-full max-w-3xl grow px-4 pb-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
