"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

import { Ambient } from "../ambient";

export interface TabLink {
  id: string;
  label: string;
  href: string;
  /** the tab's ambient scene as CSS variables — see app/scene.ts */
  scene: CSSProperties;
}

/* the navigation swing: how far the backdrop is thrown, and for how long.
   Percentages are of the ambient layer, which is 120% of the viewport. */
const SWING_X = 3.2;
const SWING_Y = 1.1;
const SWING_MS = 1800;

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
  const shown = Math.max(active, 0);

  /* One-shot parallax on every tab change, in the direction of travel: the
     page "pans" toward the new tab, so the backdrop slides the other way,
     swells like a lens and settles. Web Animations API rather than CSS so it
     restarts on every navigation without remounting the layer — a remount
     would reset the scene variables and skip the colour tween. The previous
     index lives in a ref: it is only compared, never rendered. */
  const ambient = useRef<HTMLDivElement>(null);
  const previous = useRef(shown);
  useEffect(() => {
    const from = previous.current;
    previous.current = shown;
    const el = ambient.current;
    if (
      from === shown ||
      !el ||
      typeof el.animate !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const dir = shown > from ? 1 : -1;
    el.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        {
          transform: `translate3d(${-dir * SWING_X}%, ${dir * SWING_Y}%, 0) scale(1.06)`,
          offset: 0.38,
          // quick out …
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
        { transform: "translate3d(0, 0, 0) scale(1)" },
      ],
      {
        duration: SWING_MS,
        // … slow settle
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    );
  }, [shown]);

  return (
    <div
      className="tabs flex grow flex-col"
      // --tab-index drives the thumb geometry in globals.css. A route no
      // tab owns hides the thumb instead of parking it on a wrong tab —
      // nothing hits that today, since unknown paths 404 outside this layout.
      // The active tab's scene rides along: the ambient layer and the thumb
      // both read it from here, and swapping it is what starts the tween.
      data-tab-active={active === -1 ? "none" : undefined}
      style={
        {
          ...tabs[shown].scene,
          "--tab-index": String(shown),
        } as CSSProperties
      }
    >
      <Ambient ref={ambient} />
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
