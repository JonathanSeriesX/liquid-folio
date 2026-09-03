import Image from "next/image";

import { projects } from "@/site.config";

import { LinkArrowIcon } from "./icons";

/** rendered size of a project icon — shared with preload-images.tsx so the
    preloaded srcset is byte-for-byte the one these <Image>s request */
export const ICON_SIZES = "44px";

export async function ProjectsTab() {
  /* Every project's stats() runs in parallel and is cached by the route's
     `revalidate`; a project without one simply gets no strip. */
  const strips = await Promise.all(
    projects.entries.map((entry) => entry.stats?.() ?? null),
  );

  return (
    <article className="tab-panel">
      <p className="prose-col mb-6 text-muted">{projects.intro}</p>
      <div className="grid gap-4">
        {projects.entries.map((entry, i) => (
          <div
            key={entry.name}
            className={`project-card ${entry.accent ?? ""}`}
          >
            <div className="project-head">
              <span className="project-icon" aria-hidden>
                {"src" in entry.icon ? (
                  <Image
                    src={entry.icon.src}
                    alt=""
                    fill
                    sizes={ICON_SIZES}
                    /* eager: the tile is 44px and above the fold, and lazy
                       loading would hold the (already cached) fetch until
                       after layout — a visible blink on every visit */
                    loading="eager"
                  />
                ) : (
                  entry.icon.emoji
                )}
              </span>
              <span className="project-title">
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  className="entry-name project-name-link"
                >
                  {entry.name}
                  <LinkArrowIcon />
                </a>
              </span>
              <span className="project-year">{entry.year}</span>
            </div>
            <p className="entry-bio">{entry.bio}</p>
            {strips[i] && <p className="stat-strip">{strips[i]}</p>}
            <ul className="tag-cloud">
              {entry.pills.map((pill) => (
                /* data-label feeds the invisible full-case sizer in
                   globals.css, which keeps the pill from resizing on hover */
                <li key={pill} className="tag tag-case" data-label={pill}>
                  {pill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {projects.reserved.map((entry) => (
          <div
            key={entry.name}
            className={`project-card reserved ${entry.accent ?? ""}`}
          >
            <div className="project-head">
              <span className="project-icon" aria-hidden>
                {"src" in entry.icon ? (
                  <Image
                    src={entry.icon.src}
                    alt=""
                    fill
                    sizes={ICON_SIZES}
                    /* eager: the tile is 44px and above the fold, and lazy
                       loading would hold the (already cached) fetch until
                       after layout — a visible blink on every visit */
                    loading="eager"
                  />
                ) : (
                  entry.icon.emoji
                )}
              </span>
              <span className="project-title">
                <span className="entry-name">{entry.name}</span>
              </span>
              <span className="project-year">{entry.year ?? "soon"}</span>
            </div>
            <p className="entry-bio">{entry.bio}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
