import Image from "next/image";

import { home } from "@/site.config";

/** rendered size of the portrait — shared with preload-images.tsx */
export const PHOTO_SIZES = "176px";

export function HomeTab() {
  /* The roll keyframes are generated from home.cycleWords, so the animation
     always matches the row count — edit the list freely; the last word is
     where the roll parks. It plays once per visit to the panel (see
     .cycler-track in globals.css), so no duplicate first row is needed.
     Computed inside the component (not at module scope) because site.config
     imports this file for the tab registry — reading `home` during module
     evaluation would hit the import cycle before the config exists. */
  const cycleRows = home.cycleWords.length;
  const cycleSlot = 100 / cycleRows;
  const cycleKeyframes = `@keyframes cycle {
${home.cycleWords
  .map((_, i) => {
    const from = (i * cycleSlot).toFixed(2);
    const to =
      i === cycleRows - 1 ? "100.00" : ((i + 1) * cycleSlot - 3).toFixed(2);
    return `  ${from}%, ${to}% { transform: translateY(calc(-100% * ${i} / ${cycleRows})); }`;
  })
  .join("\n")}
}`;
  const cycleDuration = `${(cycleRows * 2.4).toFixed(1)}s`;

  return (
    <article className="tab-panel stagger">
      <div className="flow-root">
        {/* the shell floats, so dropping it simply lets the hero run full
            width — no layout branch needed */}
        {home.photo && (
          <div className="photo-shell">
            <Image
              src={home.photo.src}
              alt={home.photo.alt}
              fill
              sizes={PHOTO_SIZES}
              /* the hero's largest paint: fetched first and never lazily.
                 Not `preload` (the Next 16 name for `priority`): that would
                 add a second <link rel=preload> beside the one the root
                 layout already emits for every panel image, and React does
                 not dedupe the pair. */
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        )}
        <h1>
          {home.headline}
          <span className="cycler" aria-label={home.cycleLabel}>
            <style>{cycleKeyframes}</style>
            {/* invisible copy of the parked (last) word — it alone sizes the
                box, so the sentence wraps like plain text on narrow
                viewports; wider rolling words overflow the line's empty end
                instead of reserving their width (see .cycler in globals.css) */}
            <span className="cycler-sizer" aria-hidden>
              {home.cycleWords[home.cycleWords.length - 1]}
            </span>
            <span
              className="cycler-track"
              aria-hidden
              style={
                { "--cycle-duration": cycleDuration } as React.CSSProperties
              }
            >
              {home.cycleWords.map((word, i) => (
                <span key={i}>{word}</span>
              ))}
            </span>
          </span>
        </h1>
        <p className="mt-6 text-muted">{home.blurb}</p>
      </div>
      <div className="mt-6 border-t border-rule pt-6 text-muted">
        <p>{home.interestsIntro}</p>
      </div>
      <ul className="tag-cloud mt-4">
        {home.interests.map((tag) => (
          <li key={tag.label} className={`tag${tag.hover ? " tag-swap" : ""}`}>
            {tag.hover ? (
              <>
                <span className="tag-label">{tag.label}</span>
                <span className="tag-hover" aria-hidden>
                  {tag.hover}
                </span>
              </>
            ) : (
              tag.label
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
