import { site, tabs } from "@/site.config";

// Route-level ISR: the project stat strips (fetched in projects-tab.tsx)
// refresh daily. Next requires a literal here — keep it in step with
// REVALIDATE in stats.ts.
export const revalidate = 86400;

export default function Home() {
  return (
    <div className="tabs flex grow flex-col">
      {/* One radio per tab, ahead of everything that reacts to it: the CSS
          reads them positionally (.tab-input:nth-of-type(N)), so no rule
          anywhere needs to know a tab's name. */}
      {tabs.map((tab, i) => (
        <input
          key={tab.id}
          type="radio"
          name="tabs"
          id={`tab-${tab.id}`}
          defaultChecked={i === 0}
          className="tab-input"
        />
      ))}

      <header className="site-header">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-6">
          {/* items-center keeps the wordmark centred against the picker even
              when the picker folds onto two rows */}
          <span className="mono font-medium">{site.wordmark}</span>
          <nav
            className="tab-bar"
            aria-label="Sections"
            // data-tabs picks the narrow-viewport row split, --tab-count does
            // the thumb geometry; both live in globals.css
            data-tabs={tabs.length}
            style={
              { "--tab-count": String(tabs.length) } as React.CSSProperties
            }
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
            {tabs.map((tab) => (
              <label key={tab.id} htmlFor={`tab-${tab.id}`}>
                {tab.label}
              </label>
            ))}
          </nav>
        </div>
      </header>

      {/* pb-8 mirrors the panels' 2rem margin-top, so the glass card floats
          with equal breathing room above and below */}
      <main className="mx-auto w-full max-w-3xl grow px-4 pb-8 sm:px-6">
        {/* Each tab brings its own panel from site.config.tsx; the CSS
            matches panel N to radio N, so config order is the only order. */}
        {tabs.map(({ id, Panel }) => (
          <Panel key={id} />
        ))}
      </main>
    </div>
  );
}
