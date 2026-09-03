"use client"; // error boundaries must be Client Components

import { Ambient } from "./ambient";
import { fallbackScene } from "./scene";

/* Catches render errors below the root layout, so the shell (theme, grain,
   footer) survives and only the page body is replaced. `retry` re-renders
   the failed subtree — worth offering, since a flaky stats fetch is the most
   likely culprit here. The tab shell (and its ambient backdrop) is part of
   what gets replaced, so the page brings a backdrop of its own — the
   fallback scene, since a Client Component can't reach into site.config
   without dragging the whole thing into the bundle. */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <>
      <Ambient scene={fallbackScene} />
      <main className="mx-auto flex w-full max-w-3xl grow flex-col items-center justify-center gap-3 px-6 pb-24 text-center">
        <p className="mono text-muted">error</p>
        <h1 className="text-2xl font-medium">Something went sideways.</h1>
        <p className="text-muted">
          The page failed to render.
          {error.digest && (
            <>
              {" "}
              Digest: <span className="mono">{error.digest}</span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="link mono mt-4"
        >
          try again
        </button>
      </main>
    </>
  );
}
