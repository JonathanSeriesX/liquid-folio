import { type Accent, career, type ExperienceRow } from "@/site.config";

/* palette variable for the career lane's colour gradients — each row hands
   its predecessor's colour to CSS as --xp-from (and gaps --xp-to as well).
   Derived from the class name: .accent-azure sets --accent from --c-azure,
   so a new accent only needs the Accent union in site.config.tsx and the
   .accent-<name>/--c-<name> pair in globals.css — no third map here. */
const accentVar = (accent: Accent) =>
  `var(--c-${accent.slice("accent-".length)})`;

/* colour of an entry's lane segment, for the crossing gradients — an entry
   with no accent falls back to the site accent */
const xpColor = (e?: ExperienceRow) =>
  e && !("gap" in e) && e.accent ? accentVar(e.accent) : "var(--c-crimson)";

export function CareerTab() {
  const { entries } = career;
  // zigzag side counter — advances per card, not per row, so gap rows keep
  // the left/right alternation intact
  let zigzagSide = 0;

  return (
    <article className="tab-panel">
      <p className="mono mb-8 text-center text-muted">{career.intro}</p>
      <ol className="xp-zigzag">
        {entries.map((entry, i) => {
          if ("gap" in entry) {
            // direction = the upcoming card's side, so the dashed
            // crossing lands where that card's rail begins
            const toRight = zigzagSide % 2 === 1;
            return (
              <li
                key={`gap-${i}`}
                className={`xp-gap ${toRight ? "xp-right" : "xp-left"}`}
                aria-hidden
                style={
                  {
                    "--xp-from": xpColor(entries[i - 1]),
                    "--xp-to": xpColor(entries[i + 1]),
                  } as React.CSSProperties
                }
              >
                <span className="xp-lane" />
              </li>
            );
          }
          const side = zigzagSide++ % 2 ? "xp-right" : "xp-left";
          return (
            <li
              key={entry.name}
              className={`xp-row ${side}${entry.live ? " xp-live" : ""} ${entry.accent ?? ""}`}
              style={
                {
                  "--xp-from": xpColor(entries[i - 1]),
                } as React.CSSProperties
              }
            >
              {/* .xp-card is a static shell that owns the rail and dot
                  pseudos; .xp-box is the glass that grows on hover, so the
                  timeline never moves */}
              <div className="xp-card">
                <div className="xp-box">
                  <div className="xp-head">
                    <span className="entry-name">{entry.name}</span>
                    <span className="xp-years">{entry.years}</span>
                  </div>
                  <span className="entry-meta">{entry.meta}</span>
                  <p className="entry-bio">{entry.bio}</p>
                  {entry.pills && (
                    <ul className="tag-cloud mt-3">
                      {entry.pills.map((pill) => (
                        /* see projects-tab.tsx — data-label reserves the
                           width of the full-case form */
                        <li
                          key={pill}
                          className="tag tag-case"
                          data-label={pill}
                        >
                          {pill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
