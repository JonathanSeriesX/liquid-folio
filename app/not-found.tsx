import Link from "next/link";

import { site } from "@/site.config";

export const metadata = { title: `404 · ${site.wordmark}` };

/* Renders inside the root layout, so the theme, grain and footer all carry
   over — only the middle of the page changes. */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl grow flex-col items-center justify-center gap-3 px-6 pb-24 text-center">
      <p className="mono text-muted">404</p>
      <h1 className="text-2xl font-medium">There is no such page.</h1>
      <p className="text-muted">
        Whatever used to be here isn&apos;t, or never was.
      </p>
      <Link href="/" className="link mono mt-4">
        back home
      </Link>
    </main>
  );
}
