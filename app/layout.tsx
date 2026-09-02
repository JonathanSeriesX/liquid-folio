import "./globals.css";

import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";

import { bodyFont, fontCredit, site, socials } from "@/site.config";

import { LiquidDefs } from "./liquid-defs";
import { LiquidPointer } from "./liquid-pointer";
import { ThemeSwitch } from "./theme-switch";

/* no share image configured → the cards carry title and description only,
   which is better than pointing crawlers at a file that isn't there */
const og = site.ogImage;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  robots: { index: true, follow: true },
  // alternates.canonical is set per route in app/(tabs)/
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.wordmark,
    locale: site.locale,
    type: "website",
    url: site.url,
    images: og
      ? [{ url: og.src, width: og.width, height: og.height, alt: og.alt }]
      : undefined,
  },
  twitter: {
    card: site.twitter.card,
    creator: site.twitter.creator,
    images: og ? [og.src] : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: site.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: site.themeColor.dark },
  ],
};

const beaconToken = site.analytics.cloudflareBeaconToken;

/* a credit is worth linking when there is somewhere to link to, and worth
   printing either way */
function Credited({ label, href }: { label: string; href?: string }) {
  return href ? (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  ) : (
    <>{label}</>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: theme class is set pre-hydration by next-themes
    <html
      lang={site.lang}
      className={bodyFont.variable}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          themes={["light", "dark", "black"]}
          enableColorScheme={false}
        >
          <div className="grain" aria-hidden />
          <LiquidDefs />
          <LiquidPointer />
          {children}
          <footer className="mx-auto w-full max-w-3xl px-6">
            <div className="section flex flex-wrap items-center justify-between gap-4">
              <nav className="seg" aria-label="Social links">
                {socials.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    <Icon />
                  </a>
                ))}
              </nav>
              {fontCredit && (
                <p className="font-credit mono">
                  font:{" "}
                  <Credited label={fontCredit.name} href={fontCredit.href} />
                  {fontCredit.designer && (
                    <>
                      {" "}
                      by{" "}
                      <Credited
                        label={fontCredit.designer}
                        href={fontCredit.designerHref}
                      />
                    </>
                  )}
                </p>
              )}
              <ThemeSwitch />
            </div>
          </footer>
          {/* Cloudflare Web Analytics, classic defer variant. No token configured,
              no beacon: a fork stays untracked until its owner sets
              NEXT_PUBLIC_CF_BEACON_TOKEN. */}
          {beaconToken && (
            <script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon={JSON.stringify({ token: beaconToken })}
            />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
